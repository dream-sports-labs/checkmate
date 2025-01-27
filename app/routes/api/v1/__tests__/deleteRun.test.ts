import {action} from '~/routes/api/v1/deleteRun'
import RunsController from '@controllers/runs.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'

jest.mock('@controllers/runs.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Delete Run - Action Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully delete a run when request is valid', async () => {
    const requestData = {
      runId: 1,
      projectId: 101,
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
    ;(RunsController.deleteRun as jest.Mock).mockResolvedValue(mockResponse)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.DeleteRun,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(RunsController.deleteRun).toHaveBeenCalledWith({
      ...requestData,
      userId: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {message: 'Run deleted successfully'},
      status: 200,
    })
  })

  it('should return 400 if content-type is not application/json', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'text/plain'},
    })

    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Invalid content type',
      status: 400,
    })
  })

  it('should return validation error if schema validation fails', async () => {
    const invalidRequestData = {
      runId: -1, // Invalid runId
      projectId: 0, // Invalid projectId
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

  it('should return 400 if deleteRun does not affect any rows', async () => {
    const requestData = {
      runId: 999,
      projectId: 101,
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
    ;(RunsController.deleteRun as jest.Mock).mockResolvedValue(mockResponse)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(RunsController.deleteRun).toHaveBeenCalledWith({
      ...requestData,
      userId: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Provide valid runId and projectId',
      status: 400,
    })
  })

  it('should handle unexpected errors', async () => {
    const requestData = {
      runId: 1,
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
      resource: API.DeleteRun,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })
})
