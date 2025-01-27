import {createCookieSessionStorage} from '@remix-run/node'
import {SessionStorageService} from '@services/auth/session'
import {SESSION_NAME} from '../interfaces'

jest.mock('@remix-run/node', () => ({
  createCookieSessionStorage: jest.fn(),
}))

describe('SessionStorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(SessionStorageService as any).sessionStorage = createCookieSessionStorage(
      {
        cookie: {
          name: SESSION_NAME,
          sameSite: 'lax',
          path: '/',
          httpOnly: true,
          secrets: ['checkmate_session'],
          secure: false,
        },
      },
    )
  })

  it('should initialize session storage with correct configuration', () => {
    expect(createCookieSessionStorage).toHaveBeenCalledWith({
      cookie: {
        name: SESSION_NAME,
        sameSite: 'lax',
        path: '/',
        httpOnly: true,
        secrets: ['checkmate_session'],
        secure: false,
      },
    })
  })

  it('should have the correct session key', () => {
    expect(SessionStorageService.sessionKey).toBe(SESSION_NAME)
  })

  it('should expose a sessionStorage object', () => {
    const mockSessionStorage = {mock: 'sessionStorage'}
    ;(createCookieSessionStorage as jest.Mock).mockReturnValue(
      mockSessionStorage,
    )
    ;(SessionStorageService as any).sessionStorage = createCookieSessionStorage(
      {
        cookie: {
          name: SESSION_NAME,
          sameSite: 'lax',
          path: '/',
          httpOnly: true,
          secrets: ['checkmate_session'],
          secure: false,
        },
      },
    )

    const sessionStorage = SessionStorageService.sessionStorage

    expect(sessionStorage).toEqual(mockSessionStorage)
  })
})
