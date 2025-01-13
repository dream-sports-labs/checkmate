import AutomationStatusController from '@controllers/automationStatus.controller'
import {LoaderFunctionArgs} from '@remix-run/node'
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
      resource: API.GetAutomationStatus,
    })

    const url = new URL(request.url)
    const searchParams = Object.fromEntries(url.searchParams.entries())
    const orgId = Number(searchParams['orgId'])

    if (!checkForValidId(orgId)) {
      return responseHandler({
        error: 'Invalid param orgId',
        status: 400,
      })
    }

    const automationStatusData =
      await AutomationStatusController.getAllAutomationStatus({orgId})

    return responseHandler({data: automationStatusData, status: 200})
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
