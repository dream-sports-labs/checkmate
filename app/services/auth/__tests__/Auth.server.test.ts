import {Auth} from '@services/auth/Auth.server'
import {SessionStorageService} from '~/services/auth/session'
import UsersController from '~/dataController/users.controller'
import {
  AUTH_PROVIDER,
  AuthenticatorRoutes,
  SESSION_NAME,
} from '~/services/auth/interfaces'
import {env} from '~/services/config'
import {Authenticator} from 'remix-auth'
import {GoogleStrategy} from 'remix-auth-google'
import {User} from '@dao/users.dao'

jest.mock('~/services/auth/session')
jest.mock('~/dataController/users.controller')
jest.mock('~/services/config', () => ({
  env: {
    GOOGLE_CLIENT_ID: 'mock-client-id',
    GOOGLE_CLIENT_SECRET: 'mock-client-secret',
  },
}))
jest.mock('remix-auth')
jest.mock('remix-auth-google')

describe('Auth Service', () => {
  let mockRequest: Request
  let mockSession: any
  let auth: Auth
  let mockAuthenticator: jest.Mocked<Authenticator<User>>
  let mockGoogleStrategy: any

  beforeEach(() => {
    jest.clearAllMocks()

    mockRequest = new Request('http://localhost', {
      headers: {
        Cookie: 'mockCookie',
      },
    })

    mockSession = {
      get: jest.fn((key: string) =>
        key === SESSION_NAME ? {ssoId: 'mockSsoId'} : null,
      ),
      set: jest.fn(),
      unset: jest.fn(),
    }

    // Create a proper mock for GoogleStrategy
    mockGoogleStrategy = {
      name: 'google',
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
      callbackURL: '/callback',
      prompt: 'consent',
    }
    ;(GoogleStrategy as jest.Mock).mockImplementation((config) => ({
      ...mockGoogleStrategy,
      ...config,
    }))

    // Create a proper mock for the authenticator
    const mockUse = jest.fn().mockReturnThis()
    const mockAuthenticate = jest
      .fn()
      .mockImplementation((provider, request) => {
        if (provider === 'google') {
          return Promise.resolve({
            userId: 1,
            userName: 'Test User',
            email: 'test@example.com',
            profileUrl: 'https://example.com/profile',
            accessToken: 'mock-token',
            refreshToken: 'mock-refresh-token',
            expiresAt: new Date().toISOString(),
            ssoId: 'mock-sso-id',
            token: 'mock-token',
            role: 'user',
          } as User)
        }
        throw new Error('Invalid auth provider')
      })
    const mockIsAuthenticated = jest.fn().mockResolvedValue(true)
    const mockLogout = jest.fn().mockResolvedValue(new Response())

    mockAuthenticator = {
      use: mockUse,
      authenticate: mockAuthenticate,
      isAuthenticated: mockIsAuthenticated,
      logout: mockLogout,
    } as unknown as jest.Mocked<Authenticator<User>>

    // Mock the static authenticator property
    Auth.authenticator = mockAuthenticator

    // Mock session storage
    ;(
      SessionStorageService.sessionStorage.getSession as jest.Mock
    ).mockImplementation((cookie) => {
      if (!cookie) {
        return Promise.resolve({
          get: () => null,
          set: jest.fn(),
          unset: jest.fn(),
        })
      }
      return Promise.resolve(mockSession)
    })
    ;(
      SessionStorageService.sessionStorage.commitSession as jest.Mock
    ).mockResolvedValue('Set-Cookie: mockSession')

    // Mock UsersController
    ;(UsersController.getUser as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      ssoId: 'mockSsoId',
    })
    ;(UsersController.authenticateToken as jest.Mock).mockImplementation(
      (params) => {
        if (!params.token) {
          return Promise.reject(new Error('Token is required'))
        }
        return Promise.resolve({
          id: 1,
          name: 'Authenticated User',
        })
      },
    )

    auth = new Auth()
  })

  describe('constructor', () => {
    it('should initialize GoogleStrategy with correct configuration', () => {
      expect(mockAuthenticator.use).toHaveBeenCalled()
      const strategy = (mockAuthenticator.use as jest.Mock).mock.calls[0][0]
      expect(strategy).toHaveProperty('name', 'google')
      expect(strategy).toHaveProperty('clientID', 'mock-client-id')
      expect(strategy).toHaveProperty('clientSecret', 'mock-client-secret')
      expect(strategy).toHaveProperty('callbackURL', '/callback')
      expect(strategy).toHaveProperty('prompt', 'consent')
    })

    it('should use empty strings for missing Google credentials', () => {
      // Reset modules to clear the mock
      jest.resetModules()
      jest.clearAllMocks()

      // Mock the config module with empty credentials
      const mockEnv = {
        GOOGLE_CLIENT_ID: '',
        GOOGLE_CLIENT_SECRET: '',
      }

      // Create a new mock authenticator for this test
      const newMockAuthenticator = {
        use: jest.fn().mockReturnThis(),
      } as unknown as jest.Mocked<Authenticator<User>>

      // Mock the GoogleStrategy constructor
      const mockGoogleStrategy = jest.fn()
      ;(GoogleStrategy as unknown) = mockGoogleStrategy

      // Mock the Authenticator constructor
      ;(Authenticator as jest.Mock).mockImplementation(
        () => newMockAuthenticator,
      )

      // Re-mock all required modules
      jest.mock('~/services/config', () => ({
        env: mockEnv,
      }))
      jest.mock('remix-auth', () => ({
        Authenticator: jest.fn().mockImplementation(() => newMockAuthenticator),
      }))
      jest.mock('remix-auth-google', () => ({
        GoogleStrategy: mockGoogleStrategy,
      }))
      jest.mock('~/services/auth/session')
      jest.mock('~/dataController/users.controller')

      // Re-import the Auth class
      const {Auth: NewAuth} = require('@services/auth/Auth.server')

      // Set the static authenticator property
      NewAuth.authenticator = newMockAuthenticator

      const newAuth = new NewAuth()

      // Verify that GoogleStrategy was called with empty credentials
      expect(mockGoogleStrategy).toHaveBeenCalledWith(
        {
          clientID: '',
          clientSecret: '',
          callbackURL: '/callback',
          prompt: 'consent',
        },
        expect.any(Function),
      )
    })
  })

  describe('getUser', () => {
    it('should return the user and session when user exists in session', async () => {
      const result = await auth.getUser(mockRequest)

      expect(
        SessionStorageService.sessionStorage.getSession,
      ).toHaveBeenCalledWith('mockCookie')
      expect(result.user).toEqual({
        ssoId: 'mockSsoId',
      })
      expect(mockSession.set).toHaveBeenCalledWith(SESSION_NAME, {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        ssoId: 'mockSsoId',
      })
    })

    it('should redirect to login if user retrieval fails', async () => {
      ;(UsersController.getUser as jest.Mock).mockRejectedValue(
        new Error('User not found'),
      )

      const result = await auth.getUser(mockRequest)

      expect(mockSession.unset).toHaveBeenCalledWith(SESSION_NAME)
      expect(
        SessionStorageService.sessionStorage.commitSession,
      ).toHaveBeenCalledWith(mockSession)
      expect(result).toEqual({
        redirect: true,
        url: AuthenticatorRoutes.LOGIN,
        cookieHeader: 'Set-Cookie: mockSession',
      })
    })

    it('should handle missing session cookie', async () => {
      const requestWithoutCookie = new Request('http://localhost')
      const result = await auth.getUser(requestWithoutCookie)

      expect(
        SessionStorageService.sessionStorage.getSession,
      ).toHaveBeenCalledWith(null)
      expect(result.user).toBeNull()
    })

    it('should handle session with no user data', async () => {
      mockSession.get.mockReturnValue(null)
      const result = await auth.getUser(mockRequest)

      expect(result.user).toBeNull()
      expect(mockSession.set).not.toHaveBeenCalled()
    })

    it('should handle session with user but no ssoId', async () => {
      mockSession.get.mockReturnValue({name: 'Test User'})
      const result = await auth.getUser(mockRequest)

      expect(result.user).toEqual({name: 'Test User'})
      expect(UsersController.getUser).not.toHaveBeenCalled()
    })
  })

  describe('authenticate', () => {
    it('should authenticate the user', async () => {
      const mockUser = {
        userId: 1,
        userName: 'Test User',
        email: 'test@example.com',
        profileUrl: 'https://example.com/profile',
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: new Date().toISOString(),
        ssoId: 'mock-sso-id',
        token: 'mock-token',
        role: 'user',
      } as User
      mockAuthenticator.authenticate.mockResolvedValue(mockUser)

      const result = await auth.authenticate({
        request: mockRequest,
        authProvider: AUTH_PROVIDER.GOOGLE,
      })

      expect(mockAuthenticator.authenticate).toHaveBeenCalledWith(
        'google',
        mockRequest,
      )
      expect(result).toBe(mockUser)
    })

    it('should handle invalid auth provider', async () => {
      await expect(
        auth.authenticate({
          request: mockRequest,
          authProvider: 'invalid' as AUTH_PROVIDER,
        }),
      ).rejects.toThrow('Invalid auth provider')
    })
  })

  describe('authenticateToken', () => {
    it('should authenticate the token using UsersController', async () => {
      const result = await auth.authenticateToken('mockToken')

      expect(UsersController.authenticateToken).toHaveBeenCalledWith({
        token: 'mockToken',
      })
      expect(result).toEqual({
        id: 1,
        name: 'Authenticated User',
      })
    })

    it('should handle invalid token', async () => {
      ;(UsersController.authenticateToken as jest.Mock).mockRejectedValue(
        new Error('Invalid token'),
      )

      await expect(auth.authenticateToken('invalid-token')).rejects.toThrow(
        'Invalid token',
      )
    })

    it('should handle empty token', async () => {
      await expect(auth.authenticateToken('')).rejects.toThrow(
        'Token is required',
      )
    })
  })

  describe('isAuthenticated', () => {
    it('should verify if the user is authenticated', async () => {
      const mockUser = {
        userId: 1,
        userName: 'Test User',
        email: 'test@example.com',
        profileUrl: 'https://example.com/profile',
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: new Date().toISOString(),
        ssoId: 'mock-sso-id',
        token: 'mock-token',
        role: 'user',
      } as User

      // Update the mock implementation
      mockAuthenticator.isAuthenticated = jest.fn().mockResolvedValue(mockUser)

      const result = await auth.isAuthenticated(mockRequest)

      expect(mockAuthenticator.isAuthenticated).toHaveBeenCalledWith(
        mockRequest,
        {
          failureRedirect: AuthenticatorRoutes.LOGIN,
        },
      )
      expect(result).toBe(mockUser)
    })

    it('should handle authentication failure', async () => {
      mockAuthenticator.isAuthenticated = jest
        .fn()
        .mockRejectedValue(new Error('Not authenticated'))

      await expect(auth.isAuthenticated(mockRequest)).rejects.toThrow(
        'Not authenticated',
      )
    })
  })

  describe('logout', () => {
    it('should log out the user and redirect to login', async () => {
      const mockResponse = new Response()
      mockAuthenticator.logout.mockResolvedValue(mockResponse as never)

      const result = await auth.logout(mockRequest)

      expect(mockAuthenticator.logout).toHaveBeenCalledWith(mockRequest, {
        redirectTo: AuthenticatorRoutes.LOGIN,
        headers: {
          'Clear-Site-Data': 'cookies',
        },
      })
      expect(result).toBe(mockResponse)
    })

    it('should handle logout failure', async () => {
      mockAuthenticator.logout.mockRejectedValue(new Error('Logout failed'))

      await expect(auth.logout(mockRequest)).rejects.toThrow('Logout failed')
    })
  })
})
