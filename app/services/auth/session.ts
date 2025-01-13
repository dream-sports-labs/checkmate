import {createCookieSessionStorage} from '@remix-run/node'

export class SessionStorageService {
  static sessionKey = '_session'
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
