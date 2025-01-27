import {loader} from '~/routes/api/v1/projectData'
import ProjectsController from '~/dataController/projects.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForProjectId} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'

jest.mock('~/dataController/projects.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Get Project Detail - Loader Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully fetch project details for a valid projectId', async () => {
    const request = new Request('http://localhost?projectId=123', {
      method: 'GET',
    })
    const mockProjectData = {
      projectId: 123,
      projectName: 'Test Project',
      projectStatus: 'Active',
    }

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForProjectId as jest.Mock).mockReturnValue(true)
    ;(ProjectsController.getProjectInfo as jest.Mock).mockResolvedValue(
      mockProjectData,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await loader({request, params: {}} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetProjectDetail,
    })
    expect(checkForProjectId).toHaveBeenCalledWith(123)
    expect(ProjectsController.getProjectInfo).toHaveBeenCalledWith(123)
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockProjectData,
      status: 200,
    })
  })

  it('should return an error if projectId is missing', async () => {
    const request = new Request('http://localhost', {method: 'GET'})

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForProjectId as jest.Mock).mockReturnValue(false)
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: data.status}),
    )

    const response = (await loader({request, params: {}} as any)) as Response

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetProjectDetail,
    })
    expect(checkForProjectId).toHaveBeenCalledWith(0)
    expect(response).toBeInstanceOf(Response)
    expect(response.status).toBe(400)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Params projectId not provided',
      status: 400,
    })
  })

  it('should return an error for an invalid projectId', async () => {
    const request = new Request('http://localhost?projectId=invalid', {
      method: 'GET',
    })

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForProjectId as jest.Mock).mockReturnValue(false)
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: 400}),
    )

    const response = (await loader({request, params: {}} as any)) as Response

    expect(checkForProjectId).toHaveBeenCalledWith(NaN)
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Invalid params projectId',
      status: 400,
    })
    expect(response.status).toBe(400)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Invalid params projectId',
      status: 400,
    })
  })

  it('should handle unexpected errors', async () => {
    const request = new Request('http://localhost?projectId=123', {
      method: 'GET',
    })
    const mockError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 500}),
    )

    const response = await loader({request, params: {}} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetProjectDetail,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Unexpected error',
    })
  })
})
