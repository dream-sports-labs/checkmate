import {AuthenticatorService} from '~/services/auth/Auth.server'
import {LoaderFunctionArgs} from '@remix-run/node'

export const loader = async ({request}: LoaderFunctionArgs) => {
  return AuthenticatorService.callback(request)
}
