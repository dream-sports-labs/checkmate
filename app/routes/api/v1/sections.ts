import {LoaderFunctionArgs} from '@remix-run/node'
import SearchParams from '@route/utils/getSearchParams'
import SectionsController from '~/dataController/sections.controller'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'

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
