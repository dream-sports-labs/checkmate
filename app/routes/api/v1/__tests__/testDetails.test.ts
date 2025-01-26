import {loader} from '~/routes/api/v1/testDetails' // Adjust the path as necessary
import TestsController from '@controllers/tests.controller'

import {checkForProjectId, checkForTestId} from '~/routes/utilities/utils'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {getUserAndCheckAccess} from '@route/utils/checkForUserAndAccess'
import {API} from '@route/utils/api'

jest.mock('@controllers/tests.controller')
jest.mock('@route/utils/checkForUserAndAccess')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/utils')

describe('Get Test Details - Loader Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully fetch test details for a valid projectId and testId', async () => {
    const request = new Request('http://localhost?projectId=123&testId=456', {
      method: 'GET',
    })
    const mockTestDetails = {
      testId: 456,
      testName: 'Sample Test',
      projectId: 123,
    }

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForProjectId as jest.Mock).mockReturnValue(true)
    ;(checkForTestId as jest.Mock).mockReturnValue(true)
    ;(TestsController.getTestDetails as jest.Mock).mockResolvedValue(
      mockTestDetails,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await loader({params: {}, request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetTestDetails,
    })
    expect(checkForProjectId).toHaveBeenCalledWith(123)
    expect(checkForTestId).toHaveBeenCalledWith(456)
    expect(TestsController.getTestDetails).toHaveBeenCalledWith(123, 456)
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockTestDetails,
      status: 200,
    })
  })

  it('should return an error for an invalid projectId', async () => {
    const request = new Request(
      'http://localhost?projectId=invalid&testId=456',
      {method: 'GET'},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForProjectId as jest.Mock).mockReturnValue(false)
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: 400}),
    )

    const response = (await loader({params: {}, request} as any)) as Response

    expect(checkForProjectId).toHaveBeenCalledWith(NaN)
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Invalid param projectId',
      status: 400,
    })
    expect(response.status).toBe(400)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Invalid param projectId',
      status: 400,
    })
  })

  it('should return an error for an invalid testId', async () => {
    const request = new Request(
      'http://localhost?projectId=123&testId=invalid',
      {method: 'GET'},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForProjectId as jest.Mock).mockReturnValue(true)
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
      resource: API.GetTestDetails,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Unexpected error',
    })
  })
})
