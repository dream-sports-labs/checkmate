import {action} from '~/routes/api/v1/createTest'
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

describe('Create Test - Action Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully create a test when request is valid', async () => {
    const requestData = {
      title: 'New Test',
      sectionId: 1,
      labelIds: [1, 2],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockCreateTestData = {
      testId: 456,
      testsAdded: 1,
    }

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.createTest as jest.Mock).mockResolvedValue(
      mockCreateTestData,
    )
    ;(TestsController.updateLabelTestMap as jest.Mock).mockResolvedValue({})
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.AddTest,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(TestsController.createTest).toHaveBeenCalledWith({
      ...requestData,
      assignedTo: 123,
      createdBy: 123,
    })
    expect(TestsController.updateLabelTestMap).toHaveBeenCalledWith({
      labelIds: [1, 2],
      testId: 456,
      createdBy: 123,
      projectId: 101,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        testTitle: 'New Test',
        testId: 456,
        testsAdded: 1,
        message: 'Test added successfully with title - New Test',
      },
      status: 200,
    })
  })

  it('should return validation error if schema validation fails', async () => {
    const invalidRequestData = {
      title: '',
      sectionId: null,
      new_section: null,
      labelIds: [1, 2],
      projectId: -1, // Invalid projectId
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
      title: 'New Test',
      sectionId: 1,
      labelIds: [1, 2],
      projectId: 101,
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
      resource: API.AddTest,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })

  it('should handle undefined user with fallback to 1', async () => {
    const requestData = {
      title: 'New Test',
      sectionId: 1,
      labelIds: [1, 2],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockCreateTestData = {
      testId: 456,
      testsAdded: 1,
    }

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(undefined)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.createTest as jest.Mock).mockResolvedValue(
      mockCreateTestData,
    )
    ;(TestsController.updateLabelTestMap as jest.Mock).mockResolvedValue({})
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(TestsController.createTest).toHaveBeenCalledWith({
      ...requestData,
      assignedTo: 1,
      createdBy: 1,
    })
    expect(TestsController.updateLabelTestMap).toHaveBeenCalledWith({
      labelIds: [1, 2],
      testId: 456,
      createdBy: 0,
      projectId: 101,
    })
  })

  it('should handle error in updateLabelTestMap', async () => {
    const requestData = {
      title: 'New Test',
      sectionId: 1,
      labelIds: [1, 2],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockCreateTestData = {
      testId: 456,
      testsAdded: 1,
    }
    const mockError = new Error('Failed to update label test map')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.createTest as jest.Mock).mockResolvedValue(
      mockCreateTestData,
    )
    ;(TestsController.updateLabelTestMap as jest.Mock).mockRejectedValue(
      mockError,
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })

  it('should validate schema with both sectionId and new_section', async () => {
    const invalidRequestData = {
      title: 'New Test',
      sectionId: 1,
      new_section: 'New Section',
      labelIds: [1, 2],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(invalidRequestData),
    })

    ;(getRequestParams as jest.Mock).mockRejectedValue(
      new Error('Both sectionId and new_section cannot be provided'),
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('Both sectionId and new_section cannot be provided'),
    )
  })

  it('should validate schema with both squadId and new_squad', async () => {
    const invalidRequestData = {
      title: 'New Test',
      sectionId: 1,
      squadId: 1,
      new_squad: 'New Squad',
      labelIds: [1, 2],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(invalidRequestData),
    })

    ;(getRequestParams as jest.Mock).mockRejectedValue(
      new Error('Both squadId and New Squad cannot be provided'),
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('Both squadId and New Squad cannot be provided'),
    )
  })

  it('should handle error in createTest', async () => {
    const requestData = {
      title: 'New Test',
      sectionId: 1,
      labelIds: [1, 2],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockError = new Error('Failed to create test')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.createTest as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })

  it('should validate missing section', async () => {
    const invalidRequestData = {
      title: 'New Test',
      labelIds: [1, 2],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(invalidRequestData),
    })

    ;(getRequestParams as jest.Mock).mockRejectedValue(
      new Error('Select or add section'),
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('Select or add section'),
    )
  })

  it('should handle error in responseHandler', async () => {
    const requestData = {
      title: 'New Test',
      sectionId: 1,
      labelIds: [1, 2],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockCreateTestData = {
      testId: 456,
      testsAdded: 1,
    }
    const mockError = new Error('Failed to handle response')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.createTest as jest.Mock).mockResolvedValue(mockCreateTestData)
    ;(TestsController.updateLabelTestMap as jest.Mock).mockResolvedValue({})
    ;(responseHandler as jest.Mock).mockImplementation(() => {
      throw mockError
    })
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })
})
