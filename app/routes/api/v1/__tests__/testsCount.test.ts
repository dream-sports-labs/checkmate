import {loader} from '~/routes/api/v1/testsCount'
import TestsController from '~/dataController/tests.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {logger, LogType} from '~/utils/logger'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {API} from '~/routes/utilities/api'
import SearchParams from '@route/utils/getSearchParams'
import {ErrorCause} from '~/constants'

jest.mock('~/dataController/tests.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/utils/logger')
jest.mock('@route/utils/getSearchParams')

describe('Get Tests Count - Loader Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully fetch test count for valid search parameters', async () => {
    const request = new Request(
      'http://localhost?runId=123&page=1&pageSize=10',
      {
        method: 'GET',
      },
    )
    const mockSearchParams = {runId: 123, page: 1, pageSize: 10}
    const mockTestsCount = {total: 100, passed: 80, failed: 10}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(SearchParams.getTestCount as jest.Mock).mockReturnValue(mockSearchParams)
    ;(TestsController.getTestsCount as jest.Mock).mockResolvedValue(
      mockTestsCount,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await loader({params: {}, request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetTestsCount,
    })
    expect(SearchParams.getTestCount).toHaveBeenCalledWith({
      params: {},
      request,
    })
    expect(TestsController.getTestsCount).toHaveBeenCalledWith(mockSearchParams)
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockTestsCount,
      status: 200,
    })
  })

  it('should log and return an error for invalid parameters', async () => {
    const request = new Request('http://localhost?runId=invalid&page=1', {
      method: 'GET',
    })

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(SearchParams.getTestCount as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid search parameters', {
        cause: ErrorCause.INVALID_PARAMS,
      })
    })
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: 400}),
    )
    ;(logger as jest.Mock).mockImplementation(() => {})

    const response = await loader({params: {}, request} as any)

    expect(SearchParams.getTestCount).toHaveBeenCalledWith({
      params: {},
      request,
    })
    expect(logger).toHaveBeenCalledWith({
      type: LogType.ERROR,
      message: 'Invalid search parameters',
      tag: API.GetTestsCount,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Invalid search parameters',
      status: 400,
    })
    expect(response.status).toBe(400)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Invalid search parameters',
      status: 400,
    })
  })

  it('should handle unexpected errors', async () => {
    const request = new Request('http://localhost?runId=123', {method: 'GET'})
    const mockError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 500}),
    )

    const response = await loader({params: {}, request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetTestsCount,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Unexpected error',
    })
  })
})
