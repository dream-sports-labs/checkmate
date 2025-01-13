import {LoaderFunctionArgs} from '@remix-run/node'
import RunsController from '~/dataController/runs.controller'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForRunId} from '../../utilities/utils'

export interface RunDetails {
  createdBy: number
  createdOn: string
  lockedBy: number | null
  lockedOn: string | null
  projectId: number
  reference: string | null
  runDescription: string
  runId: number
  runName: string
  status: string
  updatedBy: number | null
  updatedOn: string
}

export async function loader({params, request}: LoaderFunctionArgs) {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.RunDetail,
    })

    const url = new URL(request.url)
    const runId = params.runId
      ? Number(params.runId)
      : Number(url.searchParams.get('runId'))

    if (!checkForRunId(runId)) {
      return url.searchParams.get('runId')
        ? responseHandler({
            error: 'Invalid params runId or projectId',
            status: 400,
          })
        : responseHandler({
            error: 'Params runId or projectId not provided',
            status: 400,
          })
    }

    const runData = await RunsController.getRunInfo({runId})
    return responseHandler({
      data: runData?.[0],
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
