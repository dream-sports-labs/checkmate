import UsersController from '@controllers/users.controller'
import type {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '../../utilities/utils'

const updateUserRoleSchema = z.object({
  userId: z.number().gt(0),
  newRole: z.enum(['reader', 'user', 'admin']),
})

export type UpdateUserRoleSchemaAPIType = z.infer<typeof updateUserRoleSchema>

export async function action({request}: ActionFunctionArgs) {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.UpdateUserRole,
    })

    const data = await getRequestParams<UpdateUserRoleSchemaAPIType>(
      request,
      updateUserRoleSchema,
    )

    const resp = await UsersController.updateUserRole({
      ...data,
      updatedBy: user?.userId ?? 0,
      userId: data.userId,
    })

    const affectedRows = resp?.[0]?.affectedRows
    if (affectedRows)
      return responseHandler({
        data: {
          message: 'User Updated Successfully',
        },
        status: 200,
      })
    else {
      throw new Error('User not Updated')
    }
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
