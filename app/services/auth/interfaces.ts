import {Session, SessionData} from '@remix-run/node'
import {User} from '~/db/dao/users.dao'

export enum AuthenticatorRoutes {
  LOGIN = '/login',
  LOGOUT = '/logout',
}

export type GetUserReturnType = {
  user: null | User
  session: Session<SessionData, SessionData>
}

// Define a type for a redirect response
interface RedirectResponse {
  redirect: true
  url: string
  cookieHeader: string
  user?: never
}

export type UserReturnType = GetUserReturnType | RedirectResponse
