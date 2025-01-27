import {action} from '~/routes/api/v1/updateUserType'
import UsersController from '@controllers/users.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'
import {z} from 'zod'

jest.mock('@controllers/users.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Update User Role - Action Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should successfully update a user's role for valid input", async () => {
    const requestData = {
      userId: 123,
      newRole: 'admin',
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 789}
    const mockResponse = [{affectedRows: 1}]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(UsersController.updateUserRole as jest.Mock).mockResolvedValue(
      mockResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.UpdateUserRole,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(UsersController.updateUserRole).toHaveBeenCalledWith({
      ...requestData,
      updatedBy: mockUser.userId,
      userId: requestData.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        message: 'User Updated Successfully',
      },
      status: 200,
    })
  })

  it('should handle validation errors', async () => {
    const invalidRequestData = {
      userId: -1, // Invalid userId
      newRole: 'invalidRole', // Invalid role
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(invalidRequestData),
    })
    const mockZodError = new z.ZodError([
      {path: ['userId'], message: 'Invalid userId', code: 'custom'},
      {path: ['newRole'], message: 'Invalid role', code: 'custom'},
    ])

    ;(getRequestParams as jest.Mock).mockRejectedValue(mockZodError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 400}),
    )

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(mockZodError)
    expect(response.status).toBe(400)

    const responseData = await response.json()
    expect(responseData).toEqual({
      error: mockZodError.message,
    })
  })

  it('should handle failed user updates', async () => {
    const requestData = {
      userId: 123,
      newRole: 'user',
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 789}
    const mockResponse = [{affectedRows: 0}]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(UsersController.updateUserRole as jest.Mock).mockResolvedValue(
      mockResponse,
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 400}),
    )

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.UpdateUserRole,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(UsersController.updateUserRole).toHaveBeenCalledWith({
      ...requestData,
      updatedBy: mockUser.userId,
      userId: requestData.userId,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(
      expect.objectContaining({message: 'User not Updated'}),
    )
    expect(response.status).toBe(400)

    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'User not Updated',
    })
  })

  it('should handle unexpected errors', async () => {
    const requestData = {
      userId: 123,
      newRole: 'admin',
    }
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
      resource: API.UpdateUserRole,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)

    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Unexpected error',
    })
  })
})
