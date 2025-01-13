import UsersController from '@controllers/users.controller'
import {LoaderFunctionArgs} from '@remix-run/node'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'

export interface UserDetailsResponseType {
  userId?: number
  userName: string
  email?: string
  ssoId?: string | null
  profileUrl?: string | null
  token?: string | null
  role?: string | null
}

export async function loader({request}: LoaderFunctionArgs) {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.GetUserDetails,
    })

    const userId = user?.userId

    const userData: UserDetailsResponseType = await UsersController.getUser({
      userId,
    })
    return responseHandler({data: userData, status: 200})
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
