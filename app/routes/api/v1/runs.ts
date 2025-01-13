import {LoaderFunctionArgs} from '@remix-run/node'

import {ErrorCause} from '~/constants'
import RunsController, {RunsStatus} from '~/dataController/runs.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {logger, LogType} from '~/utils/logger'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {API} from '../../utilities/api'
import {checkForProjectId} from '../../utilities/utils'

export async function loader({params, request}: LoaderFunctionArgs) {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.GetRuns,
    })

    const url = new URL(request.url)
    const projectId = Number(params.projectId)
      ? Number(params.projectId)
      : Number(url.searchParams.get('projectId'))
    const page = Number(url.searchParams.get('page'))
    const pageSize = Number(url.searchParams.get('pageSize'))
    const search = url.searchParams.get('search') ?? ''
    const status = url.searchParams.get('status') ?? undefined

    if (!checkForProjectId(projectId))
      return url.searchParams.get('projectId')
        ? responseHandler({
            error: 'Invalid params projectId',
            status: 400,
          })
        : responseHandler({
            error: 'Params projectId not provided',
            status: 400,
          })

    const runsData = await RunsController.getAllRuns({
      projectId,
      pageSize,
      page,
      search,
      status: status as RunsStatus,
    })
    return responseHandler({
      data: {runsData, projectId},
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
