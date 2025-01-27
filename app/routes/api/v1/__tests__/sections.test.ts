import {loader} from '~/routes/api/v1/sections'
import SectionsController from '~/dataController/sections.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForProjectId} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'
import {ErrorCause} from '~/constants'

jest.mock('~/dataController/sections.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Get Sections - Loader Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully fetch sections for a valid projectId', async () => {
    const request = new Request('http://localhost?projectId=123', {
      method: 'GET',
    })
    const mockSectionsData = [
      {sectionId: 1, sectionName: 'Section A'},
      {sectionId: 2, sectionName: 'Section B'},
    ]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForProjectId as jest.Mock).mockReturnValue(true)
    ;(SectionsController.getAllSections as jest.Mock).mockResolvedValue(
      mockSectionsData,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await loader({params: {}, request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetSections,
    })
    expect(checkForProjectId).toHaveBeenCalledWith(123)
    expect(SectionsController.getAllSections).toHaveBeenCalledWith({
      projectId: 123,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockSectionsData,
      status: 200,
    })
  })

  it('should throw an error for invalid projectId', async () => {
    const request = new Request('http://localhost?projectId=invalid', {
      method: 'GET',
    })

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForProjectId as jest.Mock).mockReturnValue(false)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(
          JSON.stringify({error: error.message, cause: error.cause}),
          {status: 400},
        ),
    )

    const response = await loader({params: {}, request} as any)

    expect(checkForProjectId).toHaveBeenCalledWith(NaN)
    expect(errorResponseHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid projectId',
        cause: ErrorCause.INVALID_PARAMS,
      }),
    )
    expect(response.status).toBe(400)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Invalid projectId',
      cause: ErrorCause.INVALID_PARAMS,
    })
  })

  it('should handle missing projectId', async () => {
    const request = new Request('http://localhost', {method: 'GET'})

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForProjectId as jest.Mock).mockReturnValue(false)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(
          JSON.stringify({error: error.message, cause: error.cause}),
          {status: 400},
        ),
    )

    const response = await loader({params: {}, request} as any)

    expect(checkForProjectId).toHaveBeenCalledWith(0)
    expect(errorResponseHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid projectId',
        cause: ErrorCause.INVALID_PARAMS,
      }),
    )
    expect(response.status).toBe(400)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Invalid projectId',
      cause: ErrorCause.INVALID_PARAMS,
    })
  })

  it('should handle unexpected errors', async () => {
    const request = new Request('http://localhost?projectId=123', {
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
      resource: API.GetSections,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Unexpected error',
    })
  })
})
