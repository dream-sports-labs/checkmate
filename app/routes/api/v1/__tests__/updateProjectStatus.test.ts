import {action} from '~/routes/api/v1/updateProjectStatus'
import ProjectsController from '@controllers/projects.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {responseHandler} from '~/routes/utilities/responseHandler'
import {
  getRequestParams,
  sqlErroMessage,
  zodErrorMessage,
} from '~/routes/utilities/utils'
import {SqlError} from '@services/ErrorTypes'
import {z} from 'zod'
import {API} from '~/routes/utilities/api'

jest.mock('@controllers/projects.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Update Project Status - Action Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully update the project status for valid input', async () => {
    const requestData = {
      projectId: 123,
      status: 'Archived',
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 456}
    const mockResponse = [{affectedRows: 1}]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(ProjectsController.updateProjectStatus as jest.Mock).mockResolvedValue(
      mockResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.EditProjectStatus,
    })
    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(ProjectsController.updateProjectStatus).toHaveBeenCalledWith({
      ...requestData,
      userId: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {message: 'Project Archived'},
      status: 200,
    })
  })

  it('should handle Zod validation errors', async () => {
    const invalidRequestData = {
      projectId: -1, // Invalid projectId
      status: 'InvalidStatus', // Invalid status
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(invalidRequestData),
    })
    const mockZodError = new z.ZodError([
      {path: ['projectId'], message: 'Invalid projectId', code: 'custom'},
      {path: ['status'], message: 'Invalid status', code: 'custom'},
    ])

    ;(getRequestParams as jest.Mock).mockRejectedValue(mockZodError)
    ;(zodErrorMessage as jest.Mock).mockReturnValue(
      'Validation error: Invalid input',
    )
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: 400}),
    )

    const response = await action({request} as any)

    expect(getRequestParams).toHaveBeenCalledWith(request, expect.any(Object))
    expect(zodErrorMessage).toHaveBeenCalledWith(mockZodError)
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Validation error: Invalid input',
      status: 400,
    })
    expect(response.status).toBe(400)
  })

  it('should handle SQL errors', async () => {
    const requestData = {
      projectId: 123,
      status: 'Deleted',
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockSqlError = new SqlError('SQL error occurred')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue({userId: 456})
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(ProjectsController.updateProjectStatus as jest.Mock).mockRejectedValue(
      mockSqlError,
    )
    ;(sqlErroMessage as jest.Mock).mockReturnValue('Database error occurred')
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: 500}),
    )

    const response = await action({request} as any)

    expect(ProjectsController.updateProjectStatus).toHaveBeenCalledWith({
      ...requestData,
      userId: 456,
    })
    expect(sqlErroMessage).toHaveBeenCalledWith(mockSqlError)
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Database error occurred',
      status: 500,
    })
    expect(response.status).toBe(500)
  })

  it('should handle unexpected errors', async () => {
    const requestData = {
      projectId: 123,
      status: 'Active',
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(responseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 500}),
    )

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.EditProjectStatus,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Unexpected error',
      status: 500,
    })
  })

  it('should handle case where no project is affected', async () => {
    const requestData = {
      projectId: 123,
      status: 'Archived',
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockUser = {userId: 456}
    const mockResponse = [{affectedRows: 0}] // No rows affected

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(ProjectsController.updateProjectStatus as jest.Mock).mockResolvedValue(
      mockResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: 500}),
    )

    const response = await action({request} as any)

    expect(ProjectsController.updateProjectStatus).toHaveBeenCalledWith({
      ...requestData,
      userId: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'No Project Deleted',
      status: 500,
    })
  })

  it('should handle undefined user', async () => {
    const requestData = {
      projectId: 123,
      status: 'Active',
    }
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })
    const mockResponse = [{affectedRows: 1}]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(undefined)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(ProjectsController.updateProjectStatus as jest.Mock).mockResolvedValue(
      mockResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(ProjectsController.updateProjectStatus).toHaveBeenCalledWith({
      ...requestData,
      userId: 0, // Should use 0 as a fallback for undefined user
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {message: 'Project Active'},
      status: 200,
    })
  })
})
