import {LoaderFunctionArgs} from '@remix-run/node'
import SearchParams from '@route/utils/getSearchParams'
import TestRunsController from '~/dataController/testRuns.controller'
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
      resource: API.GetRunTestsList,
    })

    const searchParams = SearchParams.getRunTests({params, request})

    const testRunsData = await TestRunsController.getAllTestRuns(searchParams)
    return responseHandler({
      data: testRunsData,
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
