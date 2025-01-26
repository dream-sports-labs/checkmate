import {User} from '@dao/users.dao'
import {ActionFunctionArgs, LoaderFunctionArgs} from '@remix-run/node'
import {Authenticator} from 'remix-auth'
import {GoogleStrategy} from 'remix-auth-google'
import UsersController from '~/dataController/users.controller'
import {
  AUTH_PROVIDER,
  AuthenticatorRoutes,
  SessionName,
  UserReturnType,
} from '~/services/auth/interfaces'
import {SessionStorageService} from '~/services/auth/session'
import {env} from '~/services/config'

type AuthRequest = LoaderFunctionArgs | ActionFunctionArgs

export class Auth {
  static authenticator = new Authenticator<User>(
    SessionStorageService.sessionStorage,
    {
      sessionKey: SessionStorageService.sessionKey,
    },
  )

  constructor() {
    Auth.authenticator.use(
      new GoogleStrategy(
        {
          clientID: env.GOOGLE_CLIENT_ID ?? '',
          clientSecret: env.GOOGLE_CLIENT_SECRET ?? '',
          callbackURL: '/callback',
          prompt: 'consent',
        },
        async (args) => {
          return await UsersController.findOrCreateUser(args.profile)
        },
      ),
    )
  }

  async getUser(request: AuthRequest['request']): Promise<UserReturnType> {
    const session = await SessionStorageService.sessionStorage.getSession(
      request.headers.get('Cookie'),
    )

    const user = session.get(SessionName) ?? null

    if (user?.ssoId) {
      try {
        const currentUser = await UsersController.getUser({ssoId: user.ssoId})
        session.set(SessionName, currentUser)
      } catch (error) {
        console.error('Error getting user:', error)
        session.unset(SessionName)
        const cookieHeader =
          await SessionStorageService.sessionStorage.commitSession(session)
        return {
          redirect: true,
          url: AuthenticatorRoutes.LOGIN,
          cookieHeader,
        }
      }
    }

    return {user: session.get(SessionName) ?? null, session}
  }

  callback({
    authProvider,
    request,
  }: {
    request: AuthRequest['request']
    authProvider: AUTH_PROVIDER
  }) {
    return Auth.authenticator.authenticate(authProvider, request, {
      failureRedirect: AuthenticatorRoutes.LOGIN,
      successRedirect: '/',
    })
  }

  async authenticate({
    authProvider,
    request,
  }: {
    request: AuthRequest['request']
    authProvider: AUTH_PROVIDER
  }) {
    return Auth.authenticator.authenticate(authProvider, request)
  }

  async isAuthenticated(request: AuthRequest['request']) {
    return await Auth.authenticator.isAuthenticated(request, {
      failureRedirect: AuthenticatorRoutes.LOGIN,
    })
  }

  async logout(request: AuthRequest['request']) {
    return await Auth.authenticator.logout(request, {
      redirectTo: AuthenticatorRoutes.LOGIN,
      headers: {
        'Clear-Site-Data': 'cookies',
      },
    })
  }

  async authenticateToken(token: string) {
    return await UsersController.authenticateToken({token})
  }
}

const AuthenticatorService = new Auth()

export {AuthenticatorService}
