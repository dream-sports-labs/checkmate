import TestsController from '~/dataController/tests.controller'
import TestsDao from '~/db/dao/test.dao'
import SectionsDao from '~/db/dao/sections.dao'
import SquadsDao from '~/db/dao/squads.dao'
import PriorityDao from '~/db/dao/priority.dao'
import AutomationStatusDao from '~/db/dao/automationStatus.dao'
import PlatformDao from '~/db/dao/platform.dao'
import TestCoveredByDao from '~/db/dao/testCoveredBy.dao'
import SectionsController from '~/dataController/sections.controller'
import SquadsController from '~/dataController/squads.controller'
import * as utils from '../utils'

jest.mock('~/db/dao/test.dao')
jest.mock('~/db/dao/sections.dao')
jest.mock('~/db/dao/squads.dao')
jest.mock('~/db/dao/priority.dao')
jest.mock('~/db/dao/automationStatus.dao')
jest.mock('~/db/dao/platform.dao')
jest.mock('~/db/dao/testCoveredBy.dao')
jest.mock('~/dataController/sections.controller')
jest.mock('~/dataController/squads.controller')
jest.mock('../utils')

describe('Tests Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getTests', () => {
    it('should get tests and count', async () => {
      const mockTestData = [{id: 1, name: 'Test 1'}]
      const mockCount = 1

      ;(TestsDao.getTests as jest.Mock).mockResolvedValue(mockTestData)
      ;(TestsDao.getTestsCount as jest.Mock).mockResolvedValue(mockCount)

      const params = {
        projectId: 1,
        page: 1,
        pageSize: 10,
      }

      const result = await TestsController.getTests(params)

      expect(TestsDao.getTests).toHaveBeenCalledWith(params)
      expect(TestsDao.getTestsCount).toHaveBeenCalledWith(params)
      expect(result).toEqual({
        testData: mockTestData,
        count: mockCount,
      })
    })
  })

  describe('getTestsCount', () => {
    it('should get tests count', async () => {
      const mockCount = 5

      ;(TestsDao.getTestsCount as jest.Mock).mockResolvedValue(mockCount)

      const params = {
        projectId: 1,
      }

      const result = await TestsController.getTestsCount(params)

      expect(TestsDao.getTestsCount).toHaveBeenCalledWith(params)
      expect(result).toBe(mockCount)
    })
  })

  describe('createTest', () => {
    it('should create a test without new section or squad', async () => {
      const params = {
        projectId: 1,
        title: 'Test Title',
        sectionId: 1,
        squadId: 2,
        createdBy: 100,
        assignedTo: 200,
        labelIds: [],
        priorityId: 1,
        automationStatusId: 1,
        platformId: 1,
      }

      const mockResult = {testId: 123}

      ;(utils.handleNewSectionAndSquad as jest.Mock).mockResolvedValue({})
      ;(TestsDao.createTest as jest.Mock).mockResolvedValue(mockResult)

      const result = await TestsController.createTest(params)

      expect(utils.handleNewSectionAndSquad).toHaveBeenCalledWith(params)
      expect(TestsDao.createTest).toHaveBeenCalledWith(params)
      expect(result).toBe(mockResult)
    })

    it('should create a test with new section', async () => {
      const params = {
        projectId: 1,
        title: 'Test Title',
        new_section: 'New Section',
        squadId: 2,
        createdBy: 100,
        assignedTo: 200,
        labelIds: [],
        priorityId: 1,
        automationStatusId: 1,
        platformId: 1,
      }

      const mockNewSectionResult = {
        newSection: {sectionId: 456, name: 'New Section'},
      }

      const mockCreateTestResult = {testId: 123}

      ;(utils.handleNewSectionAndSquad as jest.Mock).mockResolvedValue(
        mockNewSectionResult,
      )
      ;(TestsDao.createTest as jest.Mock).mockResolvedValue(
        mockCreateTestResult,
      )

      const result = await TestsController.createTest(params)

      const expectedParams = {
        ...params,
        sectionId: 456,
      }

      expect(utils.handleNewSectionAndSquad).toHaveBeenCalledWith(params)
      expect(TestsDao.createTest).toHaveBeenCalledWith(expectedParams)
      expect(result).toBe(mockCreateTestResult)
    })

    it('should create a test with new squad', async () => {
      const params = {
        projectId: 1,
        title: 'Test Title',
        sectionId: 1,
        new_squad: 'New Squad',
        createdBy: 100,
        assignedTo: 200,
        labelIds: [],
        priorityId: 1,
        automationStatusId: 1,
        platformId: 1,
      }

      const mockNewSquadResult = {
        newSquad: {squadId: 789, name: 'New Squad'},
      }

      const mockCreateTestResult = {testId: 123}

      ;(utils.handleNewSectionAndSquad as jest.Mock).mockResolvedValue(
        mockNewSquadResult,
      )
      ;(TestsDao.createTest as jest.Mock).mockResolvedValue(
        mockCreateTestResult,
      )

      const result = await TestsController.createTest(params)

      const expectedParams = {
        ...params,
        squadId: 789,
      }

      expect(utils.handleNewSectionAndSquad).toHaveBeenCalledWith(params)
      expect(TestsDao.createTest).toHaveBeenCalledWith(expectedParams)
      expect(result).toBe(mockCreateTestResult)
    })
  })

  describe('deleteTest', () => {
    it('should delete a test', async () => {
      const params = {
        testId: 123,
        userId: 100,
      }

      const mockResult = {affectedRows: 1}

      ;(TestsDao.deleteTest as jest.Mock).mockResolvedValue(mockResult)

      const result = await TestsController.deleteTest(params)

      expect(TestsDao.deleteTest).toHaveBeenCalledWith(params)
      expect(result).toBe(mockResult)
    })
  })

  describe('updateTest', () => {
    it('should update a test without new section or squad', async () => {
      const params = {
        testId: 123,
        projectId: 1,
        title: 'Updated Title',
        sectionId: 1,
        squadId: 2,
        updatedBy: 100,
        labelIds: [],
        priorityId: 1,
        automationStatusId: 1,
        platformId: 1,
      }

      const mockResult = {affectedRows: 1}

      ;(utils.handleNewSectionAndSquad as jest.Mock).mockResolvedValue({})
      ;(TestsDao.updateTest as jest.Mock).mockResolvedValue(mockResult)

      const result = await TestsController.updateTest(params)

      expect(utils.handleNewSectionAndSquad).toHaveBeenCalledWith({
        new_section: undefined,
        new_squad: undefined,
        projectId: params.projectId,
        createdBy: params.updatedBy,
      })
      expect(TestsDao.updateTest).toHaveBeenCalledWith(params)
      expect(result).toBe(mockResult)
    })

    it('should update a test with new section', async () => {
      const params = {
        testId: 123,
        projectId: 1,
        title: 'Updated Title',
        new_section: 'New Section',
        squadId: 2,
        updatedBy: 100,
        labelIds: [],
        priorityId: 1,
        automationStatusId: 1,
        platformId: 1,
      }

      const mockNewSectionResult = {
        newSection: {sectionId: 456, name: 'New Section'},
      }

      const mockUpdateTestResult = {affectedRows: 1}

      ;(utils.handleNewSectionAndSquad as jest.Mock).mockResolvedValue(
        mockNewSectionResult,
      )
      ;(TestsDao.updateTest as jest.Mock).mockResolvedValue(
        mockUpdateTestResult,
      )

      const result = await TestsController.updateTest(params)

      const expectedParams = {
        ...params,
        sectionId: 456,
      }

      expect(utils.handleNewSectionAndSquad).toHaveBeenCalledWith({
        new_section: params.new_section,
        new_squad: undefined,
        projectId: params.projectId,
        createdBy: params.updatedBy,
      })
      expect(TestsDao.updateTest).toHaveBeenCalledWith(expectedParams)
      expect(result).toBe(mockUpdateTestResult)
    })

    it('should update a test with new squad', async () => {
      const params = {
        testId: 123,
        projectId: 1,
        title: 'Updated Title',
        sectionId: 1,
        new_squad: 'New Squad',
        updatedBy: 100,
        labelIds: [],
        priorityId: 1,
        automationStatusId: 1,
        platformId: 1,
      }

      const mockNewSquadResult = {
        newSquad: {squadId: 789, name: 'New Squad'},
      }

      const mockUpdateTestResult = {affectedRows: 1}

      ;(utils.handleNewSectionAndSquad as jest.Mock).mockResolvedValue(
        mockNewSquadResult,
      )
      ;(TestsDao.updateTest as jest.Mock).mockResolvedValue(
        mockUpdateTestResult,
      )

      const result = await TestsController.updateTest(params)

      const expectedParams = {
        ...params,
        squadId: 789,
      }

      expect(utils.handleNewSectionAndSquad).toHaveBeenCalledWith({
        new_section: undefined,
        new_squad: params.new_squad,
        projectId: params.projectId,
        createdBy: params.updatedBy,
      })
      expect(TestsDao.updateTest).toHaveBeenCalledWith(expectedParams)
      expect(result).toBe(mockUpdateTestResult)
    })
  })

  describe('updateLabelTestMap', () => {
    it('should update label test map', async () => {
      const params = {
        labelIds: [1, 2, 3],
        testId: 123,
        createdBy: 100,
        projectId: 1,
      }

      const mockResult = {affectedRows: 3}

      ;(TestsDao.updateLabelTestMap as jest.Mock).mockResolvedValue(mockResult)

      const result = await TestsController.updateLabelTestMap(params)

      expect(TestsDao.updateLabelTestMap).toHaveBeenCalledWith(params)
      expect(result).toBe(mockResult)
    })
  })

  describe('updateTests', () => {
    it('should update multiple tests', async () => {
      const params = {
        testIds: [1, 2, 3],
        property: 'status',
        value: 'Archived',
        userId: 100,
      }

      const mockResult = {affectedRows: 3}

      ;(TestsDao.updateTests as jest.Mock).mockResolvedValue(mockResult)

      const result = await TestsController.updateTests(params)

      expect(TestsDao.updateTests).toHaveBeenCalledWith(params)
      expect(result).toBe(mockResult)
    })
  })

  describe('bulkAddTests', () => {
    it('should bulk add tests with existing sections and squads', async () => {
      const params = {
        projectId: 1,
        orgId: 1,
        tests: [
          {
            title: 'Test 1',
            section: 'Section 1',
            squad: 'Squad 1',
          },
        ],
        createdBy: 100,
      }

      const mockSquads = [{squadName: 'Squad 1', squadId: 1, projectId: 1}]

      const mockSections = [
        {
          sectionName: 'Section 1',
          sectionId: 1,
          projectId: 1,
          parentId: null,
          sectionHierarchy: 'Section 1',
        },
      ]

      const mockPriorities = [{priorityName: 'Medium', priorityId: 1}]

      const mockAutomationStatuses = [
        {automationStatusName: 'Automatable', automationStatusId: 1},
      ]

      const mockPlatforms = [{platformName: 'All Platforms', platformId: 1}]

      const mockTestCoveredBy = [
        {testCoveredByName: 'Manual', testCoveredById: 1},
      ]

      const mockBulkAddResult = {affectedRows: 1}

      ;(SquadsDao.getAllSquads as jest.Mock).mockResolvedValue(mockSquads)
      ;(SectionsDao.getAllSections as jest.Mock).mockResolvedValue(mockSections)
      ;(PriorityDao.getAllPriority as jest.Mock).mockResolvedValue(
        mockPriorities,
      )
      ;(
        AutomationStatusDao.getAllAutomationStatus as jest.Mock
      ).mockResolvedValue(mockAutomationStatuses)
      ;(PlatformDao.getAllPlatform as jest.Mock).mockResolvedValue(
        mockPlatforms,
      )
      ;(TestCoveredByDao.getAllTestCoveredBy as jest.Mock).mockResolvedValue(
        mockTestCoveredBy,
      )
      ;(TestsDao.bulkAddTests as jest.Mock).mockResolvedValue(mockBulkAddResult)

      const result = await TestsController.bulkAddTests(params)

      expect(SquadsDao.getAllSquads).toHaveBeenCalledWith({projectId: 1})
      expect(SectionsDao.getAllSections).toHaveBeenCalledWith({projectId: 1})
      expect(PriorityDao.getAllPriority).toHaveBeenCalledWith({orgId: 1})
      expect(AutomationStatusDao.getAllAutomationStatus).toHaveBeenCalledWith({
        orgId: 1,
      })
      expect(PlatformDao.getAllPlatform).toHaveBeenCalledWith({orgId: 1})
      expect(TestCoveredByDao.getAllTestCoveredBy).toHaveBeenCalledWith({
        orgId: 1,
      })

      expect(TestsDao.bulkAddTests).toHaveBeenCalledWith(
        expect.objectContaining({
          insertTest: expect.arrayContaining([
            expect.objectContaining({
              title: 'Test 1',
              squadId: 1,
              sectionId: 1,
              priorityId: 1,
              automationStatusId: 1,
              platformId: 1,
              testCoveredById: 1,
              projectId: 1,
              createdBy: 100,
            }),
          ]),
          projectId: 1,
          createdBy: 100,
        }),
      )

      expect(result).toEqual({
        testData: mockBulkAddResult,
        squadsAdded: [],
        sectionsAdded: [],
      })
    })

    it('should bulk add tests with new section and squad', async () => {
      const params = {
        projectId: 1,
        orgId: 1,
        tests: [
          {
            title: 'Test 1',
            section: 'New Section',
            squad: 'New Squad',
          },
        ],
        createdBy: 100,
      }

      const mockSquads: any[] = []

      const mockSections: any[] = []

      const mockPriorities = [{priorityName: 'Medium', priorityId: 1}]

      const mockAutomationStatuses = [
        {automationStatusName: 'Automatable', automationStatusId: 1},
      ]

      const mockPlatforms = [{platformName: 'All Platforms', platformId: 1}]

      const mockTestCoveredBy = [
        {testCoveredByName: 'Manual', testCoveredById: 1},
      ]

      const mockNewSquad = {
        squadName: 'New Squad',
        squadId: 2,
        projectId: 1,
      }

      const mockNewSection = {
        sectionName: 'New Section',
        sectionId: 2,
        projectId: 1,
        parentId: null,
      }

      const mockBulkAddResult = {affectedRows: 1}

      ;(SquadsDao.getAllSquads as jest.Mock).mockResolvedValue(mockSquads)
      ;(SectionsDao.getAllSections as jest.Mock).mockResolvedValue(mockSections)
      ;(PriorityDao.getAllPriority as jest.Mock).mockResolvedValue(
        mockPriorities,
      )
      ;(
        AutomationStatusDao.getAllAutomationStatus as jest.Mock
      ).mockResolvedValue(mockAutomationStatuses)
      ;(PlatformDao.getAllPlatform as jest.Mock).mockResolvedValue(
        mockPlatforms,
      )
      ;(TestCoveredByDao.getAllTestCoveredBy as jest.Mock).mockResolvedValue(
        mockTestCoveredBy,
      )
      ;(SquadsController.checkAndCreateSquad as jest.Mock).mockResolvedValue(
        mockNewSquad,
      )
      ;(
        SectionsController.createSectionFromHierarchy as jest.Mock
      ).mockResolvedValue(mockNewSection)
      ;(TestsDao.bulkAddTests as jest.Mock).mockResolvedValue(mockBulkAddResult)

      const result = await TestsController.bulkAddTests(params)

      expect(SquadsController.checkAndCreateSquad).toHaveBeenCalledWith({
        squadName: 'New Squad',
        projectId: 1,
        createdBy: 100,
      })

      expect(
        SectionsController.createSectionFromHierarchy,
      ).toHaveBeenCalledWith({
        createdBy: 100,
        projectId: 1,
        sectionHierarchyString: 'New Section',
        sectionDescription: undefined,
      })

      expect(TestsDao.bulkAddTests).toHaveBeenCalledWith(
        expect.objectContaining({
          insertTest: expect.arrayContaining([
            expect.objectContaining({
              title: 'Test 1',
              squadId: 2,
              sectionId: 2,
              priorityId: 1,
              automationStatusId: 1,
              platformId: 1,
              testCoveredById: 1,
              projectId: 1,
              createdBy: 100,
            }),
          ]),
          projectId: 1,
          createdBy: 100,
        }),
      )

      expect(result).toEqual({
        testData: mockBulkAddResult,
        squadsAdded: [mockNewSquad],
        sectionsAdded: [mockNewSection],
      })
    })

    it('should handle errors in bulkAddTests', async () => {
      const params = {
        projectId: 1,
        orgId: 1,
        tests: [
          {
            title: 'Test 1',
            section: 'Section 1',
            squad: 'Squad 1',
          },
        ],
        createdBy: 100,
      }

      const mockError = new Error('Bulk add failed')

      ;(SquadsDao.getAllSquads as jest.Mock).mockRejectedValue(mockError)

      await expect(TestsController.bulkAddTests(params)).rejects.toThrow(
        'Bulk add failed',
      )
    })
  })

  describe('getTestStatus', () => {
    it('should get test status', async () => {
      const params = {
        projectId: 1,
        testId: 123,
        runId: 456,
      }

      const mockResult = {status: 'Passed'}

      ;(TestsDao.getTestStatus as jest.Mock).mockResolvedValue(mockResult)

      const result = await TestsController.getTestStatus(params)

      expect(TestsDao.getTestStatus).toHaveBeenCalledWith(params)
      expect(result).toBe(mockResult)
    })
  })

  describe('getTestDetails', () => {
    it('should get test details', async () => {
      const projectId = 1
      const testId = 123

      const mockResult = {id: 123, title: 'Test Title'}

      ;(TestsDao.getTestDetails as jest.Mock).mockResolvedValue(mockResult)

      const result = await TestsController.getTestDetails(projectId, testId)

      expect(TestsDao.getTestDetails).toHaveBeenCalledWith({projectId, testId})
      expect(result).toBe(mockResult)
    })
  })

  describe('downloadTests', () => {
    it('should download tests', async () => {
      const params = {
        projectId: 1,
        page: 1,
        pageSize: 10,
      }

      const mockResult = [{id: 1, title: 'Test 1'}]

      ;(TestsDao.downloadTests as jest.Mock).mockResolvedValue(mockResult)

      const result = await TestsController.downloadTests(params)

      expect(TestsDao.downloadTests).toHaveBeenCalledWith(params)
      expect(result).toBe(mockResult)
    })
  })

  describe('bulkDeleteTests', () => {
    it('should bulk delete tests', async () => {
      const params = {
        testIds: [1, 2, 3],
        projectId: 1,
        userId: 100,
      }

      const mockResult = {affectedRows: 3}

      ;(TestsDao.bulkDeleteTests as jest.Mock).mockResolvedValue(mockResult)

      const result = await TestsController.bulkDeleteTests(params)

      expect(TestsDao.bulkDeleteTests).toHaveBeenCalledWith(params)
      expect(result).toBe(mockResult)
    })
  })
})
