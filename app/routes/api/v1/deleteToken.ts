import UsersController from '@controllers/users.controller'
import {LoaderFunctionArgs} from '@remix-run/node'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  TOKEN_DELETED_SUCCESSFULLY,
  TOKEN_DELETION_UNSUCCESSFUL,
} from '~/routes/utilities/constants'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '~/routes/utilities/utils'
import {UserTokenGenrateAPI, UserTokenGenrateAPIType} from './generateToken'

export const action = async ({request}: LoaderFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.DeleteToken,
    })
    const data = await getRequestParams<UserTokenGenrateAPIType>(
      request,
      UserTokenGenrateAPI,
    )

    if (user && user?.userId !== data.userId) {
      return responseHandler({
        error: 'userId and token provided not of same user',
        status: 401,
      })
    }
    const token = await UsersController.deleteToken({userId: data.userId})
    return responseHandler({
      data: {
        message: token?.[0]?.affectedRows
          ? TOKEN_DELETED_SUCCESSFULLY
          : TOKEN_DELETION_UNSUCCESSFUL,
      },
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
