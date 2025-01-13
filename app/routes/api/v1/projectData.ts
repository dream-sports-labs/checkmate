import {LoaderFunctionArgs} from '@remix-run/node'
import ProjectsController from '~/dataController/projects.controller'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {logger, LogType} from '~/utils/logger'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForProjectId} from '../../utilities/utils'

export async function loader({request, params}: LoaderFunctionArgs) {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.GetProjectDetail,
    })

    const url = new URL(request.url)
    const projectId =
      Number(params.projectId) || Number(url.searchParams.get('projectId'))

    if (!checkForProjectId(projectId)) {
      return url.searchParams.get('projectId')
        ? responseHandler({
            error: 'Invalid params projectId',
            status: 400,
          })
        : responseHandler({
            error: 'Params projectId not provided',
            status: 400,
          })
    }

    const projectData = await ProjectsController.getProjectInfo(projectId)
    return responseHandler({
      data: projectData,
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
