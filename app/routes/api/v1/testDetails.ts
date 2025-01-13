import {LoaderFunctionArgs} from '@remix-run/node'
import {checkForProjectId, checkForTestId} from '../../utilities/utils'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import TestsController from '@controllers/tests.controller'
import {getUser} from '../../utilities/authenticate'

export async function loader({params, request}: LoaderFunctionArgs) {
  try {
    await getUser(request)
    const url = new URL(request.url)
    const searchParams = Object.fromEntries(url.searchParams.entries())
    const projectId = Number(searchParams['projectId'] ?? params.projectId)
    const testId = Number(searchParams['testId'] ?? params.testId)

    if (!checkForProjectId(projectId)) {
      return responseHandler({
        error: 'Invalid param projectId',
        status: 400,
      })
    }

    if (!checkForTestId(testId)) {
      return responseHandler({
        error: 'Invalid param testId',
        status: 400,
      })
    }

    const testDetailsData = await TestsController.getTestDetails(
      projectId,
      testId,
    )
    return responseHandler({data: testDetailsData, status: 200})
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
