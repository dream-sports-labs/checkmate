import RunsController from '@controllers/runs.controller'
import {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '../../../utilities/utils'
import {action} from '../createRun'

jest.mock('@controllers/runs.controller')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('../../../utilities/utils')

describe('createRun action', () => {
  const mockRequest = {
    json: jest.fn(),
  } as unknown as Request

  const mockArgs = {
    request: mockRequest,
  } as ActionFunctionArgs

  const mockUser = {userId: 1}

  const mockData = {
    projectId: 123,
    runName: 'Sample Run',
    runDescription: 'This is a sample run',
    labelIds: [1, 2, 3],
    squadIds: [4, 5],
    sectionIds: [6],
    filterType: 'or',
  }

  const mockRunsData = {
    runId: 456,
    runsAdded: 20,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a run and return a successful response', async () => {
    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(mockData)
    ;(RunsController.createRun as jest.Mock).mockResolvedValue(mockRunsData)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const result = await action(mockArgs)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request: mockRequest,
      resource: 'api/v1/run/create',
    })
    expect(getRequestParams).toHaveBeenCalledWith(
      mockRequest,
      expect.any(z.ZodObject),
    )
    expect(RunsController.createRun).toHaveBeenCalledWith({
      ...mockData,
      filterType: 'or',
      createdBy: mockUser.userId,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        runName: mockData.runName,
        runId: mockRunsData.runId,
        testsAdded: mockRunsData.runsAdded,
        message: `Added ${mockRunsData.runsAdded} tests to run ${mockData.runName}`,
      },
      status: 200,
    })
    expect(result).toEqual({
      data: {
        runName: mockData.runName,
        runId: mockRunsData.runId,
        testsAdded: mockRunsData.runsAdded,
        message: `Added ${mockRunsData.runsAdded} tests to run ${mockData.runName}`,
      },
      status: 200,
    })
  })

  it('should return 400 for validation errors', async () => {
    const zodError = new z.ZodError([
      {
        path: ['runName'],
        message: 'Run name is invalid',
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
      resource: 'api/v1/run/create',
    })
    expect(getRequestParams).toHaveBeenCalledWith(
      mockRequest,
      expect.any(z.ZodObject),
    )
    expect(RunsController.createRun).not.toHaveBeenCalled()
    expect(errorResponseHandler).toHaveBeenCalledWith(zodError)
    expect(result).toEqual(zodError)
  })

  it('should return 500 for unexpected errors', async () => {
    const unexpectedError = new Error('Unexpected error occurred')

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(mockData)
    ;(RunsController.createRun as jest.Mock).mockRejectedValue(unexpectedError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (response) => response,
    )
    const result = await action(mockArgs)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request: mockRequest,
      resource: 'api/v1/run/create',
    })
    expect(getRequestParams).toHaveBeenCalledWith(
      mockRequest,
      expect.any(z.ZodObject),
    )
    expect(RunsController.createRun).toHaveBeenCalledWith({
      ...mockData,
      filterType: 'or',
      createdBy: mockUser.userId,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(unexpectedError)
    expect(result).toEqual(unexpectedError)
  })

  it('should default filterType to "and" if invalid or missing', async () => {
    const dataWithInvalidFilterType = {
      ...mockData,
      filterType: 'invalid',
    }

    const expectedData = {
      ...mockData,
      filterType: 'and',
      createdBy: mockUser.userId,
    }

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(
      dataWithInvalidFilterType,
    )
    ;(RunsController.createRun as jest.Mock).mockResolvedValue(mockRunsData)
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const result = await action(mockArgs)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request: mockRequest,
      resource: 'api/v1/run/create',
    })
    expect(getRequestParams).toHaveBeenCalledWith(
      mockRequest,
      expect.any(z.ZodObject),
    )
    expect(RunsController.createRun).toHaveBeenCalledWith(expectedData)
    expect(responseHandler).toHaveBeenCalledWith({
      data: {
        runName: mockData.runName,
        runId: mockRunsData.runId,
        testsAdded: mockRunsData.runsAdded,
        message: `Added ${mockRunsData.runsAdded} tests to run ${mockData.runName}`,
      },
      status: 200,
    })
    expect(result).toEqual({
      data: {
        runName: mockData.runName,
        runId: mockRunsData.runId,
        testsAdded: mockRunsData.runsAdded,
        message: `Added ${mockRunsData.runsAdded} tests to run ${mockData.runName}`,
      },
      status: 200,
    })
  })
})
