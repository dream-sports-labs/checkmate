import {loader} from '~/routes/api/v1/tests'
import SearchParams from '@route/utils/getSearchParams'
import TestsController from '~/dataController/tests.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {API} from '~/routes/utilities/api'

jest.mock('@route/utils/getSearchParams')
jest.mock('~/dataController/tests.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')

describe('Get Tests - Loader Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully fetch tests data for valid search parameters', async () => {
    const request = new Request(
      'http://localhost?runId=123&page=1&pageSize=10',
      {
        method: 'GET',
      },
    )
    const mockSearchParams = {runId: 123, page: 1, pageSize: 10}
    const mockTestsData = [
      {testId: 1, status: 'Passed', runId: 123},
      {testId: 2, status: 'Failed', runId: 123},
    ]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(SearchParams.getTests as jest.Mock).mockReturnValue(mockSearchParams)
    ;(TestsController.getTests as jest.Mock).mockResolvedValue(mockTestsData)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await loader({params: {}, request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetTests,
    })
    expect(SearchParams.getTests).toHaveBeenCalledWith({params: {}, request})
    expect(TestsController.getTests).toHaveBeenCalledWith(mockSearchParams)
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockTestsData,
      status: 200,
    })
  })

  it('should return an error for invalid search parameters', async () => {
    const request = new Request('http://localhost?runId=invalid&page=1', {
      method: 'GET',
    })

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(SearchParams.getTests as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid search parameters')
    })
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 400}),
    )

    const response = await loader({params: {}, request} as any)

    expect(SearchParams.getTests).toHaveBeenCalledWith({params: {}, request})
    expect(errorResponseHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid search parameters',
      }),
    )
    expect(response.status).toBe(400)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Invalid search parameters',
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
      resource: API.GetTests,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Unexpected error',
    })
  })
})
