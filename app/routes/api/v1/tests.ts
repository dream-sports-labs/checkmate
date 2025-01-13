import {LoaderFunctionArgs} from '@remix-run/node'
import SearchParams from '@route/utils/getSearchParams'
import TestsController from '~/dataController/tests.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {API} from '../../utilities/api'

export async function loader({params, request}: LoaderFunctionArgs) {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.GetTests,
    })

    const searchParams = SearchParams.getTests({params, request})
    const testsData = await TestsController.getTests(searchParams)

    return responseHandler({
      data: testsData,
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
