import {LoaderFunctionArgs} from '@remix-run/node'
import {AuthenticatorService} from '~/services/auth/Auth.server'

export let action = async ({request}: LoaderFunctionArgs) => {
  return AuthenticatorService.logout(request)
}
