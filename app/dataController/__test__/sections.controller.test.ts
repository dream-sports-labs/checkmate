import SectionsController from '@controllers/sections.controller'
import SectionsDao from '~/db/dao/sections.dao'

jest.mock('~/db/dao/sections.dao')

describe('SectionsController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllSections', () => {
    it('should call SectionsDao.getAllSections with the correct parameters', async () => {
      const mockParams = {projectId: 123}
      const mockResponse = [{sectionId: 1, sectionName: 'Section A'}]

      ;(SectionsDao.getAllSections as jest.Mock).mockResolvedValue(mockResponse)

      const result = await SectionsController.getAllSections(mockParams)

      expect(SectionsDao.getAllSections).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getSectionIdByNameAndHierarcy', () => {
    it('should call SectionsDao.getSectionIdByNameAndHierarcy with the correct parameters', async () => {
      const mockParams = {
        sectionName: 'Section A',
        parentId: null,
        projectId: 123,
      }
      const mockResponse = [{sectionId: 1}]

      ;(SectionsDao.getSectionIdByHierarcy as jest.Mock).mockResolvedValue(
        mockResponse,
      )

      const result = await SectionsController.getSectionIdByHierarcy(mockParams)

      expect(SectionsDao.getSectionIdByHierarcy).toHaveBeenCalledWith(
        mockParams,
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('addSection', () => {
    it('should call SectionsDao.addSection with the correct parameters', async () => {
      const mockParams = {
        sectionName: 'New Section',
        parentId: 12,
        projectId: 123,
        createdBy: 456,
        sectionDescription: 'Description',
      }
      const mockResponse = {sectionId: 1}

      ;(SectionsDao.addSection as jest.Mock).mockResolvedValue(mockResponse)

      const result = await SectionsController.addSection(mockParams)

      expect(SectionsDao.addSection).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('checkAndCreateSection', () => {
    it('should return an existing section if found', async () => {
      const mockParams = {
        sectionName: 'Existing Section',
        parentId: null,
        projectId: 123,
        createdBy: 456,
      }
      const mockResponse = [{sectionId: 1}]

      ;(SectionsDao.getSectionIdByHierarcy as jest.Mock).mockResolvedValue(
        mockResponse,
      )

      const result = await SectionsController.checkAndCreateSection(mockParams)

      expect(SectionsDao.getSectionIdByHierarcy).toHaveBeenCalledWith(
        mockParams,
      )
      expect(result).toEqual(mockResponse[0])
    })

    it('should create a new section if not found', async () => {
      const mockParams = {
        sectionName: 'New Section',
        parentId: null,
        projectId: 123,
        createdBy: 456,
      }
      const mockResponse = {sectionId: 2}

      ;(SectionsDao.getSectionIdByHierarcy as jest.Mock).mockResolvedValue([])
      ;(SectionsDao.addSection as jest.Mock).mockResolvedValue(mockResponse)

      const result = await SectionsController.checkAndCreateSection(mockParams)

      expect(SectionsDao.getSectionIdByHierarcy).toHaveBeenCalledWith(
        mockParams,
      )
      expect(SectionsDao.addSection).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('createSectionFromHierarchy', () => {
    it('should create a section hierarchy successfully', async () => {
      const mockParams = {
        sectionHierarchyString: 'Section A > Section B > Section C',
        projectId: 123,
        createdBy: 456,
        sectionDescription: 'Description',
      }

      // Mock responses for each level of the hierarchy
      const mockResponseA = {
        sectionId: 1,
        sectionName: 'Section A',
        projectId: 123,
        parentId: null,
      }
      const mockResponseB = {
        sectionId: 2,
        sectionName: 'Section B',
        projectId: 123,
        parentId: 1,
      }
      const mockResponseC = {
        sectionId: 3,
        sectionName: 'Section C',
        projectId: 123,
        parentId: 2,
      }

      // Mock the implementation to return different values for each call
      const checkAndCreateSectionMock = jest.spyOn(
        SectionsController,
        'checkAndCreateSection',
      )
      checkAndCreateSectionMock
        .mockResolvedValueOnce(mockResponseA)
        .mockResolvedValueOnce(mockResponseB)
        .mockResolvedValueOnce(mockResponseC)

      const result = await SectionsController.createSectionFromHierarchy(
        mockParams,
      )

      expect(checkAndCreateSectionMock).toHaveBeenCalledTimes(3)

      // Check first call
      expect(checkAndCreateSectionMock).toHaveBeenNthCalledWith(1, {
        sectionName: 'Section A',
        parentId: null,
        projectId: 123,
        createdBy: 456,
        sectionDescription: 'Description',
      })

      // Check second call
      expect(checkAndCreateSectionMock).toHaveBeenNthCalledWith(2, {
        sectionName: 'Section B',
        parentId: 1,
        projectId: 123,
        createdBy: 456,
        sectionDescription: 'Description',
      })

      // Check third call
      expect(checkAndCreateSectionMock).toHaveBeenNthCalledWith(3, {
        sectionName: 'Section C',
        parentId: 2,
        projectId: 123,
        createdBy: 456,
        sectionDescription: 'Description',
      })

      expect(result).toEqual(mockResponseC)
    })

    it('should throw an error when section hierarchy string contains empty section names', async () => {
      const mockParams = {
        sectionHierarchyString: 'Section A > > Section C',
        projectId: 123,
        createdBy: 456,
      }

      await expect(
        SectionsController.createSectionFromHierarchy(mockParams),
      ).rejects.toThrow(
        'Invalid section hierarchy string, empty section name found',
      )
    })

    it('should throw an error when section creation fails', async () => {
      const mockParams = {
        sectionHierarchyString: 'Section A > Section B > Section C',
        projectId: 123,
        createdBy: 456,
      }

      // Mock responses for each level of the hierarchy
      const mockResponseA = {
        sectionId: 1,
        sectionName: 'Section A',
        projectId: 123,
        parentId: null,
      }

      // Mock the implementation to return undefined for the second call
      const checkAndCreateSectionMock = jest.spyOn(
        SectionsController,
        'checkAndCreateSection',
      )
      checkAndCreateSectionMock
        .mockResolvedValueOnce(mockResponseA)
        .mockResolvedValueOnce(undefined)

      await expect(
        SectionsController.createSectionFromHierarchy(mockParams),
      ).rejects.toThrow('Error in creating section')
    })
  })

  describe('editSection', () => {
    it('should call SectionsDao.editSection with the correct parameters', async () => {
      const mockParams = {
        sectionId: 1,
        sectionName: 'Updated Section',
        userId: 456,
        projectId: 123,
        parentId: 2,
        sectionDescription: 'Updated Description',
      }
      const mockResponse = {affectedRows: 1}

      ;(SectionsDao.editSection as jest.Mock).mockResolvedValue(mockResponse)

      const result = await SectionsController.editSection(mockParams)

      expect(SectionsDao.editSection).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })
  })
})
