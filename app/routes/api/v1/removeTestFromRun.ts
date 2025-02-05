import RunsController from '@controllers/runs.controller'
import TestRunsController from '@controllers/testRuns.controller'
import {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {RUN_IS_LOCKED} from '~/constants'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForRunId, getRequestParams} from '~/routes/utilities/utils'

const RemoveTestFromRunRequestSchema = z.object({
  runId: z.number(),
  projectId: z.number(),
  testIds: z.array(z.number()),
})

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.RunRemoveTest,
    })

    if (request.headers.get('content-type') !== 'application/json') {
      return responseHandler({
        error: 'Invalid content type',
        status: 400,
      })
    }

    const {runId, projectId, testIds} = await getRequestParams(
      request,
      RemoveTestFromRunRequestSchema,
    )

    if (!checkForRunId(runId)) {
      return responseHandler({
        error: 'Params runId not provided',
        status: 400,
      })
    }

    const runInfo = await RunsController.getRunInfo({runId})

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

    const data = await TestRunsController.deleteTestFromRun({
      testIds,
      runId,
      projectId,
      updatedBy: user?.userId ?? 0,
    })

    if (data?.[0].affectedRows === testIds.length)
      return responseHandler({
        data: {success: true, message: 'Tests removed successfully'},
        status: 200,
      })
    else if (data?.[0].affectedRows === 0) {
      throw new Error('No Tests Deleted')
    }
    return responseHandler({
      data: {success: false, message: 'Some Tests not deleted'},
      status: 201,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
