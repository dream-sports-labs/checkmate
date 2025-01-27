import {action} from '~/routes/api/v1/editRun'
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

describe('Edit Run - Action Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully update a run when request is valid', async () => {
    const requestData = {
      projectId: 1,
      runId: 123,
      runName: 'Updated Run Name',
      runDescription: 'This is a description',
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 456}
    const mockRunInfo = [{status: 'Active'}]
    const mockUpdateResponse = [{affectedRows: 1}]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(RunsController.getRunInfo as jest.Mock).mockResolvedValue(mockRunInfo)
    ;(RunsController.updateRun as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.EditRun,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(RunsController.getRunInfo).toHaveBeenCalledWith({
      runId: requestData.runId,
    })
    expect(RunsController.updateRun).toHaveBeenCalledWith({
      runId: requestData.runId,
      runName: requestData.runName,
      runDescription: requestData.runDescription,
      projectId: requestData.projectId,
      userId: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {success: true, message: 'Run Updated Successfully'},
      status: 201,
    })
  })

  it('should return 400 if the run is not found', async () => {
    const requestData = {
      projectId: 1,
      runId: 123,
      runName: 'Updated Run Name',
      runDescription: 'This is a description',
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 456}

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
      status: 400,
    })
  })

  it('should return 423 if the run is locked', async () => {
    const requestData = {
      projectId: 1,
      runId: 123,
      runName: 'Updated Run Name',
      runDescription: 'This is a description',
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 456}
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
      error: 'Run is locked',
      status: 423,
    })
  })

  it('should return 400 if the run update fails', async () => {
    const requestData = {
      projectId: 1,
      runId: 123,
      runName: 'Updated Run Name',
      runDescription: 'This is a description',
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 456}
    const mockRunInfo = [{status: 'Active'}]
    const mockUpdateResponse = [{affectedRows: 0}] // No rows affected

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(RunsController.getRunInfo as jest.Mock).mockResolvedValue(mockRunInfo)
    ;(RunsController.updateRun as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(RunsController.updateRun).toHaveBeenCalledWith({
      runId: requestData.runId,
      runName: requestData.runName,
      runDescription: requestData.runDescription,
      projectId: requestData.projectId,
      userId: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Run not updated',
      status: 400,
    })
  })

  it('should handle unexpected errors', async () => {
    const requestData = {
      projectId: 1,
      runId: 123,
      runName: 'Updated Run Name',
      runDescription: 'This is a description',
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
      resource: API.EditRun,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })
})
