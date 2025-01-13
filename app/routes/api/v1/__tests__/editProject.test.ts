import ProjectsController from '@controllers/projects.controller'
import {ActionFunctionArgs} from '@remix-run/node'
import {SqlError} from '@services/ErrorTypes'
import {z} from 'zod'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '../../../utilities/utils'
import {action} from '../editProject'

jest.mock('../../../utilities/utils')
jest.mock('@controllers/projects.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')

describe('editProject action', () => {
  const mockRequest = {
    json: jest.fn(),
  } as unknown as Request

  const mockArgs = {
    request: mockRequest,
    params: {},
  } as ActionFunctionArgs

  const mockData = {
    projectId: 1,
    projectName: 'Updated Project',
    projectDescription: 'Updated project description',
  }

  const mockUpdatedProjectResponse = {
    affectedRows: 1,
  }

  const mockUser = {userId: 1}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should update a project and return a successful response', async () => {
    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(mockData)
    ;(ProjectsController.editProject as jest.Mock).mockResolvedValue(
      mockUpdatedProjectResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const result = await action(mockArgs)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request: mockRequest,
      resource: API.EditProject,
    })
    expect(getRequestParams).toHaveBeenCalledWith(
      mockRequest,
      expect.any(z.ZodObject),
    )
    expect(ProjectsController.editProject).toHaveBeenCalledWith({
      ...mockData,
      userId: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        projectName: mockData.projectName,
        message: `${mockData.projectName} project updated successfully.`,
      },
      status: 201,
    })

    expect(result).toEqual({
      data: {
        projectName: mockData.projectName,
        message: `${mockData.projectName} project updated successfully.`,
      },
      status: 201,
    })
  })

  it('should return 400 for validation errors', async () => {
    const validationError = new z.ZodError([
      {
        path: ['projectName'],
        message: 'Invalid project name',
        code: 'custom',
      },
    ])

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockRejectedValue(validationError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (response) => response,
    )

    const result = await action(mockArgs)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request: mockRequest,
      resource: API.EditProject,
    })
    expect(getRequestParams).toHaveBeenCalledWith(
      mockRequest,
      expect.any(z.ZodObject),
    )

    expect(ProjectsController.editProject).not.toHaveBeenCalled()
    expect(errorResponseHandler).toHaveBeenCalledWith(validationError)

    expect(result).toEqual(validationError)
  })

  it('should return 500 for SQL errors', async () => {
    const sqlError = new SqlError('SQL error occurred')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(mockData)
    ;(ProjectsController.editProject as jest.Mock).mockRejectedValue(sqlError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (response) => response,
    )
    const result = await action(mockArgs)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request: mockRequest,
      resource: 'api/v1/project/edit',
    })
    expect(getRequestParams).toHaveBeenCalledWith(
      mockRequest,
      expect.any(z.ZodObject),
    )
    expect(ProjectsController.editProject).toHaveBeenCalledWith({
      ...mockData,
      userId: mockUser.userId,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(sqlError)

    expect(result).toEqual(sqlError)
  })

  it('should return 500 for unexpected errors', async () => {
    const unexpectedError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(mockData)
    ;(ProjectsController.editProject as jest.Mock).mockRejectedValue(
      unexpectedError,
    )
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (response) => response,
    )

    const result = await action(mockArgs)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request: mockRequest,
      resource: 'api/v1/project/edit',
    })
    expect(getRequestParams).toHaveBeenCalledWith(
      mockRequest,
      expect.any(z.ZodObject),
    )
    expect(ProjectsController.editProject).toHaveBeenCalledWith({
      ...mockData,
      userId: mockUser.userId,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(unexpectedError)

    expect(result).toEqual(unexpectedError)
  })
})
