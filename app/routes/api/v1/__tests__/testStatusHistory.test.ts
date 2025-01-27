import {loader} from '~/routes/api/v1/testStatusHistory'
import TestRunsController from '@controllers/testRuns.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForTestId} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'

jest.mock('@controllers/testRuns.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Get Test Status History - Loader Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully fetch test status history for a valid testId', async () => {
    const request = new Request('http://localhost?testId=123', {method: 'GET'})
    const mockTestStatusData = [
      {
        status: 'Passed',
        updatedBy: 'John Doe',
        updatedOn: '2024-11-20T14:17:36.000Z',
        comment: 'All checks passed',
      },
      {
        status: 'Failed',
        updatedBy: 'Jane Doe',
        updatedOn: '2024-11-19T10:05:22.000Z',
        comment: 'Critical errors found',
      },
    ]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForTestId as jest.Mock).mockReturnValue(true)
    ;(TestRunsController.testStatusHistory as jest.Mock).mockResolvedValue(
      mockTestStatusData,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await loader({params: {}, request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetTestStatusHistory,
    })
    expect(checkForTestId).toHaveBeenCalledWith(123)
    expect(TestRunsController.testStatusHistory).toHaveBeenCalledWith({
      testId: 123,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockTestStatusData,
      status: 200,
    })
  })

  it('should return an error for an invalid testId', async () => {
    const request = new Request('http://localhost?testId=invalid', {
      method: 'GET',
    })

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForTestId as jest.Mock).mockReturnValue(false)
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: 400}),
    )

    const response = (await loader({params: {}, request} as any)) as Response

    expect(checkForTestId).toHaveBeenCalledWith(NaN)
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Invalid param testId',
      status: 400,
    })
    expect(response.status).toBe(400)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Invalid param testId',
      status: 400,
    })
  })

  it('should return an error if testId is missing', async () => {
    const request = new Request('http://localhost', {method: 'GET'})

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForTestId as jest.Mock).mockReturnValue(false)
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: 400}),
    )

    const response = (await loader({params: {}, request} as any)) as Response

    expect(checkForTestId).toHaveBeenCalledWith(NaN)
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Invalid param testId',
      status: 400,
    })
    expect(response.status).toBe(400)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Invalid param testId',
      status: 400,
    })
  })

  it('should handle unexpected errors', async () => {
    const request = new Request('http://localhost?testId=123', {method: 'GET'})
    const mockError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 500}),
    )

    const response = await loader({params: {}, request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetTestStatusHistory,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Unexpected error',
    })
  })
})
