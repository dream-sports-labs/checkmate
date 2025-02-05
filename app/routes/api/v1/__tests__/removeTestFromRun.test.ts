import {action} from '~/routes/api/v1/removeTestFromRun'
import RunsController from '@controllers/runs.controller'
import TestRunsController from '@controllers/testRuns.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForRunId, getRequestParams} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'
import {RUN_IS_LOCKED} from '~/constants'

jest.mock('@controllers/runs.controller')
jest.mock('@controllers/testRuns.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Remove Test From Run - Action Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully remove tests from a run', async () => {
    const requestData = {
      runId: 123,
      projectId: 456,
      testIds: [1, 2, 3],
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 789}
    const mockRunInfo = [{status: 'Active'}]
    const mockDeleteResponse = [{affectedRows: 3}]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(checkForRunId as jest.Mock).mockReturnValue(true)
    ;(RunsController.getRunInfo as jest.Mock).mockResolvedValue(mockRunInfo)
    ;(TestRunsController.deleteTestFromRun as jest.Mock).mockResolvedValue(
      mockDeleteResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.RunRemoveTest,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(checkForRunId).toHaveBeenCalledWith(123)
    expect(RunsController.getRunInfo).toHaveBeenCalledWith({runId: 123})
    expect(TestRunsController.deleteTestFromRun).toHaveBeenCalledWith({
      testIds: [1, 2, 3],
      runId: 123,
      projectId: 456,
      updatedBy: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {success: true, message: 'Tests removed successfully'},
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

  it('should return an error if runId is invalid', async () => {
    const requestData = {
      runId: 0,
      projectId: 456,
      testIds: [1, 2, 3],
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })

    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(checkForRunId as jest.Mock).mockReturnValue(false)
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: 400}),
    )

    const response = await action({request} as any)

    expect(checkForRunId).toHaveBeenCalledWith(0)
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Params runId not provided',
      status: 400,
    })
  })

  it('should return an error if the run is locked', async () => {
    const requestData = {
      runId: 123,
      projectId: 456,
      testIds: [1, 2, 3],
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockRunInfo = [{status: 'Locked'}]

    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(checkForRunId as jest.Mock).mockReturnValue(true)
    ;(RunsController.getRunInfo as jest.Mock).mockResolvedValue(mockRunInfo)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(RunsController.getRunInfo).toHaveBeenCalledWith({runId: 123})
    expect(responseHandler).toHaveBeenCalledWith({
      error: RUN_IS_LOCKED,
      status: 423,
    })
  })

  it('should handle unexpected errors', async () => {
    const requestData = {
      runId: 123,
      projectId: 456,
      testIds: [1, 2, 3],
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
      resource: API.RunRemoveTest,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })
})
