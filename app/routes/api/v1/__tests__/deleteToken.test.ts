import {action} from '~/routes/api/v1/deleteToken'
import UsersController from '@controllers/users.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  TOKEN_DELETED_SUCCESSFULLY,
  TOKEN_DELETION_UNSUCCESSFUL,
} from '~/routes/utilities/constants'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'

jest.mock('@controllers/users.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Delete Token - Action Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully delete a token when request is valid', async () => {
    const requestData = {
      userId: 123,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockResponse = [{affectedRows: 1}]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(UsersController.deleteToken as jest.Mock).mockResolvedValue(mockResponse)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.DeleteToken,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(UsersController.deleteToken).toHaveBeenCalledWith({
      userId: 123,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        message: TOKEN_DELETED_SUCCESSFULLY,
      },
      status: 200,
    })
  })

  it('should return 401 if userId does not match the authenticated user', async () => {
    const requestData = {
      userId: 123,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 456}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.DeleteToken,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'userId and token provided not of same user',
      status: 401,
    })
  })

  it('should return unsuccessful message if token deletion fails', async () => {
    const requestData = {
      userId: 123,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockResponse = [{affectedRows: 0}] // No rows affected

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(UsersController.deleteToken as jest.Mock).mockResolvedValue(mockResponse)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(UsersController.deleteToken).toHaveBeenCalledWith({
      userId: 123,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        message: TOKEN_DELETION_UNSUCCESSFUL,
      },
      status: 200,
    })
  })

  it('should handle unexpected errors', async () => {
    const requestData = {
      userId: 123,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.DeleteToken,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })
})
