import UsersController from '@controllers/users.controller'
import {LoaderFunctionArgs} from '@remix-run/node'
import SearchParams from '@route/utils/getSearchParams'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'

export interface GetAllUsersResponse {
  userId: number
  userName: string
  email: string
  role: string
}

export interface GetAllUsersResponseType {
  userData: GetAllUsersResponse[]
  usersCount: number
}

export async function loader({request, params}: LoaderFunctionArgs) {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.GetAllUser,
    })

    const query = SearchParams.getAllUsers({params, request})

    const userData: GetAllUsersResponse[] = await UsersController.getAllUsers(
      query,
    )
    const usersCount = await UsersController.getUsersCount()
    return responseHandler({
      data: {userData, usersCount: usersCount?.[0]?.count},
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
