import RunsController from '@controllers/runs.controller'
import {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '~/routes/utilities/utils'

export const LockRunRequestSchema = z.object({
  runId: z.number().gt(0),
  projectId: z.number().gt(0),
})

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.RunLock,
    })
    if (request.headers.get('content-type') !== 'application/json') {
      return responseHandler({
        error: 'Invalid content type',
        status: 400,
      })
    }

    const queryParam = await getRequestParams(request, LockRunRequestSchema)

    const data = await RunsController.lockRun({
      ...queryParam,
      userId: user?.userId ?? 0,
    })

    const runInfo = await RunsController.getRunInfo({runId: queryParam.runId})

    if (!runInfo?.length) {
      return responseHandler({
        error: 'Run not found',
        status: 200,
      })
    }

    if (!(runInfo?.[0]?.status === 'Active')) {
      return responseHandler({
        error: 'Run is already locked',
        status: 200,
      })
    }

    return responseHandler({
      data: {
        success: Boolean(data),
        message: data
          ? 'Run Locked Successfully'
          : 'Untested cases found, Failed to lock Run',
      },
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
