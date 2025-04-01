import PlatformController from '@controllers/platform.controller'
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
      resource: API.GetPlatforms,
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

    const platformData = await PlatformController.getAllPlatform({orgId})
    return responseHandler({data: platformData, status: 200})
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
