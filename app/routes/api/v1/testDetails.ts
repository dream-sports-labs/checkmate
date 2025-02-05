import TestsController from '@controllers/tests.controller'
import {LoaderFunctionArgs} from '@remix-run/node'
import {API} from '@route/utils/api'
import {getUserAndCheckAccess} from '@route/utils/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForProjectId, checkForTestId} from '../../utilities/utils'

export interface TestDetailsResponse {
  title: string
  section: string
  squad: string
  priority: string
  automationStatus: string
  type: string
  platform: string
  testCoveredBy: string
  jiraTicket: string
  defects: string
  preConditions: string
  steps: string
  expectedResult: string
  labelNames: string
  additionalGroups: string
  automationId: string
  sectionId: number
  sectionParentId: number | null
  description: string
}

export async function loader({params, request}: LoaderFunctionArgs) {
  try {
    await getUserAndCheckAccess({request, resource: API.GetTestDetails})
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
