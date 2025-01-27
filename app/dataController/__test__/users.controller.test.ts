import UsersController, {IUpdateUserRole} from '@controllers/users.controller'
import {GoogleProfile} from 'remix-auth-google'
import UsersDao from '~/db/dao/users.dao'

jest.mock('~/db/dao/users.dao')

describe('UsersController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllUsers', () => {
    it('should call UsersDao.getAll with the correct parameters', async () => {
      const mockParams = {page: 1, pageSize: 10}
      const mockResponse = [{userId: 1, userName: 'John Doe'}]

      ;(UsersDao.getAll as jest.Mock).mockResolvedValue(mockResponse)

      const result = await UsersController.getAllUsers(mockParams)

      expect(UsersDao.getAll).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getUser', () => {
    it('should call UsersDao.getUser and return the first user', async () => {
      const mockParams = {userId: 1}
      const mockResponse = [{userId: 1, userName: 'John Doe'}]

      ;(UsersDao.getUser as jest.Mock).mockResolvedValue(mockResponse)

      const result = await UsersController.getUser(mockParams)

      expect(UsersDao.getUser).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse[0])
    })
  })

  describe('findOrCreateUser', () => {
    it('should call UsersDao.findOrCreateUser and return the first user', async () => {
      const mockParams: GoogleProfile = {
        provider: 'google',
        id: '12345',
        displayName: 'John Doe',
        name: {givenName: 'John', familyName: 'Doe'},
        emails: [{value: 'john.doe@example.com'}],
        photos: [{value: 'http://example.com/photo.jpg'}],
        _json: {
          sub: '12345',
          name: 'John Doe',
          given_name: 'John',
          family_name: 'Doe',
          picture: 'http://example.com/photo.jpg',
          email: 'john.doe@example.com',
          email_verified: true,
          locale: 'en',
          hd: 'example.com',
        },
      }
      const mockResponse = [{userId: 1, userName: 'John Doe'}]

      ;(UsersDao.findOrCreateUser as jest.Mock).mockResolvedValue(mockResponse)

      const result = await UsersController.findOrCreateUser(mockParams)

      expect(UsersDao.findOrCreateUser).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse[0])
    })
  })

  describe('generateToken', () => {
    it('should call UsersDao.generateToken with the correct parameters', async () => {
      const mockParams = {userId: 1}
      const mockResponse = {token: 'mocked-token'}

      ;(UsersDao.generateToken as jest.Mock).mockResolvedValue(mockResponse)

      const result = await UsersController.generateToken(mockParams)

      expect(UsersDao.generateToken).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deleteToken', () => {
    it('should call UsersDao.deleteToken with the correct parameters', async () => {
      const mockParams = {userId: 1}
      const mockResponse = {success: true}

      ;(UsersDao.deleteToken as jest.Mock).mockResolvedValue(mockResponse)

      const result = await UsersController.deleteToken(mockParams)

      expect(UsersDao.deleteToken).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('authenticateToken', () => {
    it('should call UsersDao.authenticateToken with the correct parameters', async () => {
      const mockParams = {token: 'mocked-token'}
      const mockResponse = {userId: 1}

      ;(UsersDao.authenticateToken as jest.Mock).mockResolvedValue(mockResponse)

      const result = await UsersController.authenticateToken(mockParams)

      expect(UsersDao.authenticateToken).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getUsersRoles', () => {
    it('should call UsersDao.getUsersRoles and return roles', async () => {
      const mockResponse = [{roleId: 1, roleName: 'admin'}]

      ;(UsersDao.getUsersRoles as jest.Mock).mockResolvedValue(mockResponse)

      const result = await UsersController.getUsersRoles()

      expect(UsersDao.getUsersRoles).toHaveBeenCalled()
      expect(result).toEqual(mockResponse)
    })
  })

  describe('updateUserRole', () => {
    it('should call UsersDao.updateUserRole with the correct parameters', async () => {
      const mockParams: IUpdateUserRole = {
        userId: 1,
        newRole: 'admin',
        updatedBy: 2,
      }
      const mockResponse = {success: true}

      ;(UsersDao.updateUserRole as jest.Mock).mockResolvedValue(mockResponse)

      const result = await UsersController.updateUserRole(mockParams)

      expect(UsersDao.updateUserRole).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getUsersCount', () => {
    it('should call UsersDao.getUsersCount and return the count', async () => {
      const mockResponse = 10

      ;(UsersDao.getUsersCount as jest.Mock).mockResolvedValue(mockResponse)

      const result = await UsersController.getUsersCount()

      expect(UsersDao.getUsersCount).toHaveBeenCalled()
      expect(result).toEqual(mockResponse)
    })
  })
})
