import {Session} from '@remix-run/node'
import {User} from '~/db/dao/users.dao'
import {
  AuthenticatorRoutes,
  GetUserReturnType,
  UserReturnType,
} from '@services/auth/interfaces' // Adjust the path as necessary

describe('AuthenticatorRoutes', () => {
  it('should define the correct routes', () => {
    expect(AuthenticatorRoutes.LOGIN).toBe('/login')
    expect(AuthenticatorRoutes.LOGOUT).toBe('/logout')
  })
})

describe('GetUserReturnType', () => {
  it('should allow null user with a valid session', () => {
    const mockSession = {
      id: 'session-id',
      data: {},
    } as Session

    const result: GetUserReturnType = {
      user: null,
      session: mockSession,
    }

    expect(result.user).toBeNull()
    expect(result.session).toEqual(mockSession)
  })

  it('should allow a valid user with a session', () => {
    const mockSession = {
      id: 'session-id',
      data: {},
    } as Session

    const mockUser: User = {
      userId: 1,
      email: 'test@example.com',
      userName: 'Test User',
      role: 'admin',
    }

    const result: GetUserReturnType = {
      user: mockUser,
      session: mockSession,
    }

    expect(result.user).toEqual(mockUser)
    expect(result.session).toEqual(mockSession)
  })
})

describe('UserReturnType', () => {
  it('should allow a redirect response', () => {
    const redirectResponse: UserReturnType = {
      redirect: true,
      url: '/login',
      cookieHeader: 'Set-Cookie: session-id=123',
    }

    expect(redirectResponse.redirect).toBe(true)
    expect(redirectResponse.url).toBe('/login')
    expect(redirectResponse.cookieHeader).toBe('Set-Cookie: session-id=123')
    expect(redirectResponse.user).toBeUndefined()
  })

  it('should allow a user response with session', () => {
    const mockSession = {
      id: 'session-id',
      data: {},
    } as Session

    const mockUser: User = {
        userId: 1,
        email: 'test@example.com',
        userName: 'Test User',
        role: 'admin',
      }

    const userResponse: UserReturnType = {
      user: mockUser,
      session: mockSession,
    }

    expect(userResponse.user).toEqual(mockUser)
    expect(userResponse.session).toEqual(mockSession)
  })
})
