import {User} from '@dao/users.dao'
import {AuthenticatorService} from '@services/auth/Auth.server'
import {LOGOUT_ERROR_MESSAGE} from './constants'

const checkForAuthToken = async (request: Request) => {
  if (!request.headers.get('Authorization')) {
    return null
  }
  if (!request.headers.get('Authorization')?.startsWith('Bearer ')) {
    return null
  }
  const authHeader = request.headers.get('Authorization')
  const bearerToken = authHeader?.split(' ')?.[1]?.trim() ?? ''
  if (bearerToken) {
    const user = await AuthenticatorService.authenticateToken(bearerToken)
    return user ?? null
  }
  return null
}

export async function getUser(request: Request): Promise<User | undefined> {
  const user = await AuthenticatorService.getUser(request)
  if (user.user) return user.user

  const tokenUser = await checkForAuthToken(request)
  if (tokenUser) {
    return tokenUser
  }
  throw new Error(LOGOUT_ERROR_MESSAGE)
}
