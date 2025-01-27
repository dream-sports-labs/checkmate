import {action} from '~/routes/api/v1/addSquads'
import SquadsController from '@controllers/squads.controller'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {getRequestParams} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'

jest.mock('@controllers/squads.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Add Squads - Action Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully add squads when request is valid', async () => {
    const requestData = {
      squads: ['squad1', 'squad2'],
      projectId: 1,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockResponse = [{affectedRows: 2}]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(SquadsController.addSquads as jest.Mock).mockResolvedValue(mockResponse)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.AddSquads,
    })
    expect(SquadsController.addSquads).toHaveBeenCalledWith({
      projectId: 1,
      squads: ['squad1', 'squad2'],
      createdBy: 123,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {message: '2 Squad(s) added successfully'},
      status: 201,
    })
  })

  it('should return 400 if content-type is not application/json', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'text/plain'},
    })

    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Invalid content type, expected application/json',
      status: 400,
    })
  })

  it('should throw an error if no squads are provided', async () => {
    const requestData = {
      squads: [],
      projectId: 1,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('At least one squad must be provided'),
    )
  })

  it('should return 400 if squads cannot be added due to duplicates', async () => {
    const requestData = {
      squads: ['squad1', 'squad2'],
      projectId: 1,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(SquadsController.addSquads as jest.Mock).mockResolvedValue(null)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(SquadsController.addSquads).toHaveBeenCalledWith({
      projectId: 1,
      squads: ['squad1', 'squad2'],
      createdBy: 123,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Error adding squads due to duplicate entries',
      status: 400,
    })
  })

  it('should handle unexpected errors', async () => {
    const requestData = {
      squads: ['squad1'],
      projectId: 1,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })
})
