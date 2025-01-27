import {loader} from '~/routes/api/v1/squads'
import SquadsController from '~/dataController/squads.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForValidId} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'

jest.mock('~/dataController/squads.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Get Squads - Loader Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully fetch squads for a valid projectId', async () => {
    const request = new Request('http://localhost?projectId=123', {
      method: 'GET',
    })
    const mockSquadsData = [
      {squadId: 1, squadName: 'Squad A'},
      {squadId: 2, squadName: 'Squad B'},
    ]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForValidId as jest.Mock).mockReturnValue(true)
    ;(SquadsController.getAllSquads as jest.Mock).mockResolvedValue(
      mockSquadsData,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await loader({params: {}, request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetSquads,
    })
    expect(checkForValidId).toHaveBeenCalledWith(123)
    expect(SquadsController.getAllSquads).toHaveBeenCalledWith({projectId: 123})
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockSquadsData,
      status: 200,
    })
  })

  it('should return an error for an invalid projectId', async () => {
    const request = new Request('http://localhost?projectId=invalid', {
      method: 'GET',
    })

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForValidId as jest.Mock).mockReturnValue(false)
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: 400}),
    )

    const response = (await loader({params: {}, request} as any)) as Response

    expect(checkForValidId).toHaveBeenCalledWith(NaN)
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

  it('should return an error if projectId is missing', async () => {
    const request = new Request('http://localhost', {method: 'GET'})

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForValidId as jest.Mock).mockReturnValue(false)
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: 400}),
    )

    const response = (await loader({params: {}, request} as any)) as Response

    expect(checkForValidId).toHaveBeenCalledWith(0)
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
      resource: API.GetSquads,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Unexpected error',
    })
  })
})
