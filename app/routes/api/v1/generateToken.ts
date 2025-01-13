import UsersController from '@controllers/users.controller'
import {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '~/routes/utilities/utils'

export const UserTokenGenrateAPI = z.object({
  userId: z.number().gt(0),
})

export type UserTokenGenrateAPIType = z.infer<typeof UserTokenGenrateAPI>

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.AddToken,
    })
    const data = await getRequestParams<UserTokenGenrateAPIType>(
      request,
      UserTokenGenrateAPI,
    )

    if (user && user?.userId !== data.userId) {
      return responseHandler({
        error: 'userId and token provided are not of same user',
        status: 400,
      })
    }

    const token = await UsersController.generateToken({userId: data.userId})

    return responseHandler({
      data: token,
      status: 201,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
