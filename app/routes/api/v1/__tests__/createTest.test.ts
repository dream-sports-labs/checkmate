import {action} from '~/routes/api/v1/createTest'
import TestsController from '@controllers/tests.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'
import * as z from 'zod'

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
      new Error('Both squadId and new_squad cannot be provided'),
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('Both squadId and new_squad cannot be provided'),
    )
  })

  it('should validate schema with neither sectionId nor new_section', async () => {
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
      new Error('Either sectionId or new_section must be provided'),
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('Either sectionId or new_section must be provided'),
    )
  })

  it('should validate schema with neither squadId nor new_squad', async () => {
    const invalidRequestData = {
      title: 'New Test',
      sectionId: 1,
      labelIds: [1, 2],
      projectId: 101,
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(invalidRequestData),
    })

    ;(getRequestParams as jest.Mock).mockRejectedValue(
      new Error('Either squadId or new_squad must be provided'),
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(errorResponseHandler).toHaveBeenCalledWith(
      new Error('Either squadId or new_squad must be provided'),
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

  it('should validate schema with missing section', async () => {
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

  it('should handle error in getUserAndCheckAccess', async () => {
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
    const mockError = new Error('Access denied')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation((error) => error)

    const response = await action({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })

  it('should directly test the CreateTestRequestSchema validation', () => {
    // Import the schema directly to test its refinements
    const {CreateTestRequestSchema} = require('~/routes/api/v1/createTest')
    
    // Valid case with sectionId
    const validData1 = {
      title: 'Valid Test Title',
      projectId: 456,
      sectionId: 789,
      squadId: 101,
      priorityId: 1,
      automationStatusId: 2,
      labelIds: [1, 2, 3]
    };
    
    // Valid case with new_section
    const validData2 = {
      title: 'Valid Test Title',
      projectId: 456,
      new_section: 'New Section',
      squadId: 101,
      priorityId: 1,
      automationStatusId: 2,
      labelIds: [1, 2, 3]
    };
    
    // Valid case with new_squad
    const validData3 = {
      title: 'Valid Test Title',
      projectId: 456,
      sectionId: 789,
      new_squad: 'New Squad',
      priorityId: 1,
      automationStatusId: 2,
      labelIds: [1, 2, 3]
    };
    
    // Test valid schema scenarios
    expect(() => CreateTestRequestSchema.parse(validData1)).not.toThrow();
    expect(() => CreateTestRequestSchema.parse(validData2)).not.toThrow();
    expect(() => CreateTestRequestSchema.parse(validData3)).not.toThrow();
    
    // Test invalid schema scenarios
    
    // Missing both sectionId and new_section
    try {
      CreateTestRequestSchema.parse({
        title: 'Valid Test Title',
        projectId: 456,
        squadId: 101,
        priorityId: 1,
        automationStatusId: 2,
        labelIds: [1, 2, 3]
      });
      fail('Should have thrown an error for missing both sectionId and new_section');
    } catch (error: any) {
      expect(error.message).toContain('Select or add section');
    }
    
    // Both sectionId and new_section provided
    try {
      CreateTestRequestSchema.parse({
        title: 'Valid Test Title',
        projectId: 456,
        sectionId: 789,
        new_section: 'New Section',
        squadId: 101,
        priorityId: 1,
        automationStatusId: 2,
        labelIds: [1, 2, 3]
      });
      fail('Should have thrown an error for having both sectionId and new_section');
    } catch (error: any) {
      expect(error.message).toContain('Both sectionId and new_section cannot be provided');
    }
    
    // Both squadId and new_squad provided
    try {
      CreateTestRequestSchema.parse({
        title: 'Valid Test Title',
        projectId: 456,
        sectionId: 789,
        squadId: 101,
        new_squad: 'New Squad',
        priorityId: 1,
        automationStatusId: 2,
        labelIds: [1, 2, 3]
      });
      fail('Should have thrown an error for having both squadId and new_squad');
    } catch (error: any) {
      expect(error.message).toContain('Both squadId and New Squad cannot be provided');
    }
  });

  it('should successfully create a test with new_section instead of sectionId', async () => {
    const requestData = {
      title: 'New Test with new section',
      new_section: 'Brand New Section',
      squadId: 101,
      labelIds: [1, 2],
      projectId: 101,
      priorityId: 1,
      automationStatusId: 2
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

    expect(TestsController.createTest).toHaveBeenCalledWith({
      ...requestData,
      assignedTo: mockUser.userId,
      createdBy: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        testTitle: 'New Test with new section',
        testId: 456,
        testsAdded: 1,
        message: 'Test added successfully with title - New Test with new section',
      },
      status: 200,
    })
  });

  it('should successfully create a test with new_squad instead of squadId', async () => {
    const requestData = {
      title: 'New Test with new squad',
      sectionId: 789,
      new_squad: 'Brand New Squad',
      labelIds: [1, 2],
      projectId: 101,
      priorityId: 1,
      automationStatusId: 2
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

    expect(TestsController.createTest).toHaveBeenCalledWith({
      ...requestData,
      assignedTo: mockUser.userId,
      createdBy: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        testTitle: 'New Test with new squad',
        testId: 456,
        testsAdded: 1,
        message: 'Test added successfully with title - New Test with new squad',
      },
      status: 200,
    })
  });

  it('should create a test with both new_section and new_squad', async () => {
    const requestData = {
      title: 'New Test with new section and squad',
      new_section: 'Brand New Section',
      new_squad: 'Brand New Squad',
      labelIds: [1, 2],
      projectId: 101,
      priorityId: 1,
      automationStatusId: 2
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

    expect(TestsController.createTest).toHaveBeenCalledWith({
      ...requestData,
      assignedTo: mockUser.userId,
      createdBy: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        testTitle: 'New Test with new section and squad',
        testId: 456,
        testsAdded: 1,
        message: 'Test added successfully with title - New Test with new section and squad',
      },
      status: 200,
    })
  });
})
