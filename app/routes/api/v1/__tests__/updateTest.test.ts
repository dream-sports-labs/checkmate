import {action} from '~/routes/api/v1/updateTest'
import TestsController from '@controllers/tests.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'
import {z} from 'zod'

jest.mock('@controllers/tests.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Update Test - Action Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully update a test for valid input', async () => {
    const requestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      sectionId: 789,
      priorityId: 1,
      automationStatusId: 2,
      labelIds: [1, 2, 3],
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockUpdateResponse = {testData: 1}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.updateTest as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.EditTest,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(TestsController.updateTest).toHaveBeenCalledWith({
      ...requestData,
      updatedBy: mockUser.userId,
    })
    expect(TestsController.updateLabelTestMap).toHaveBeenCalledWith({
      labelIds: [1, 2, 3],
      testId: 123,
      createdBy: 123,
      projectId: 456,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        message: 'Updated test successfully for testId : 123',
      },
      status: 200,
    })
  })

  it('should return a message when no test is found for the provided testId', async () => {
    const requestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      sectionId: 789,
      priorityId: 1,
      automationStatusId: 2,
      labelIds: [1, 2, 3],
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockUpdateResponse = {testData: 0}

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.updateTest as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )

    const response = await action({request} as any)

    expect(TestsController.updateTest).toHaveBeenCalledWith({
      ...requestData,
      updatedBy: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        message: 'No test found for testId : 123',
      },
      status: 200,
    })
  })

  it('should handle validation errors', async () => {
    const invalidRequestData = {
      testId: -1, // Invalid testId
      title: 'Short',
      projectId: -456, // Invalid projectId
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(invalidRequestData),
    })
    const mockZodError = new z.ZodError([
      {path: ['testId'], message: 'Test is required', code: 'custom'},
      {
        path: ['title'],
        message: 'Number of characters are less than 5',
        code: 'custom',
      },
      {path: ['projectId'], message: 'Project is required', code: 'custom'},
    ])

    ;(getRequestParams as jest.Mock).mockRejectedValue(mockZodError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 400}),
    )

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(mockZodError)
    expect(response.status).toBe(400)

    const responseData = await response.json()
    expect(responseData).toEqual({
      error: mockZodError.message,
    })
  })

  it('should handle unexpected errors', async () => {
    const requestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 500}),
    )

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.EditTest,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)

    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Unexpected error',
    })
  })

  it('should handle error in updateTest', async () => {
    const requestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      sectionId: 789,
      priorityId: 1,
      automationStatusId: 2,
      labelIds: [1, 2, 3],
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockError = new Error('Failed to update test')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.updateTest as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })

  it('should handle error in updateLabelTestMap', async () => {
    const requestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      sectionId: 789,
      priorityId: 1,
      automationStatusId: 2,
      labelIds: [1, 2, 3],
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockUpdateResponse = {testData: 1}
    const mockError = new Error('Failed to update label test map')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.updateTest as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(TestsController.updateLabelTestMap as jest.Mock).mockRejectedValue(
      mockError,
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })

  it('should validate missing section', async () => {
    const invalidRequestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      priorityId: 1,
      automationStatusId: 2,
      labelIds: [1, 2, 3],
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(invalidRequestData),
    })

    ;(getRequestParams as jest.Mock).mockRejectedValue(
      new Error('Select or Create a section'),
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('Select or Create a section'),
    )
  })

  it('should validate both sectionId and new_section', async () => {
    const invalidRequestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      sectionId: 789,
      new_section: 'New Section',
      priorityId: 1,
      automationStatusId: 2,
      labelIds: [1, 2, 3],
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

  it('should validate both squadId and new_squad', async () => {
    const invalidRequestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      sectionId: 789,
      squadId: 1,
      new_squad: 'New Squad',
      priorityId: 1,
      automationStatusId: 2,
      labelIds: [1, 2, 3],
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

  it('should handle error in responseHandler', async () => {
    const requestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      sectionId: 789,
      priorityId: 1,
      automationStatusId: 2,
      labelIds: [1, 2, 3],
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 123}
    const mockUpdateResponse = {testData: 1}
    const mockError = new Error('Failed to handle response')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.updateTest as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(TestsController.updateLabelTestMap as jest.Mock).mockResolvedValue({})
    ;(responseHandler as jest.Mock).mockImplementation(() => {
      throw mockError
    })
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })
})
