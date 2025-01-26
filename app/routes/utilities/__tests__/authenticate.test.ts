import {AuthenticatorService} from '@services/auth/Auth.server'
import {User} from '@dao/users.dao'
import {LOGOUT_ERROR_MESSAGE} from '../constants'
import {getUser} from '../authenticate'

jest.mock('@services/auth/Auth.server')

describe('getUser and checkForAuthToken', () => {
  const mockRequest = (authHeader?: string): Request =>
    new Request('http://localhost', {
      headers: authHeader ? {Authorization: authHeader} : {},
    })

  const mockUser: User = {
    userId: 1,
    userName: 'John Doe',
    email: 'johndoe@example.com',
    role: 'admin',
    profileUrl: null,
    ssoId: 'mockSsoId',
    token: 'mockToken',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('checkForAuthToken (via getUser)', () => {
    it('should return null if Authorization header is missing', async () => {
      const request = mockRequest()
      ;(AuthenticatorService.getUser as jest.Mock).mockResolvedValue({})
      ;(AuthenticatorService.authenticateToken as jest.Mock).mockResolvedValue(
        null,
      )

      await expect(getUser(request)).rejects.toThrow(LOGOUT_ERROR_MESSAGE)

      expect(AuthenticatorService.authenticateToken).not.toHaveBeenCalled()
    })

    it('should return null if Authorization header does not start with "Bearer "', async () => {
      const request = mockRequest('InvalidToken')
      ;(AuthenticatorService.getUser as jest.Mock).mockResolvedValue({})
      ;(AuthenticatorService.authenticateToken as jest.Mock).mockResolvedValue(
        null,
      )

      await expect(getUser(request)).rejects.toThrow(LOGOUT_ERROR_MESSAGE)

      expect(AuthenticatorService.authenticateToken).not.toHaveBeenCalled()
    })

    it('should return the user if the token is valid', async () => {
      const request = mockRequest('Bearer validToken')
      ;(AuthenticatorService.getUser as jest.Mock).mockResolvedValue({})
      ;(AuthenticatorService.authenticateToken as jest.Mock).mockResolvedValue(
        mockUser,
      )

      const result = await getUser(request)

      expect(AuthenticatorService.authenticateToken).toHaveBeenCalledWith(
        'validToken',
      )
      expect(result).toEqual(mockUser)
    })

    it('should return null if the token is invalid', async () => {
      const request = mockRequest('Bearer invalidToken')
      ;(AuthenticatorService.getUser as jest.Mock).mockResolvedValue({})
      ;(AuthenticatorService.authenticateToken as jest.Mock).mockResolvedValue(
        null,
      )

      await expect(getUser(request)).rejects.toThrow(LOGOUT_ERROR_MESSAGE)

      expect(AuthenticatorService.authenticateToken).toHaveBeenCalledWith(
        'invalidToken',
      )
    })
  })

  describe('getUser', () => {
    it('should return the user from AuthenticatorService.getUser if available', async () => {
      const request = mockRequest()
      ;(AuthenticatorService.getUser as jest.Mock).mockResolvedValue({})
      ;(AuthenticatorService.getUser as jest.Mock).mockResolvedValue({
        user: mockUser,
      })

      const result = await getUser(request)

      expect(AuthenticatorService.getUser).toHaveBeenCalledWith(request)
      expect(result).toEqual(mockUser)
    })

    it('should check for a token if AuthenticatorService.getUser returns undefined', async () => {
      const request = mockRequest('Bearer validToken')
      ;(AuthenticatorService.getUser as jest.Mock).mockResolvedValue({})
      ;(AuthenticatorService.authenticateToken as jest.Mock).mockResolvedValue(
        mockUser,
      )

      const result = await getUser(request)

      expect(AuthenticatorService.getUser).toHaveBeenCalledWith(request)
      expect(AuthenticatorService.authenticateToken).toHaveBeenCalledWith(
        'validToken',
      )
      expect(result).toEqual(mockUser)
    })

    it('should throw an error if no user is found and no valid token is provided', async () => {
      const request = mockRequest()
      ;(AuthenticatorService.getUser as jest.Mock).mockResolvedValue({})
      ;(AuthenticatorService.authenticateToken as jest.Mock).mockResolvedValue(
        null,
      )

      await expect(getUser(request)).rejects.toThrow(LOGOUT_ERROR_MESSAGE)

      expect(AuthenticatorService.getUser).toHaveBeenCalledWith(request)
      expect(AuthenticatorService.authenticateToken).not.toHaveBeenCalled()
    })
  })
})
