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

    const mockUser = {userId: 123}
    const mockResponse = {
      success: [
        {squadId: 1, squadName: 'squad1', projectId: 1, createdBy: 123},
        {squadId: 2, squadName: 'squad2', projectId: 1, createdBy: null},
      ],
      failed: [],
    }

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(SquadsController.addMulitpleSquads as jest.Mock).mockResolvedValue(
      mockResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request: expect.any(Request),
      resource: API.AddSquads,
    })
    expect(SquadsController.addMulitpleSquads).toHaveBeenCalledWith({
      projectId: 1,
      squads: ['squad1', 'squad2'],
      createdBy: 123,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        success: {
          message: '2 Squad(s) added successfully',
          existingSquads: [
            {squadId: 1, squadName: 'squad1', projectId: 1, createdBy: 123},
          ],
          newSquads: [
            {squadId: 2, squadName: 'squad2', projectId: 1, createdBy: null},
          ],
        },
      },
      status: 201,
    })
  })

  it('should return 400 if content-type is not application/json', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'text/plain'},
    })
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

    const mockUser = {userId: 123}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const response = await action({request} as any)
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('At least one squad must be provided'),
    )
  })

  it('should return failure response if squads cannot be added due to duplicates', async () => {
    const requestData = {
      squads: ['squad1', 'squad2'],
      projectId: 1,
    }
    const mockUser = {userId: 123}
    const mockResponse = {
      success: [],
      failed: ['squad1', 'squad2'],
    }

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(SquadsController.addMulitpleSquads as jest.Mock).mockResolvedValue(
      mockResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const response = await action({request} as any)
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        failed: {
          message: '2 Squad(s) failed to add',
          squads: ['squad1', 'squad2'],
        },
      },
      status: 201,
    })
  })

  it('should return a response with both successful and failed squads', async () => {
    const requestData = {
      squads: ['squad1', 'squad2', 'squad3'],
      projectId: 1,
    }
    const mockUser = {userId: 123}
    const mockResponse = {
      success: [
        {squadId: 1, squadName: 'squad1', projectId: 1, createdBy: 123},
      ],
      failed: ['squad2', 'squad3'],
    }

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(SquadsController.addMulitpleSquads as jest.Mock).mockResolvedValue(
      mockResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })

    const response = await action({request} as any)

    expect(SquadsController.addMulitpleSquads).toHaveBeenCalledWith({
      projectId: 1,
      squads: ['squad1', 'squad2', 'squad3'],
      createdBy: 123,
    })

    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        success: {
          message: '1 Squad(s) added successfully',
          existingSquads: [
            {squadId: 1, squadName: 'squad1', projectId: 1, createdBy: 123},
          ],
          newSquads: [],
        },
        failed: {
          message: '2 Squad(s) failed to add',
          squads: ['squad2', 'squad3'],
        },
      },
      status: 201,
    })
  })

  it('should handle unexpected errors gracefully', async () => {
    const requestData = {
      squads: ['squad1'],
      projectId: 1,
    }
    const mockError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const response = await action({request} as any)
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })
})
