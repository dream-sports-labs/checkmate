import {createCookieSessionStorage} from '@remix-run/node'
import {SESSION_NAME} from './interfaces'

export class SessionStorageService {
  static sessionKey = SESSION_NAME
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
