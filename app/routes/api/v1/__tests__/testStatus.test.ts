import {loader} from '~/routes/api/v1/testStatus'
import TestsController from '@controllers/tests.controller'
import SearchParams from '@route/utils/getSearchParams'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {API} from '~/routes/utilities/api'

jest.mock('@controllers/tests.controller')
jest.mock('@route/utils/getSearchParams')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')

describe('Get Test Status - Loader Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully fetch test status for valid query parameters', async () => {
    const request = new Request(
      'http://localhost?projectId=123&testId=456&runId=789',
      {method: 'GET'},
    )
    const mockQueryParams = {projectId: 123, testId: 456, runId: 789}
    const mockTestStatusData = [
      {
        status: 'Passed',
        runStatus: 'Active',
      },
    ]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(SearchParams.getTestStatus as jest.Mock).mockReturnValue(mockQueryParams)
    ;(TestsController.getTestStatus as jest.Mock).mockResolvedValue(
      mockTestStatusData,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await loader({params: {}, request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetRunTestStatus,
    })
    expect(SearchParams.getTestStatus).toHaveBeenCalledWith({
      params: {},
      request,
    })
    expect(TestsController.getTestStatus).toHaveBeenCalledWith(mockQueryParams)
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockTestStatusData,
      status: 200,
    })
  })

  it('should return an error for invalid query parameters', async () => {
    const request = new Request(
      'http://localhost?projectId=invalid&testId=456',
      {
        method: 'GET',
      },
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(SearchParams.getTestStatus as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid query parameters')
    })
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 400}),
    )

    const response = await loader({params: {}, request} as any)

    expect(SearchParams.getTestStatus).toHaveBeenCalledWith({
      params: {},
      request,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid query parameters',
      }),
    )
    expect(response.status).toBe(400)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Invalid query parameters',
    })
  })

  it('should handle unexpected errors', async () => {
    const request = new Request('http://localhost?projectId=123&testId=456', {
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
      resource: API.GetRunTestStatus,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Unexpected error',
    })
  })
})
