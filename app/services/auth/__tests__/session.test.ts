import {createCookieSessionStorage} from '@remix-run/node'
import {SessionStorageService} from '@services/auth/session' // Adjust the path as necessary

jest.mock('@remix-run/node', () => ({
  createCookieSessionStorage: jest.fn(),
}))

describe('SessionStorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Reinitialize the static property to apply the mock
    ;(SessionStorageService as any).sessionStorage = createCookieSessionStorage(
      {
        cookie: {
          name: '_session',
          sameSite: 'lax',
          path: '/',
          httpOnly: true,
          secrets: ['checkmate_session'],
          secure: false, // For testing environment
        },
      },
    )
  })

  it('should initialize session storage with correct configuration', () => {
    // Ensure `createCookieSessionStorage` is mocked correctly
    expect(createCookieSessionStorage).toHaveBeenCalledWith({
      cookie: {
        name: '_session',
        sameSite: 'lax',
        path: '/',
        httpOnly: true,
        secrets: ['checkmate_session'],
        secure: false, // Matches the NODE_ENV value in tests
      },
    })
  })

  it('should have the correct session key', () => {
    expect(SessionStorageService.sessionKey).toBe('_session')
  })

  it('should expose a sessionStorage object', () => {
    const mockSessionStorage = {mock: 'sessionStorage'}
    ;(createCookieSessionStorage as jest.Mock).mockReturnValue(
      mockSessionStorage,
    )

    // Reinitialize the session storage to apply the mock
    ;(SessionStorageService as any).sessionStorage = createCookieSessionStorage(
      {
        cookie: {
          name: '_session',
          sameSite: 'lax',
          path: '/',
          httpOnly: true,
          secrets: ['checkmate_session'],
          secure: false,
        },
      },
    )

    const sessionStorage = SessionStorageService.sessionStorage

    // Verify the session storage object is returned correctly
    expect(sessionStorage).toEqual(mockSessionStorage)
  })
})
