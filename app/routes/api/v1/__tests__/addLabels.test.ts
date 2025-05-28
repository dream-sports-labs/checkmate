import LabelsController from '@controllers/labels.controller'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {responseHandler, errorResponseHandler} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '~/routes/utilities/utils'
import {action} from '../addLabels'

jest.mock('@controllers/labels.controller')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')
jest.mock('~/routes/utilities/responseHandler')

jest.mock('../../../utilities/utils')
jest.mock('~/dataController/projects.controller')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/responseHandler')

interface MockResponse {
  affectedRows: number
}

describe('Labels Action', () => {
  const mockRequest = (body: any, headers: Record<string, string> = {}) => ({
    headers: new Map(Object.entries(headers)),
    json: jest.fn().mockResolvedValue(body),
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 if Content-Type is not application/json', async () => {
    const requestData = {labels: ['duplicateLabel'], projectId: 1}
    const request = mockRequest(requestData, {'content-type': 'text/plain'})

    await action({request} as any)

    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Invalid content type, expected application/json',
      status: 400,
    })
  })

  it('should not add duplicate labels', async () => {
    const requestData = {labels: ['duplicateLabel'], projectId: 1}
    const request = mockRequest(requestData, {
      'content-type': 'application/json',
    })
    const mockUser = {userId: 123}
    const mockResponse = null // Simulate duplicate entry resulting in no affected rows

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(LabelsController.addLabels as jest.Mock).mockResolvedValue(mockResponse)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.AddLabels,
    })
    expect(LabelsController.addLabels).toHaveBeenCalledWith({
      projectId: 1,
      labels: ['duplicateLabel'],
      createdBy: 123,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Error adding labels due to duplicate entries',
      status: 400,
    })
  })

  it('should add labels if request is valid', async () => {
    const requestData = {labels: ['label1', 'label2'], projectId: 1}
    const request = mockRequest(requestData, {
      'content-type': 'application/json',
    })
    const mockUser = {userId: 123}
    const mockResponse: MockResponse[] = [{affectedRows: 2}]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(LabelsController.addLabels as jest.Mock).mockResolvedValue(mockResponse)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.AddLabels,
    })
    expect(LabelsController.addLabels).toHaveBeenCalledWith({
      projectId: 1,
      labels: ['label1', 'label2'],
      createdBy: 123,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {message: '2 label(s) added'},
      status: 201,
    })
  })

  it('should handle validation errors for empty labels array', async () => {
    const requestData = {labels: [], projectId: 1}
    const request = mockRequest(requestData, {
      'content-type': 'application/json',
    })
    const mockUser = {userId: 123}
    const validationError = new Error('At least one label is required')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockRejectedValue(validationError)

    await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(validationError)
  })

  it('should handle validation errors for invalid projectId', async () => {
    const requestData = {labels: ['label1'], projectId: 0}
    const request = mockRequest(requestData, {
      'content-type': 'application/json',
    })
    const mockUser = {userId: 123}
    const validationError = new Error('Project ID must be greater than 0')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockRejectedValue(validationError)

    await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(validationError)
  })

  it('should handle unauthorized access', async () => {
    const requestData = {labels: ['label1'], projectId: 1}
    const request = mockRequest(requestData, {
      'content-type': 'application/json',
    })
    const authError = new Error('Unauthorized access')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(authError)

    await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(authError)
  })

  it('should handle database errors', async () => {
    const requestData = {labels: ['label1'], projectId: 1}
    const request = mockRequest(requestData, {
      'content-type': 'application/json',
    })
    const mockUser = {userId: 123}
    const dbError = new Error('Database connection failed')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(LabelsController.addLabels as jest.Mock).mockRejectedValue(dbError)

    await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(dbError)
  })

  it('should handle empty response from controller', async () => {
    const requestData = {labels: ['label1'], projectId: 1}
    const request = mockRequest(requestData, {
      'content-type': 'application/json',
    })
    const mockUser = {userId: 123}
    const mockResponse = null

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(LabelsController.addLabels as jest.Mock).mockResolvedValue(mockResponse)

    await action({request} as any)

    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Error adding labels due to duplicate entries',
      status: 400,
    })
  })

  it('should handle multiple affected rows correctly', async () => {
    const requestData = {labels: ['label1', 'label2', 'label3'], projectId: 1}
    const request = mockRequest(requestData, {
      'content-type': 'application/json',
    })
    const mockUser = {userId: 123}
    const mockResponse: MockResponse[] = [{affectedRows: 3}]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(LabelsController.addLabels as jest.Mock).mockResolvedValue(mockResponse)

    await action({request} as any)

    expect(responseHandler).toHaveBeenCalledWith({
      data: {message: '3 label(s) added'},
      status: 201,
    })
  })

  it('should handle undefined user with fallback to 0', async () => {
    const requestData = {labels: ['label1'], projectId: 1}
    const request = mockRequest(requestData, {
      'content-type': 'application/json',
    })
    const mockUser = undefined
    const mockResponse: MockResponse[] = [{affectedRows: 1}]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(LabelsController.addLabels as jest.Mock).mockResolvedValue(mockResponse)

    await action({request} as any)

    expect(LabelsController.addLabels).toHaveBeenCalledWith({
      projectId: 1,
      labels: ['label1'],
      createdBy: 0,
    })
  })
})
