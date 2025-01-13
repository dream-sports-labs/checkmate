import {LoaderFunctionArgs} from '@remix-run/node'
import SectionsController from '~/dataController/sections.controller'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForProjectId} from '../../utilities/utils'
import {ErrorCause} from '~/constants'

export async function loader({request, params}: LoaderFunctionArgs) {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.GetSections,
    })

    const url = new URL(request.url)

    const projectId = params.projectId
      ? Number(params.projectId)
      : Number(url.searchParams.get('projectId'))

    if (!checkForProjectId(projectId))
      throw new Error('Invalid projectId', {cause: ErrorCause.INVALID_PARAMS})

    const sectionsData = await SectionsController.getAllSections({projectId})
    return responseHandler({data: sectionsData, status: 200})
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
