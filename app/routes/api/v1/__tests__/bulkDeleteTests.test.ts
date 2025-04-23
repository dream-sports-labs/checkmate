import {action} from '~/routes/api/v1/bulkDeleteTests'
import TestsController from '@controllers/tests.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'

jest.mock('@controllers/tests.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Bulk Delete Tests - Action Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully delete tests when request is valid', async () => {
    const requestData = {
      testIds: [1, 2, 3],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockResponse = {affectedRows: 3}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.bulkDeleteTests as jest.Mock).mockResolvedValue(
      mockResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.DeleteBulkTests,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(TestsController.bulkDeleteTests).toHaveBeenCalledWith({
      testIds: [1, 2, 3],
      projectId: 101,
      userId: 123,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {message: '3 test(s) deleted successfully'},
      status: 200,
    })
  })

  it('should return validation error if request data is invalid', async () => {
    const invalidRequestData = {
      testIds: [], // Empty testIds, which is invalid
      projectId: -1, // Invalid projectId
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(invalidRequestData),
    })

    ;(getRequestParams as jest.Mock).mockRejectedValue(
      new Error('Validation Error: Invalid data'),
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('Validation Error: Invalid data'),
    )
  })

  it('should handle unexpected errors', async () => {
    const requestData = {
      testIds: [1, 2, 3],
      projectId: 101,
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
      resource: API.DeleteBulkTests,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })

  it('should handle error in bulkDeleteTests', async () => {
    const requestData = {
      testIds: [1, 2, 3],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockError = new Error('Failed to delete tests')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.bulkDeleteTests as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })

  it('should handle error in responseHandler', async () => {
    const requestData = {
      testIds: [1, 2, 3],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockResponse = {affectedRows: 3}
    const mockError = new Error('Failed to handle response')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.bulkDeleteTests as jest.Mock).mockResolvedValue(mockResponse)
    ;(responseHandler as jest.Mock).mockImplementation(() => {
      throw mockError
    })
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })

  it('should handle undefined user with fallback to 0', async () => {
    const requestData = {
      testIds: [1, 2, 3],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockResponse = {affectedRows: 3}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(undefined)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.bulkDeleteTests as jest.Mock).mockResolvedValue(mockResponse)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(TestsController.bulkDeleteTests).toHaveBeenCalledWith({
      testIds: [1, 2, 3],
      projectId: 101,
      userId: 0,
    })
  })

  it('should handle zero affected rows', async () => {
    const requestData = {
      testIds: [1, 2, 3],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockResponse = {affectedRows: 0}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.bulkDeleteTests as jest.Mock).mockResolvedValue(mockResponse)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(responseHandler).toHaveBeenCalledWith({
      data: {message: '0 test(s) deleted successfully'},
      status: 200,
    })
  })

  it('should handle error in getUserAndCheckAccess', async () => {
    const requestData = {
      testIds: [1, 2, 3],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockError = new Error('Failed to get user access')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })

  it('should handle error in getRequestParams', async () => {
    const requestData = {
      testIds: [1, 2, 3],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockError = new Error('Failed to get request params')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })

  it('should handle empty testIds array', async () => {
    const requestData = {
      testIds: [],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })

    ;(getRequestParams as jest.Mock).mockRejectedValue(
      new Error('testIds must contain at least 1 element(s)'),
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(
      request,
      expect.objectContaining({
        _def: expect.objectContaining({
          typeName: 'ZodObject',
        }),
      }),
    )
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('testIds must contain at least 1 element(s)'),
    )
  })

  it('should handle invalid projectId', async () => {
    const requestData = {
      testIds: [1, 2, 3],
      projectId: 0,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })

    ;(getRequestParams as jest.Mock).mockRejectedValue(
      new Error('projectId must be greater than 0'),
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(
      request,
      expect.objectContaining({
        _def: expect.objectContaining({
          typeName: 'ZodObject',
        }),
      }),
    )
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('projectId must be greater than 0'),
    )
  })

  it('should handle missing projectId', async () => {
    const requestData = {
      testIds: [1, 2, 3],
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })

    ;(getRequestParams as jest.Mock).mockRejectedValue(
      new Error('projectId is required'),
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(
      request,
      expect.objectContaining({
        _def: expect.objectContaining({
          typeName: 'ZodObject',
        }),
      }),
    )
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('projectId is required'),
    )
  })

  it('should handle missing testIds', async () => {
    const requestData = {
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })

    ;(getRequestParams as jest.Mock).mockRejectedValue(
      new Error('testIds is required'),
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(
      request,
      expect.objectContaining({
        _def: expect.objectContaining({
          typeName: 'ZodObject',
        }),
      }),
    )
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('testIds is required'),
    )
  })
})
