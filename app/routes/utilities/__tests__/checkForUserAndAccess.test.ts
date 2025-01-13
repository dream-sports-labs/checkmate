import {getUser} from '../authenticate'
import {isUserAllowedToAccess} from '../isAllowedToAccess'
import {ACCESS_ERROR_MESSAGE} from '../constants'
import {API, ApiToTypeMap} from '../api'
import {getUserAndCheckAccess} from '../checkForUserAndAccess'

jest.mock('../authenticate')
jest.mock('../isAllowedToAccess')
jest.mock('../constants', () => ({
  ACCESS_ERROR_MESSAGE: 'Access Denied',
}))
jest.mock('../api', () => ({
  API: {},
  ApiToTypeMap: {
    'api/v1/resource': 'RESOURCE_ACTION',
  },
}))

describe('getUserAndCheckAccess', () => {
  const mockRequest = {headers: {authorization: 'Bearer token'}}
  const mockUser = {userId: 1}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the user when access is allowed', async () => {
    ;(getUser as jest.Mock).mockResolvedValue(mockUser)
    ;(isUserAllowedToAccess as jest.Mock).mockResolvedValue(true)

    const result = await getUserAndCheckAccess({
      request: mockRequest as unknown as Request,
      resource: 'api/v1/resource' as API,
    })

    expect(getUser).toHaveBeenCalledWith(mockRequest)
    expect(isUserAllowedToAccess).toHaveBeenCalledWith({
      resource: 'resource',
      action: 'RESOURCE_ACTION',
      userId: mockUser.userId,
    })
    expect(result).toBe(mockUser)
  })

  it('should throw an error when access is denied', async () => {
    ;(getUser as jest.Mock).mockResolvedValue(mockUser)
    ;(isUserAllowedToAccess as jest.Mock).mockResolvedValue(false)

    await expect(
      getUserAndCheckAccess({
        request: mockRequest as unknown as Request,
        resource: 'api/v1/resource' as API,
      }),
    ).rejects.toThrow(ACCESS_ERROR_MESSAGE)

    expect(getUser).toHaveBeenCalledWith(mockRequest)
    expect(isUserAllowedToAccess).toHaveBeenCalledWith({
      resource: 'resource',
      action: 'RESOURCE_ACTION',
      userId: mockUser.userId,
    })
  })

  it('should handle a missing user gracefully', async () => {
    ;(getUser as jest.Mock).mockResolvedValue(null)
    ;(isUserAllowedToAccess as jest.Mock).mockResolvedValue(false)

    await expect(
      getUserAndCheckAccess({
        request: mockRequest as unknown as Request,
        resource: 'api/v1/resource' as API,
      }),
    ).rejects.toThrow(ACCESS_ERROR_MESSAGE)

    expect(getUser).toHaveBeenCalledWith(mockRequest)
    expect(isUserAllowedToAccess).toHaveBeenCalledWith({
      resource: 'resource',
      action: 'RESOURCE_ACTION',
      userId: 0,
    })
  })
})
