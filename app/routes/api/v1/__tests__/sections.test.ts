import {loader} from '~/routes/api/v1/sections'
import SectionsController from '~/dataController/sections.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {API} from '~/routes/utilities/api'
import {ErrorCause} from '~/constants'
import SearchParams from '@route/utils/getSearchParams'

jest.mock('~/dataController/sections.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('@route/utils/getSearchParams')

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

    ;(SearchParams.getSections as jest.Mock).mockReturnValue({projectId: 123})
    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue({userId: 123})
    ;(SectionsController.getAllSections as jest.Mock).mockResolvedValue(
      mockSectionsData,
    )
    ;(responseHandler as jest.Mock).mockImplementation((resp) => resp)

    const response = await loader({params: {}, request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetSections,
    })
    expect(SearchParams.getSections).toHaveBeenCalledWith({
      params: {},
      request,
    })
    expect(SectionsController.getAllSections).toHaveBeenCalledWith({
      projectId: 123,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockSectionsData,
      status: 200,
    })
    expect(response).toEqual({data: mockSectionsData, status: 200})
    expect(response.status).toBe(200)
  })

  it('should throw an error for invalid projectId', async () => {
    const request = new Request('http://localhost?projectId=invalid', {
      method: 'GET',
    })

    ;(SearchParams.getSections as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid projectId', {cause: ErrorCause.INVALID_PARAMS})
    })
    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue({userId: 123})
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => {
      return {
        error: error,
        status: 400,
      }
    })

    const response = await loader({params: {}, request} as any)

    expect(SearchParams.getSections).toHaveBeenCalledWith({
      params: {},
      request,
    })

    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('Invalid projectId', {cause: ErrorCause.INVALID_PARAMS}),
    )

    expect(response).toEqual({
      error: new Error('Invalid projectId', {cause: ErrorCause.INVALID_PARAMS}),
      status: 400,
    })
    expect(SectionsController.getAllSections).not.toHaveBeenCalled()
  })

  it('should handle missing projectId', async () => {
    const request = new Request('http://localhost', {method: 'GET'})

    ;(SearchParams.getSections as jest.Mock).mockReturnValue({projectId: 0})
    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue({userId: 123})
    const errorObj = new Error('Invalid projectId')
    ;(SectionsController.getAllSections as jest.Mock).mockImplementation(() => {
      throw errorObj
    })
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(
          JSON.stringify({
            error: error.message,
            cause: ErrorCause.INVALID_PARAMS,
          }),
          {status: 400},
        ),
    )

    const response = await loader({params: {}, request} as any)

    expect(SearchParams.getSections).toHaveBeenCalledWith({
      params: {},
      request,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid projectId',
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

    // Let the param parse succeed, but the user check fails for some reason:
    ;(SearchParams.getSections as jest.Mock).mockReturnValue({
      projectId: 123,
    })
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
