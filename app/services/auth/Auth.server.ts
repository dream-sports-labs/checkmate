import {ActionFunctionArgs, LoaderFunctionArgs} from '@remix-run/node'
import {Authenticator} from 'remix-auth'
import {GoogleStrategy} from 'remix-auth-google'
import UsersController from '~/dataController/users.controller'
import {AuthenticatorRoutes, UserReturnType} from '~/services/auth/interfaces'
import {SessionStorageService} from '~/services/auth/session'
import {env} from '~/services/config'

type AuthRequest = LoaderFunctionArgs | ActionFunctionArgs

export class Auth {
  static authenticator = new Authenticator(
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

    const user = session.get('_session') ?? null

    if (user?.ssoId) {
      try {
        const currentUser = await UsersController.getUser({ssoId: user.ssoId})
        session.set('_session', currentUser)
      } catch (error) {
        console.error('Error getting user:', error)
        session.unset('_session')
        const cookieHeader =
          await SessionStorageService.sessionStorage.commitSession(session)
        return {
          redirect: true,
          url: AuthenticatorRoutes.LOGIN,
          cookieHeader,
        }
      }
    }

    return {user: session.get('_session') ?? null, session}
  }

  callback(request: AuthRequest['request']) {
    return Auth.authenticator.authenticate('google', request, {
      failureRedirect: AuthenticatorRoutes.LOGIN,
      successRedirect: '/',
    })
  }

  async authenticate(request: AuthRequest['request']) {
    return Auth.authenticator.authenticate('google', request)
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
