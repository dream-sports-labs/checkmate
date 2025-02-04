import {action} from '~/routes/api/v1/markPassedAsRetest'
import RunsController from '@controllers/runs.controller'
import TestRunsController from '@controllers/testRuns.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'
import {RUN_IS_LOCKED} from '~/constants'

jest.mock('@controllers/runs.controller')
jest.mock('@controllers/testRuns.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Mark Passed as Retest - Action Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully mark passed tests as retest', async () => {
    const requestData = {runId: 123}
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 456}
    const mockRunInfo = [{status: 'Active'}]
    const mockResponseData = {
      testIds: [1, 2, 3],
      data: [{affectedRows: 3}],
    }

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(RunsController.getRunInfo as jest.Mock).mockResolvedValue(mockRunInfo)
    ;(TestRunsController.markPassedAsRetest as jest.Mock).mockResolvedValue(
      mockResponseData,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.RunReset,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(RunsController.getRunInfo).toHaveBeenCalledWith({
      runId: requestData.runId,
    })
    expect(TestRunsController.markPassedAsRetest).toHaveBeenCalledWith({
      runId: requestData.runId,
      userId: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        count: 3,
        message: 'Successfully updated 3 tests',
        testIds: [1, 2, 3],
      },
      status: 200,
    })
  })

  it('should return an error if the run is not found', async () => {
    const requestData = {runId: 123}
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

  it('should return an error if the run is locked', async () => {
    const requestData = {runId: 123}
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
      error: RUN_IS_LOCKED,
      status: 423,
    })
  })

  it('should handle unexpected errors', async () => {
    const requestData = {runId: 123}
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
      resource: API.RunReset,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })
})
