import {loader} from '~/routes/api/v1/userDetails'
import UsersController from '@controllers/users.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {API} from '~/routes/utilities/api'

jest.mock('@controllers/users.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')

describe('Get User Details - Loader Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully fetch user details for a valid user', async () => {
    const request = new Request('http://localhost', {method: 'GET'})
    const mockUser = {userId: 123}
    const mockUserData = {
      userId: 123,
      userName: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
    }

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(UsersController.getUser as jest.Mock).mockResolvedValue(mockUserData)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await loader({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetUserDetails,
    })
    expect(UsersController.getUser).toHaveBeenCalledWith({
      userId: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockUserData,
      status: 200,
    })
  })

  it('should return an error if the user is not found', async () => {
    const request = new Request('http://localhost', {method: 'GET'})
    const mockUser = {userId: 123}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(UsersController.getUser as jest.Mock).mockResolvedValue(null)
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: data.status}),
    )

    const response = await loader({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetUserDetails,
    })
    expect(UsersController.getUser).toHaveBeenCalledWith({
      userId: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: null,
      status: 200,
    })
    expect(response.status).toBe(200)

    const responseData = await response.json()
    expect(responseData).toEqual({
      data: null,
      status: 200,
    })
  })

  it('should handle unexpected errors', async () => {
    const request = new Request('http://localhost', {method: 'GET'})
    const mockError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 500}),
    )

    const response = await loader({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetUserDetails,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)

    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Unexpected error',
    })
  })
})
