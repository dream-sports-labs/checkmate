import {createCookieSessionStorage} from '@remix-run/node'
import {SessionName} from './interfaces'

export class SessionStorageService {
  static sessionKey = SessionName
  static sessionStorage = createCookieSessionStorage({
    cookie: {
      name: SessionStorageService.sessionKey,
      sameSite: 'lax',
      path: '/',
      httpOnly: true,
      secrets: ['checkmate_session'],
      secure: process.env.NODE_ENV === 'production',
    },
  })
}
