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
import SearchParams from '@route/utils/getSearchParams'

export async function loader({request, params}: LoaderFunctionArgs) {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.GetSections,
    })

    const data = SearchParams.getSections({params, request})
    const sectionsData = await SectionsController.getAllSections(data)
    return responseHandler({data: sectionsData, status: 200})
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
