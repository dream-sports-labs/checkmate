import {Auth} from '@services/auth/Auth.server' // Adjust the path as necessary
import {SessionStorageService} from '~/services/auth/session'
import UsersController from '~/dataController/users.controller'
import {AuthenticatorRoutes} from '~/services/auth/interfaces'

jest.mock('~/services/auth/session')
jest.mock('~/dataController/users.controller')

describe('Auth Service', () => {
  let mockRequest: Request
  let mockSession: any

  beforeEach(() => {
    jest.clearAllMocks()

    mockRequest = new Request('http://localhost', {
      headers: {
        Cookie: 'mockCookie',
      },
    })

    mockSession = {
      get: jest.fn((key: string) =>
        key === '_session' ? {ssoId: 'mockSsoId'} : null,
      ),
      set: jest.fn(),
      unset: jest.fn(),
    }
    ;(
      SessionStorageService.sessionStorage.getSession as jest.Mock
    ).mockResolvedValue(mockSession)
    ;(
      SessionStorageService.sessionStorage.commitSession as jest.Mock
    ).mockResolvedValue('Set-Cookie: mockSession')
    ;(UsersController.getUser as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      ssoId: 'mockSsoId',
    })
    ;(UsersController.authenticateToken as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Authenticated User',
    })
  })

  describe('getUser', () => {
    it('should return the user and session when user exists in session', async () => {
      const result = await new Auth().getUser(mockRequest)
      console.log('Resulting user:', result.user)

      expect(
        SessionStorageService.sessionStorage.getSession,
      ).toHaveBeenCalledWith('mockCookie')
      expect(result.user).toEqual({
        ssoId: 'mockSsoId',
      })
      expect(mockSession.set).toHaveBeenCalledWith('_session', {
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

      const result = await new Auth().getUser(mockRequest)

      expect(mockSession.unset).toHaveBeenCalledWith('_session')
      expect(
        SessionStorageService.sessionStorage.commitSession,
      ).toHaveBeenCalledWith(mockSession)
      expect(result).toEqual({
        redirect: true,
        url: AuthenticatorRoutes.LOGIN,
        cookieHeader: 'Set-Cookie: mockSession',
      })
    })
  })

  describe('callback', () => {
    it('should authenticate using GoogleStrategy', async () => {
      const authenticateMock = jest.fn()
      Auth.authenticator.authenticate = authenticateMock

      await new Auth().callback(mockRequest)

      expect(authenticateMock).toHaveBeenCalledWith('google', mockRequest, {
        failureRedirect: AuthenticatorRoutes.LOGIN,
        successRedirect: '/',
      })
    })
  })

  describe('authenticate', () => {
    it('should authenticate the user', async () => {
      const authenticateMock = jest.fn()
      Auth.authenticator.authenticate = authenticateMock

      await new Auth().authenticate(mockRequest)

      expect(authenticateMock).toHaveBeenCalledWith('google', mockRequest)
    })
  })

  describe('isAuthenticated', () => {
    it('should verify if the user is authenticated', async () => {
      const isAuthenticatedMock = jest.fn().mockResolvedValue(true)
      Auth.authenticator.isAuthenticated = isAuthenticatedMock

      const result = await new Auth().isAuthenticated(mockRequest)

      expect(isAuthenticatedMock).toHaveBeenCalledWith(mockRequest, {
        failureRedirect: AuthenticatorRoutes.LOGIN,
      })
      expect(result).toBe(true)
    })
  })

  describe('logout', () => {
    it('should log out the user and redirect to login', async () => {
      const logoutMock = jest.fn()
      Auth.authenticator.logout = logoutMock

      await new Auth().logout(mockRequest)

      expect(logoutMock).toHaveBeenCalledWith(mockRequest, {
        redirectTo: AuthenticatorRoutes.LOGIN,
        headers: {
          'Clear-Site-Data': 'cookies',
        },
      })
    })
  })

  describe('authenticateToken', () => {
    it('should authenticate the token using UsersController', async () => {
      const result = await new Auth().authenticateToken('mockToken')

      expect(UsersController.authenticateToken).toHaveBeenCalledWith({
        token: 'mockToken',
      })
      expect(result).toEqual({
        id: 1,
        name: 'Authenticated User',
      })
    })
  })
})
