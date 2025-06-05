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
    const mockResponse = new Response(
      JSON.stringify({message: 'Updated test successfully for testId : 123'}),
      {status: 200},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.updateTest as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(responseHandler as jest.Mock).mockReturnValue(mockResponse)

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
    expect(response.status).toBe(200)
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
    const mockResponse = new Response(
      JSON.stringify({message: 'No test found for testId : 123'}),
      {status: 200},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.updateTest as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(responseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(TestsController.updateTest).toHaveBeenCalledWith({
      ...requestData,
      updatedBy: mockUser.userId,
    })
    expect(TestsController.updateLabelTestMap).not.toHaveBeenCalled()
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        message: 'No test found for testId : 123',
      },
      status: 200,
    })
    expect(response.status).toBe(200)
  })

  it('should handle zod validation errors', async () => {
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
    const mockResponse = new Response(
      JSON.stringify({error: mockZodError.message}),
      {status: 400},
    )

    ;(getRequestParams as jest.Mock).mockRejectedValue(mockZodError)
    ;(errorResponseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(mockZodError)
    expect(response.status).toBe(400)

    const responseData = await response.json()
    expect(responseData).toEqual({
      error: mockZodError.message,
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
    ;(errorResponseHandler as jest.Mock).mockReturnValue(
      new Response(JSON.stringify({error: mockError.message}), {status: 500}),
    )

    const response = await action({request} as any)

    expect(TestsController.updateTest).toHaveBeenCalledWith({
      ...requestData,
      updatedBy: mockUser.userId,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)
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
    const mockResponse = new Response(
      JSON.stringify({error: mockError.message}),
      {status: 500},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.updateTest as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(TestsController.updateLabelTestMap as jest.Mock).mockRejectedValue(
      mockError,
    )
    ;(errorResponseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(TestsController.updateTest).toHaveBeenCalledWith({
      ...requestData,
      updatedBy: mockUser.userId,
    })
    expect(TestsController.updateLabelTestMap).toHaveBeenCalledWith({
      labelIds: [1, 2, 3],
      testId: 123,
      createdBy: mockUser.userId,
      projectId: 456,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)
  })

  it('should validate when both sectionId and new_section are provided', async () => {
    const requestData = {
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
      body: JSON.stringify(requestData),
    })
    const mockZodError = new z.ZodError([
      {
        path: ['sectionId'],
        message: 'Both sectionId and new_section cannot be provided',
        code: 'custom',
      },
    ])
    const mockResponse = new Response(
      JSON.stringify({error: mockZodError.message}),
      {status: 400},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue({userId: 123})
    ;(getRequestParams as jest.Mock).mockRejectedValue(mockZodError)
    ;(errorResponseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(mockZodError)
    expect(response.status).toBe(400)
  })

  it('should validate when both squadId and new_squad are provided', async () => {
    const requestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      sectionId: 789,
      squadId: 101,
      new_squad: 'New Squad',
      priorityId: 1,
      automationStatusId: 2,
      labelIds: [1, 2, 3],
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockZodError = new z.ZodError([
      {
        path: ['sectionId'],
        message: 'Both squadId and New Squad cannot be provided',
        code: 'custom',
      },
    ])
    const mockResponse = new Response(
      JSON.stringify({error: mockZodError.message}),
      {status: 400},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue({userId: 123})
    ;(getRequestParams as jest.Mock).mockRejectedValue(mockZodError)
    ;(errorResponseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(mockZodError)
    expect(response.status).toBe(400)
  })

  it('should handle undefined user in getUserAndCheckAccess', async () => {
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
    const mockUpdateResponse = {testData: 1}
    const mockResponse = new Response(
      JSON.stringify({message: 'Updated test successfully for testId : 123'}),
      {status: 200},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(undefined)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.updateTest as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(TestsController.updateLabelTestMap as jest.Mock).mockResolvedValue({})
    ;(responseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.EditTest,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(TestsController.updateTest).toHaveBeenCalledWith({
      ...requestData,
      updatedBy: 0,
    })
    expect(TestsController.updateLabelTestMap).toHaveBeenCalledWith({
      labelIds: [1, 2, 3],
      testId: 123,
      createdBy: 0,
      projectId: 456,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        message: 'Updated test successfully for testId : 123',
      },
      status: 200,
    })
    expect(response.status).toBe(200)
  })

  it('should validate missing section and new_section', async () => {
    const requestData = {
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
      body: JSON.stringify(requestData),
    })
    const mockZodError = new z.ZodError([
      {
        path: ['sectionId'],
        message: 'Select or Create a section',
        code: 'custom',
      },
    ])
    const mockResponse = new Response(
      JSON.stringify({error: mockZodError.message}),
      {status: 400},
    )

    ;(getRequestParams as jest.Mock).mockRejectedValue(mockZodError)
    ;(errorResponseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(mockZodError)
    expect(response.status).toBe(400)
  })

  it('should validate new_section without sectionId', async () => {
    const requestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      new_section: 'New Section',
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
    const mockResponse = new Response(
      JSON.stringify({message: 'Updated test successfully for testId : 123'}),
      {status: 200},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.updateTest as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(responseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(TestsController.updateTest).toHaveBeenCalledWith({
      ...requestData,
      updatedBy: mockUser.userId,
    })
    expect(response.status).toBe(200)
  })

  it('should validate new_squad without squadId', async () => {
    const requestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      sectionId: 789,
      new_squad: 'New Squad',
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
    const mockResponse = new Response(
      JSON.stringify({message: 'Updated test successfully for testId : 123'}),
      {status: 200},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.updateTest as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(responseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(TestsController.updateTest).toHaveBeenCalledWith({
      ...requestData,
      updatedBy: mockUser.userId,
    })
    expect(response.status).toBe(200)
  })

  it('should handle error in getUserAndCheckAccess', async () => {
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
    const mockError = new Error('Failed to get user access')
    const mockResponse = new Response(
      JSON.stringify({error: mockError.message}),
      {status: 500},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.EditTest,
    })
    expect(getRequestParams).not.toHaveBeenCalled()
    expect(TestsController.updateTest).not.toHaveBeenCalled()
    expect(TestsController.updateLabelTestMap).not.toHaveBeenCalled()
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)
  })

  it('should validate when neither sectionId nor new_section is provided', async () => {
    const requestData = {
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
      body: JSON.stringify(requestData),
    })
    const mockZodError = new z.ZodError([
      {
        path: ['sectionId'],
        message: 'Select or Create a section',
        code: 'custom',
      },
    ])
    const mockResponse = new Response(
      JSON.stringify({error: mockZodError.message}),
      {status: 400},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue({userId: 123})
    ;(getRequestParams as jest.Mock).mockRejectedValue(mockZodError)
    ;(errorResponseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(mockZodError)
    expect(response.status).toBe(400)
  })

  it('should validate when both sectionId and new_section are null', async () => {
    const requestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      priorityId: 1,
      automationStatusId: 2,
      labelIds: [1, 2, 3],
      sectionId: null,
      new_section: null,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockZodError = new z.ZodError([
      {
        path: ['sectionId'],
        message: 'Select or Create a section',
        code: 'custom',
      },
    ])
    const mockResponse = new Response(
      JSON.stringify({error: mockZodError.message}),
      {status: 400},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue({userId: 123})
    ;(getRequestParams as jest.Mock).mockRejectedValue(mockZodError)
    ;(errorResponseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.EditTest,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(mockZodError)
    expect(response.status).toBe(400)
  })

  it('should validate when squadId is null but new_squad is provided', async () => {
    const requestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      sectionId: 789,
      squadId: null,
      new_squad: 'New Squad',
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
    const mockResponse = new Response(
      JSON.stringify({message: 'Updated test successfully for testId : 123'}),
      {status: 200},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.updateTest as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(responseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(TestsController.updateTest).toHaveBeenCalledWith({
      ...requestData,
      updatedBy: mockUser.userId,
    })
    expect(response.status).toBe(200)
  })

  it('should validate when sectionId is null but new_section is provided', async () => {
    const requestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      sectionId: null,
      new_section: 'New Section',
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
    const mockResponse = new Response(
      JSON.stringify({message: 'Updated test successfully for testId : 123'}),
      {status: 200},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.updateTest as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(responseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(TestsController.updateTest).toHaveBeenCalledWith({
      ...requestData,
      updatedBy: mockUser.userId,
    })
    expect(response.status).toBe(200)
  })

  it('should handle both squadId and new_squad being provided', async () => {
    const requestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      sectionId: 789,
      squadId: 101,
      new_squad: 'New Squad',
      priorityId: 1,
      automationStatusId: 2,
      labelIds: [1, 2, 3],
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockZodError = new z.ZodError([
      {
        path: ['squadId'],
        message: 'Both squadId and new_squad cannot be provided',
        code: 'custom',
      },
    ])
    const mockResponse = new Response(
      JSON.stringify({error: mockZodError.message}),
      {status: 400},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue({userId: 123})
    ;(getRequestParams as jest.Mock).mockRejectedValue(mockZodError)
    ;(errorResponseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(mockZodError)
    expect(response.status).toBe(400)
  })

  it('should handle missing section information', async () => {
    const requestData = {
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
      body: JSON.stringify(requestData),
    })
    const mockZodError = new z.ZodError([
      {
        path: ['sectionId'],
        message: 'Select or Create a section',
        code: 'custom',
      },
    ])
    const mockResponse = new Response(
      JSON.stringify({error: mockZodError.message}),
      {status: 400},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue({userId: 123})
    ;(getRequestParams as jest.Mock).mockRejectedValue(mockZodError)
    ;(errorResponseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(mockZodError)
    expect(response.status).toBe(400)
  })

  it('should successfully update test with new_section', async () => {
    const requestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      new_section: 'New Section',
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
    const mockResponse = new Response(
      JSON.stringify({message: 'Updated test successfully for testId : 123'}),
      {status: 200},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.updateTest as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(TestsController.updateLabelTestMap as jest.Mock).mockResolvedValue({})
    ;(responseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(TestsController.updateTest).toHaveBeenCalledWith({
      ...requestData,
      updatedBy: mockUser.userId,
    })
    expect(response.status).toBe(200)
  })

  it('should successfully update test with new_squad', async () => {
    const requestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      sectionId: 789,
      new_squad: 'New Squad',
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
    const mockResponse = new Response(
      JSON.stringify({message: 'Updated test successfully for testId : 123'}),
      {status: 200},
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(TestsController.updateTest as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(TestsController.updateLabelTestMap as jest.Mock).mockResolvedValue({})
    ;(responseHandler as jest.Mock).mockReturnValue(mockResponse)

    const response = await action({request} as any)

    expect(TestsController.updateTest).toHaveBeenCalledWith({
      ...requestData,
      updatedBy: mockUser.userId,
    })
    expect(response.status).toBe(200)
  })

  it('should validate error when neither sectionId nor new_section is provided', async () => {
    const invalidRequestData = {
      testId: 123,
      title: 'Updated Test',
      projectId: 456,
      squadId: 101,
      priorityId: 1,
      automationStatusId: 2,
      labelIds: [1, 2, 3],
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(invalidRequestData),
    })

    const mockError = new Error('Select or Create a section')
    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue({userId: 123})
    ;(getRequestParams as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => {
      return new Response(JSON.stringify({error: error.message}), {status: 400})
    })

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(400)

    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Select or Create a section',
    })
  })

  it('should use exact Zod schema for validation', async () => {
    // This test explicitly checks the refinement rules in the Zod schema
    const mockUser = {userId: 123}
    const mockUpdateResponse = {testData: 1}

    // This will cause updateTest action to use the schema directly
    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockImplementation((req, schema) => {
      // Validate that the exact schema from updateTest.ts is being used
      expect(schema).toBeDefined()

      // Check that schema includes the specific refinements
      const refinements = schema._def.refinements
      expect(refinements).toBeDefined()
      expect(refinements.length).toBeGreaterThanOrEqual(3)

      // Return a valid test data object
      return {
        testId: 123,
        title: 'Test',
        projectId: 456,
        sectionId: 789,
        labelIds: [1, 2, 3],
      }
    })
    ;(TestsController.updateTest as jest.Mock).mockResolvedValue(
      mockUpdateResponse,
    )
    ;(TestsController.updateLabelTestMap as jest.Mock).mockResolvedValue({})
    ;(responseHandler as jest.Mock).mockReturnValue(
      new Response(JSON.stringify({message: 'Success'}), {status: 200}),
    )

    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({testId: 123}),
    })

    await action({request} as any)

    // Verify that getRequestParams was called with the schema
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
  })

  it('should directly test the UpdateTestRequestSchema refinements', () => {
    // Import the schema directly to test its refinements
    const {UpdateTestRequestSchema} = require('~/routes/api/v1/updateTest')

    // Test the refinement that checks if either sectionId or new_section is provided
    // This should pass validation - with sectionId
    expect(() =>
      UpdateTestRequestSchema.parse({
        testId: 123,
        title: 'Valid Test Title',
        projectId: 456,
        sectionId: 789,
        priorityId: 1,
        automationStatusId: 2,
        labelIds: [1, 2, 3],
      }),
    ).not.toThrow()

    // This should pass validation - with new_section
    expect(() =>
      UpdateTestRequestSchema.parse({
        testId: 123,
        title: 'Valid Test Title',
        projectId: 456,
        new_section: 'New Section',
        priorityId: 1,
        automationStatusId: 2,
        labelIds: [1, 2, 3],
      }),
    ).not.toThrow()

    // This should fail validation - both squadId and new_squad are provided
    try {
      UpdateTestRequestSchema.parse({
        testId: 123,
        title: 'Valid Test Title',
        projectId: 456,
        sectionId: 789,
        squadId: 101,
        new_squad: 'New Squad',
        priorityId: 1,
        automationStatusId: 2,
        labelIds: [1, 2, 3],
      })
      // If we get here, test failed
      expect(true).toBe(false) // Force test to fail
    } catch (error: any) {
      // We expect an error to be thrown
      expect(error.message).toContain(
        'Both squadId and New Squad cannot be provided',
      )
    }
  })
})
