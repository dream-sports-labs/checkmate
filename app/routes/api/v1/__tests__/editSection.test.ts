import SectionsController from '@controllers/sections.controller'
import {CHILD_SECTION} from '~/constants'
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

  it('should successfully update a section when affectedRows is 1 and no parentId is provided', async () => {
    const requestData = {
      sectionId: 1,
      projectId: 2,
      sectionDescription: 'Updated description',
      sectionName: 'Updated Section',
      // no parentId provided
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
    ]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    // In this branch, getAllSections is not called because parentId is not provided.
    ;(SectionsController.editSection as jest.Mock).mockResolvedValue(
      mockResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((res) => res)

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

  it('should successfully update a section when affectedRows is 1 and a valid parentId is provided', async () => {
    const requestData = {
      sectionId: 10,
      projectId: 2,
      sectionDescription: 'Updated description',
      sectionName: 'Updated Section',
      parentId: 5,
    }

    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })

    const mockUser = {userId: 123}
    // Simulate getAllSections returning a sections array that, when filtered via removeSectionAndDescendants,
    // DOES include the provided parentId (i.e. section 5 is a valid parent).
    const allSections = [
      {
        sectionId: 10,
        sectionName: 'Updated Section',
        projectId: 2,
        parentId: null,
      },
      {
        sectionId: 5,
        sectionName: 'Voting System',
        projectId: 2,
        parentId: null,
      },
      {
        sectionId: 11,
        sectionName: 'Comment System',
        projectId: 2,
        parentId: 10,
      },
    ]

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
    ]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(SectionsController.getAllSections as jest.Mock).mockResolvedValue(
      allSections,
    )
    ;(SectionsController.editSection as jest.Mock).mockResolvedValue(
      mockResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((res) => res)

    const response = await action({request} as any)

    // The getAllSections call should occur when parentId is provided.
    expect(SectionsController.getAllSections).toHaveBeenCalledWith(requestData)

    // Because removeSectionAndDescendants would filter out descendants of sectionId 10,
    // and section 5 is not a descendant of 10 in our mocked array, the parentId is valid.
    expect(SectionsController.editSection).toHaveBeenCalledWith({
      ...requestData,
      userId: 123,
    })
    expect(responseHandler).toHaveBeenCalledWith({
      data: 'Section Updated',
      status: 200,
    })
  })

  it('should return error if provided parentId is invalid (section is parent of itself or its descendant)', async () => {
    const requestData = {
      sectionId: 2,
      projectId: 2,
      sectionDescription: 'Updated description',
      sectionName: 'Updated Section',
      parentId: 3, // Suppose section 3 is a descendant of section 2
    }

    const request = new Request('http://localhost', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(requestData),
    })

    const mockUser = {userId: 123}
    // Simulate getAllSections returning a sections array where section 3 is a descendant of section 2.
    // For instance, if section 2 is the parent of section 3, then removeSectionAndDescendants({sectionId: 2, sectionsData}) will remove section 3.
    const allSections = [
      {
        sectionId: 2,
        sectionName: 'User Management',
        projectId: 2,
        parentId: null,
      },
      {sectionId: 3, sectionName: 'Posting', projectId: 2, parentId: 2},
      {
        sectionId: 4,
        sectionName: 'Answer Submission',
        projectId: 2,
        parentId: 3,
      },
    ]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(SectionsController.getAllSections as jest.Mock).mockResolvedValue(
      allSections,
    )
    ;(responseHandler as jest.Mock).mockImplementation((res) => res)

    const response = await action({request} as any)

    // In this case, after filtering out descendants from section 2,
    // the valid parent sections will NOT include section 3.
    expect(SectionsController.getAllSections).toHaveBeenCalledWith(requestData)
    expect(responseHandler).toHaveBeenCalledWith({
      error: CHILD_SECTION,
      status: 400,
    })
  })

  it('should return "Failed to update section" if affectedRows is 0', async () => {
    const requestData = {
      sectionId: 1,
      projectId: 2,
      sectionDescription: 'Updated description',
      sectionName: 'Updated Section',
      // no parentId provided
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
    ]

    ;(getUserAndCheckAccess as jest.Mock).mockResolvedValue(mockUser)
    ;(getRequestParams as jest.Mock).mockResolvedValue(requestData)
    ;(SectionsController.editSection as jest.Mock).mockResolvedValue(
      mockResponse,
    )
    ;(responseHandler as jest.Mock).mockImplementation((res) => res)

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

    ;(responseHandler as jest.Mock).mockImplementation((res) => res)

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
