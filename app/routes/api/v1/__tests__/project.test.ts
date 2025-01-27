import {loader} from '~/routes/api/v1/projects'
import ProjectsController from '~/dataController/projects.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  responseHandler,
  errorResponseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForValidId} from '~/routes/utilities/utils'
import {API} from '~/routes/utilities/api'

jest.mock('~/dataController/projects.controller')
jest.mock('~/routes/utilities/responseHandler')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')

describe('Get Projects - Loader Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully fetch projects for valid parameters', async () => {
    const request = new Request(
      'http://localhost?orgId=123&page=1&pageSize=10&textSearch=example',
      {method: 'GET'},
    )
    const mockProjectsData = {
      projects: [
        {
          projectId: 1,
          projectName: 'Project A',
          createdOn: '2023-01-01',
          createdBy: 'User A',
          orgId: 123,
        },
        {
          projectId: 2,
          projectName: 'Project B',
          createdOn: '2023-01-02',
          createdBy: 'User B',
          orgId: 123,
        },
      ],
      org: {
        orgId: 123,
        orgName: 'Organization A',
        createdBy: 456,
        createdOn: '2023-01-01',
      },
    }

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForValidId as jest.Mock).mockReturnValue(true)
    ;(ProjectsController.getAllProjects as jest.Mock).mockResolvedValue(
      mockProjectsData,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await loader({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetProjects,
    })
    expect(checkForValidId).toHaveBeenCalledWith(123)
    expect(ProjectsController.getAllProjects).toHaveBeenCalledWith({
      orgId: 123,
      page: 1,
      pageSize: 10,
      textSearch: 'example',
      projectDescription: undefined,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: mockProjectsData,
      status: 200,
    })
  })

  it('should return an error if orgId is invalid', async () => {
    const request = new Request('http://localhost?orgId=invalid', {
      method: 'GET',
    })

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(checkForValidId as jest.Mock).mockReturnValue(false)
    ;(responseHandler as jest.Mock).mockImplementation(
      (data) => new Response(JSON.stringify(data), {status: 400}),
    )

    const response = (await loader({request} as any)) as Response

    expect(checkForValidId).toHaveBeenCalledWith(NaN)
    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Invalid param orgId',
      status: 400,
    })
    expect(response.status).toBe(400)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Invalid param orgId',
      status: 400,
    })
  })

  it('should throw an error for invalid page or pageSize', async () => {
    const request = new Request(
      'http://localhost?orgId=123&page=0&pageSize=-1',
      {
        method: 'GET',
      },
    )

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(true)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 400}),
    )

    const response = await loader({request} as any)

    expect(errorResponseHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Invalid page or pageSize, provide valid entry',
      }),
    )
    expect(response.status).toBe(400)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Invalid page or pageSize, provide valid entry',
    })
  })

  it('should handle unexpected errors', async () => {
    const request = new Request(
      'http://localhost?orgId=123&page=1&pageSize=10',
      {
        method: 'GET',
      },
    )
    const mockError = new Error('Unexpected error')

    ;(getUserAndCheckAccess as jest.Mock).mockRejectedValue(mockError)
    ;(errorResponseHandler as jest.Mock).mockImplementation(
      (error) =>
        new Response(JSON.stringify({error: error.message}), {status: 500}),
    )

    const response = await loader({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.GetProjects,
    })
    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
    expect(response.status).toBe(500)
    const responseData = await response.json()
    expect(responseData).toEqual({
      error: 'Unexpected error',
    })
  })
})
