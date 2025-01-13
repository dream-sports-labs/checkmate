import {action} from '../../v1/createProjects'
import {z} from 'zod'
import {ActionFunctionArgs} from '@remix-run/node'
import {SqlError} from '@services/ErrorTypes'
import ProjectsController from '~/dataController/projects.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '../../../utilities/utils'

jest.mock('../../../utilities/utils')
jest.mock('~/dataController/projects.controller')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/responseHandler')

describe('createProject action', () => {
  const mockRequest = {
    json: jest.fn(),
  } as unknown as Request

  const mockArgs = {
    request: mockRequest,
  } as ActionFunctionArgs

  const mockUser = {userId: 1}

  const mockData = {
    projectName: 'New Project',
    orgId: 1,
  }

  const mockProjectsData = [
    {
      insertId: 123,
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a project and return a successful response', async () => {
    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(mockData)
    ;(ProjectsController.createProject as jest.Mock).mockResolvedValue(
      mockProjectsData,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const result = await action(mockArgs)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request: mockRequest,
      resource: 'api/v1/project/create',
    })
    expect(getRequestParams).toHaveBeenCalledWith(
      mockRequest,
      expect.any(z.ZodObject),
    )
    expect(ProjectsController.createProject).toHaveBeenCalledWith({
      ...mockData,
      createdBy: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        projectName: mockData.projectName,
        projectId: mockProjectsData[0].insertId,
        message: `${mockData.projectName} new project added successfuly.`,
      },
      status: 200,
    })
    expect(result).toEqual({
      data: {
        projectName: mockData.projectName,
        projectId: mockProjectsData[0].insertId,
        message: `${mockData.projectName} new project added successfuly.`,
      },
      status: 200,
    })
  })

  it('should return 400 for validation errors', async () => {
    const zodError = new z.ZodError([
      {
        path: ['projectName'],
        message: 'Invalid project name',
        code: 'custom',
      },
    ])

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockRejectedValue(zodError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (response) => response,
    )

    const result = await action(mockArgs)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request: mockRequest,
      resource: 'api/v1/project/create',
    })
    expect(getRequestParams).toHaveBeenCalledWith(
      mockRequest,
      expect.any(z.ZodObject),
    )
    expect(ProjectsController.createProject).not.toHaveBeenCalled()
    expect(errorResponseHandler).toHaveBeenCalledWith(zodError)
    expect(result).toEqual(zodError)
  })

  it('should return 500 for SQL errors', async () => {
    const sqlError = new SqlError('SQL error occurred')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(mockData)
    ;(ProjectsController.createProject as jest.Mock).mockRejectedValue(sqlError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (response) => response,
    )
    const result = await action(mockArgs)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request: mockRequest,
      resource: 'api/v1/project/create',
    })
    expect(getRequestParams).toHaveBeenCalledWith(
      mockRequest,
      expect.any(z.ZodObject),
    )
    expect(ProjectsController.createProject).toHaveBeenCalledWith({
      ...mockData,
      createdBy: mockUser.userId,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(sqlError)
    expect(result).toEqual(sqlError)
  })

  it('should return 500 for unexpected errors', async () => {
    const unexpectedError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(mockData)
    ;(ProjectsController.createProject as jest.Mock).mockRejectedValue(
      unexpectedError,
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (response) => response,
    )
    const result = await action(mockArgs)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request: mockRequest,
      resource: 'api/v1/project/create',
    })
    expect(getRequestParams).toHaveBeenCalledWith(
      mockRequest,
      expect.any(z.ZodObject),
    )
    expect(ProjectsController.createProject).toHaveBeenCalledWith({
      ...mockData,
      createdBy: mockUser.userId,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(unexpectedError)
    expect(result).toEqual(unexpectedError)
  })
})
