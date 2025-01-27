import {loader} from '~/routes/api/v1/getAllUser'
import UsersController from '@controllers/users.controller'
import SearchParams from '@route/utils/getSearchParams'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {API} from '~/routes/utilities/api'

jest.mock('@controllers/users.controller')
jest.mock('@route/utils/getSearchParams')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')

describe('Get All Users - Loader Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all users and their count when request is valid', async () => {
    const request = new Request('http://localhost?role=admin', {method: 'GET'})
    const mockQuery = {role: 'admin'}
    const mockUserData = [
      {
        userId: 1,
        userName: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
      },
      {
        userId: 2,
        userName: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Admin',
      },
    ]
    const mockUsersCount = [{count: 2}]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(SearchParams.getAllUsers as jest.Mock).mockReturnValue(mockQuery)
    ;(UsersController.getAllUsers as jest.Mock).mockResolvedValue(mockUserData)
    ;(UsersController.getUsersCount as jest.Mock).mockResolvedValue(
      mockUsersCount,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await loader({request, params: {}} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetAllUser,
    })
    expect(SearchParams.getAllUsers).toHaveBeenCalledWith({params: {}, request})
    expect(UsersController.getAllUsers).toHaveBeenCalledWith(mockQuery)
    expect(UsersController.getUsersCount).toHaveBeenCalled()
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        userData: mockUserData,
        usersCount: 2,
      },
      status: 200,
    })
  })

  it('should handle unexpected errors', async () => {
    const request = new Request('http://localhost?role=admin', {method: 'GET'})
    const mockError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 500}),
    )

    const response = (await loader({request, params: {}} as any)) as Response

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetAllUser,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Unexpected error',
    })
  })
})
