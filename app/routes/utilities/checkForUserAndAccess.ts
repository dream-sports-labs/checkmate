import {API, ApiToTypeMap} from './api'
import {getUser} from './authenticate'
import {ACCESS_ERROR_MESSAGE} from './constants'
import {isUserAllowedToAccess} from './isAllowedToAccess'

export const getUserAndCheckAccess = async (param: {
  request: Request
  resource: API
}) => {
  const user = await getUser(param.request)

  const isAllowed = await isUserAllowedToAccess({
    resource: param.resource.replace(/^api\/v[0-9]+\//, ''),
    action: ApiToTypeMap[param.resource],
    userId: user?.userId ?? 0,
    role: user?.role,
  })

  if (!isAllowed) {
    throw new Error(ACCESS_ERROR_MESSAGE)
  }

  return user
}
