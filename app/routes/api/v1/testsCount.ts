import {LoaderFunctionArgs} from '@remix-run/node'
import {ErrorCause} from '~/constants'
import TestsController, {
  ITestsCountController,
} from '~/dataController/tests.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {logger, LogType} from '~/utils/logger'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {API} from '../../utilities/api'
import SearchParams from '@route/utils/getSearchParams'

export async function loader({params, request}: LoaderFunctionArgs) {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.GetTestsCount,
    })
    const searchParams: ITestsCountController = SearchParams.getTestCount({
      params,
      request,
    })

    const testsCount = await TestsController.getTestsCount(searchParams)
    return responseHandler({
      data: testsCount,
      status: 200,
    })
  } catch (error: any) {
    if (error.cause == ErrorCause.INVALID_PARAMS) {
      logger({
        type: LogType.ERROR,
        message: error.message,
        tag: API.GetTestsCount,
      })
      return responseHandler({error: error.message, status: 400})
    } else {
      return errorResponseHandler(error)
    }
  }
}
