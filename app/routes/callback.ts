import {AuthenticatorService} from '~/services/auth/Auth.server'
import {LoaderFunctionArgs} from '@remix-run/node'
import {AUTH_PROVIDER} from '@services/auth/interfaces'

export const loader = async ({request}: LoaderFunctionArgs) => {
  return AuthenticatorService.callback({
    authProvider: AUTH_PROVIDER.GOOGLE,
    request,
  })
}
