import {action} from '~/routes/api/v1/generateToken'
import UsersController from '@controllers/users.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
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

describe('Generate Token - Action Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully generate a token when request is valid', async () => {
    const requestData = {userId: 123}
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockToken = {token: 'mocked-token'}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(UsersController.generateToken as jest.Mock).mockResolvedValue(mockToken)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.AddToken,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(UsersController.generateToken).toHaveBeenCalledWith({
      userId: 123,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockToken,
      status: 201,
    })
  })

  it('should return an error if userId in the token does not match the authenticated user', async () => {
    const requestData = {userId: 456}
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.AddToken,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'userId and token provided are not of same user',
      status: 400,
    })
  })

  it('should handle validation errors', async () => {
    const invalidRequestData = {userId: -1}
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(invalidRequestData),
    })

    ;(getRequestParams as jest.Mock).mockRejectedValue(
      new Error('Validation Error: Invalid userId'),
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('Validation Error: Invalid userId'),
    )
  })

  it('should handle unexpected errors', async () => {
    const requestData = {userId: 123}
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 500}),
    )

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.AddToken,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })
})
