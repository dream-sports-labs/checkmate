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
})
