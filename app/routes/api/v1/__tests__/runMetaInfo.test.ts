import {loader} from '~/routes/api/v1/runMetaInfo'
import TestRunsController from '~/dataController/testRuns.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForRunId} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'

jest.mock('~/dataController/testRuns.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Get Run State Detail - Loader Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully fetch test run state details for a valid runId and groupBy', async () => {
    const request = new Request(
      'http://localhost?runId=123&projectId=456&groupBy=squads',
      {
        method: 'GET',
      },
    )
    const mockTestRunMetaData = {
      total: 100,
      passed: 80,
      failed: 10,
      untested: 5,
      blocked: 5,
    }

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForRunId as jest.Mock).mockReturnValue(true)
    ;(TestRunsController.runsMetaInfo as jest.Mock).mockResolvedValue(
      mockTestRunMetaData,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await loader({params: {}, request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetRunStateDetail,
    })
    expect(checkForRunId).toHaveBeenCalledWith(123)
    expect(TestRunsController.runsMetaInfo).toHaveBeenCalledWith({
      runId: 123,
      projectId: 456,
      groupBy: 'squads',
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockTestRunMetaData,
      status: 200,
    })
  })

  it('should return an error if groupBy is invalid', async () => {
    const request = new Request(
      'http://localhost?runId=123&projectId=456&groupBy=invalid',
      {
        method: 'GET',
      },
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 400}),
    )

    const response = await loader({params: {}, request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid groupBy value, provide one of squads',
      }),
    )
    expect(response.status).toBe(400)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Invalid groupBy value, provide one of squads',
    })
  })

  it('should return an error if runId is invalid', async () => {
    const request = new Request(
      'http://localhost?runId=invalid&projectId=456',
      {
        method: 'GET',
      },
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForRunId as jest.Mock).mockReturnValue(false)
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: 400}),
    )

    const response = (await loader({params: {}, request} as any)) as Response

    expect(checkForRunId).toHaveBeenCalledWith(NaN)
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Invalid params runId',
      status: 400,
    })
    expect(response.status).toBe(400)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Invalid params runId',
      status: 400,
    })
  })

  it('should return an error if runId is missing', async () => {
    const request = new Request('http://localhost?projectId=456', {
      method: 'GET',
    })

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: 400}),
    )

    const response = (await loader({params: {}, request} as any)) as Response

    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Params runId not provided',
      status: 400,
    })
    expect(response.status).toBe(400)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Params runId not provided',
      status: 400,
    })
  })

  it('should handle unexpected errors', async () => {
    const request = new Request('http://localhost?runId=123&projectId=456', {
      method: 'GET',
    })
    const mockError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 500}),
    )

    const response = await loader({params: {}, request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetRunStateDetail,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Unexpected error',
    })
  })
})
