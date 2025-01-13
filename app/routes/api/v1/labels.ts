import {LoaderFunctionArgs} from '@remix-run/node'
import LabelsController from '~/dataController/labels.controller'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForValidId} from '../../utilities/utils'

export async function loader({params, request}: LoaderFunctionArgs) {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.GetLabels,
    })

    const url = new URL(request.url)
    const projectId =
      Number(params.projectId) || Number(url.searchParams.get('projectId'))

    if (!checkForValidId(projectId)) {
      return responseHandler({
        error: 'Invalid param projectId',
        status: 400,
      })
    }

    const labelsData = await LabelsController.getAllLabels({
      projectId,
    })
    return responseHandler({data: labelsData, status: 200})
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
