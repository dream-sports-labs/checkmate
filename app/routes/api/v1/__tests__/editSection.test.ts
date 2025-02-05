import SectionsController from '@controllers/sections.controller'
import {action} from '~/routes/api/v1/editSection'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '~/routes/utilities/utils'

jest.mock('@controllers/sections.controller')
jest.mock('~/routes/utilities/checkForUserAndAccess')
jest.mock('~/routes/utilities/utils')
jest.mock('~/routes/utilities/responseHandler')

describe('Edit Section - Action Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully update a section when affectedRows is 1', async () => {
    const requestData = {
      sectionId: 1,
      projectId: 2,
      sectionDescription: 'Updated description',
      sectionName: 'Updated Section',
    }

    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })

    const mockUser = {userId: 123}
    const mockResponse = [
      {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: 'Rows matched: 1  Changed: 0  Warnings: 0',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0,
      },
      undefined,
    ] // Simulating MySQL update response

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(SectionsController.editSection as jest.Mock).mockResolvedValue(
      mockResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(getUserAndCheckAccess).toHaveBeenCalledWith({
      request,
      resource: API.EditSection,
    })

    expect(SectionsController.editSection).toHaveBeenCalledWith({
      ...requestData,
      userId: 123,
    })

    expect(responseHandler).toHaveBeenCalledWith({
      data: 'Section Updated',
      status: 200,
    })
  })

  it('should return "Failed to update section" if affectedRows is 0', async () => {
    const requestData = {
      sectionId: 1,
      projectId: 2,
      sectionDescription: 'Updated description',
      sectionName: 'Updated Section',
    }

    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })

    const mockUser = {userId: 123}
    const mockResponse = [
      {
        fieldCount: 0,
        affectedRows: 0,
        insertId: 0,
        info: 'Rows matched: 0  Changed: 0  Warnings: 0',
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0,
      },
      undefined,
    ] // Simulating MySQL update failure (no rows affected)

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(SectionsController.editSection as jest.Mock).mockResolvedValue(
      mockResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(SectionsController.editSection).toHaveBeenCalledWith({
      ...requestData,
      userId: 123,
    })

    expect(responseHandler).toHaveBeenCalledWith({
      data: 'Failed to update section',
      status: 200,
    })
  })

  it('should return 400 if content-type is not application/json', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'text/plain'},
    })

    ;(responseHandler as jest.Mock).mockImplementation((response) => response)

    const response = await action({request} as any)

    expect(responseHandler).toHaveBeenCalledWith({
      error: 'Invalid content type, expected application/json',
      status: 400,
    })
  })

  it('should handle unexpected errors', async () => {
    const requestData = {
      sectionId: 1,
      projectId: 2,
      sectionDescription: 'Updated description',
      sectionName: 'Updated Section',
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

    expect(errorResponseHandler).toHaveBeenCalledWith(mockError)
  })
})
