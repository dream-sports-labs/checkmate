import {LoaderFunctionArgs} from '@remix-run/node'
import OrgController from '~/dataController/org.controller'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'

export const loader = async ({params, request}: LoaderFunctionArgs) => {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.GetLabels,
    })
    const orgList = await OrgController.getOrgList()
    return responseHandler({data: orgList, status: 200})
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
