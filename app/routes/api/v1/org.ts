import {LoaderFunctionArgs} from '@remix-run/node'
import OrgController from '~/dataController/org.controller'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'

//GET Handler
export async function loader({request}: LoaderFunctionArgs) {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.GetOrgDetails,
    })
    const url = new URL(request.url)
    const orgId = Number(url.searchParams.get('orgId'))

    if (!orgId || orgId === null || Number.isNaN(orgId)) {
      return responseHandler({error: 'Invalid param orgId', status: 400})
    }

    const orgInfo = await OrgController.getOrgInfo(orgId)

    return responseHandler({data: orgInfo[0], status: 200})
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
