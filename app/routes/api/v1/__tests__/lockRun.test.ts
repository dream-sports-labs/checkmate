import {action} from '~/routes/api/v1/lockRun'
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

describe('Lock Run - Action Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully lock a run when request is valid', async () => {
    const requestData = {
      runId: 123,
      projectId: 456,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 789}
    const mockLockResponse = {success: true}
    const mockRunInfo = [{status: 'Active'}]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(RunsController.lockRun as jest.Mock).mockResolvedValue(mockLockResponse)
    ;(RunsController.getRunInfo as jest.Mock).mockResolvedValue(mockRunInfo)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.RunLock,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(RunsController.lockRun).toHaveBeenCalledWith({
      runId: requestData.runId,
      projectId: requestData.projectId,
      userId: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        success: true,
        message: 'Run Locked Successfully',
      },
      status: 200,
    })
  })

  it('should return an error for invalid content type', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'text/plain'},
    })

    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: 400}),
    )

    const response = await action({request} as any)

    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Invalid content type',
      status: 400,
    })
  })

  it('should return an error if the run is already locked', async () => {
    const requestData = {
      runId: 123,
      projectId: 456,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 789}
    const mockRunInfo = [{status: 'Locked'}]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(RunsController.getRunInfo as jest.Mock).mockResolvedValue(mockRunInfo)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(RunsController.getRunInfo).toHaveBeenCalledWith({
      runId: requestData.runId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Run is already locked',
      status: 200,
    })
  })

  it('should return an error if the run is not found', async () => {
    const requestData = {
      runId: 123,
      projectId: 456,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 789}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(RunsController.getRunInfo as jest.Mock).mockResolvedValue([])
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(RunsController.getRunInfo).toHaveBeenCalledWith({
      runId: requestData.runId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Run not found',
      status: 200,
    })
  })

  it('should handle unexpected errors', async () => {
    const requestData = {
      runId: 123,
      projectId: 456,
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
      resource: API.RunLock,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })
})
