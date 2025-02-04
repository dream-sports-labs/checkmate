import RunsController from '@controllers/runs.controller'
import TestRunsController from '@controllers/testRuns.controller'
import {ActionFunctionArgs} from '@remix-run/node'
import {MySqlRawQueryResult} from 'drizzle-orm/mysql2'
import {z} from 'zod'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {logger, LogType} from '~/utils/logger'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '../../utilities/utils'
import {RUN_IS_LOCKED} from '~/constants'

const MarkPassedAsRetestSchema = z.object({
  runId: z.number().gt(0),
})

type MarkPassedAsRetestAPIType = z.infer<typeof MarkPassedAsRetestSchema>

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.RunReset,
    })

    const queryData = await getRequestParams<MarkPassedAsRetestAPIType>(
      request,
      MarkPassedAsRetestSchema,
    )

    const runInfo = await RunsController.getRunInfo({runId: queryData.runId})
    if (!runInfo?.length) {
      return responseHandler({
        error: 'Run not found',
        status: 400,
      })
    }
    if (!(runInfo?.[0]?.status === 'Active')) {
      return responseHandler({
        error: RUN_IS_LOCKED,
        status: 423,
      })
    }

    const data: {testIds: number[]; data: MySqlRawQueryResult} | undefined =
      await TestRunsController.markPassedAsRetest({
        runId: queryData.runId,
        userId: user?.userId ?? 0,
      })

    return responseHandler({
      data: {
        count: data?.data?.[0]?.affectedRows ?? 0,
        message: `Successfully updated ${
          data?.data?.[0]?.affectedRows ?? 0
        } tests`,
        testIds: data?.testIds,
      },
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
