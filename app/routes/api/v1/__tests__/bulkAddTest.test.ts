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

  it('should return validation error if request data is invalid', async () => {
    const invalidRequestData = {
      tests: [],
      labelIds: [1, 2],
      projectId: -1,
      orgId: 1001,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(invalidRequestData),
    })

    ;(getRequestParams as jest.Mock).mockRejectedValue(
      new Error('Validation Error: Invalid data'),
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('Validation Error: Invalid data'),
    )
  })

  it('should handle unexpected errors', async () => {
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
    const mockError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.AddTestBulk,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })
})
