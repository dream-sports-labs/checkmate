import {action} from '~/routes/api/v1/bulkAddTest'
import TestsController from '@controllers/tests.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'

jest.mock('@controllers/tests.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Bulk Add Tests - Action Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully add tests when request is valid', async () => {
    const requestData = {
      tests: [
        {
          title: 'Test Case 1',
          sectionName: 'Section A',
          sectionHierarchy: 'Hierarchy A',
        },
      ],
      labelIds: [1, 2],
      projectId: 101,
      orgId: 1001,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockResponse = {message: 'Tests added successfully'}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.bulkAddTests as jest.Mock).mockResolvedValue(mockResponse)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.AddTestBulk,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(TestsController.bulkAddTests).toHaveBeenCalledWith({
      tests: requestData.tests,
      labelIds: requestData.labelIds,
      projectId: requestData.projectId,
      createdBy: mockUser.userId,
      orgId: requestData.orgId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockResponse,
      status: 201,
    })
  })

  it('should handle error in bulkAddTests', async () => {
    const requestData = {
      tests: [
        {
          title: 'Test Case 1',
          sectionName: 'Section A',
          sectionHierarchy: 'Hierarchy A',
        },
      ],
      labelIds: [1, 2],
      projectId: 101,
      orgId: 1001,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockError = new Error('Failed to add tests')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.bulkAddTests as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })

  it('should handle error in responseHandler', async () => {
    const requestData = {
      tests: [
        {
          title: 'Test Case 1',
          sectionName: 'Section A',
          sectionHierarchy: 'Hierarchy A',
        },
      ],
      labelIds: [1, 2],
      projectId: 101,
      orgId: 1001,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockResponse = {message: 'Tests added successfully'}
    const mockError = new Error('Failed to handle response')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.bulkAddTests as jest.Mock).mockResolvedValue(mockResponse)
    ;(responseHandler as jest.Mock).mockImplementation(() => {
      throw mockError
    })
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })

  it('should handle undefined user with fallback to 0', async () => {
    const requestData = {
      tests: [
        {
          title: 'Test Case 1',
          sectionName: 'Section A',
          sectionHierarchy: 'Hierarchy A',
        },
      ],
      labelIds: [1, 2],
      projectId: 101,
      orgId: 1001,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockResponse = {message: 'Tests added successfully'}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(undefined)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.bulkAddTests as jest.Mock).mockResolvedValue(mockResponse)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(TestsController.bulkAddTests).toHaveBeenCalledWith({
      tests: requestData.tests,
      labelIds: requestData.labelIds,
      projectId: requestData.projectId,
      createdBy: 0,
      orgId: requestData.orgId,
    })
  })

  it('should handle optional labelIds', async () => {
    const requestData = {
      tests: [
        {
          title: 'Test Case 1',
          sectionName: 'Section A',
          sectionHierarchy: 'Hierarchy A',
        },
      ],
      projectId: 101,
      orgId: 1001,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockResponse = {message: 'Tests added successfully'}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.bulkAddTests as jest.Mock).mockResolvedValue(mockResponse)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(TestsController.bulkAddTests).toHaveBeenCalledWith({
      tests: requestData.tests,
      labelIds: undefined,
      projectId: requestData.projectId,
      createdBy: mockUser.userId,
      orgId: requestData.orgId,
    })
  })
})
