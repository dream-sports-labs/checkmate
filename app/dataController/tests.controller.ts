import {BulkAddTestRequestAPIType} from '@api/bulkAddTest'
import {CreateTestRequestAPIType} from '@api/createTest'
import {UpdateTestRequestAPIType} from '@api/updateTest'
import AutomationStatusDao from '@dao/automationStatus.dao'
import PlatformDao from '@dao/platform.dao'
import PriorityDao from '@dao/priority.dao'
import SectionsDao from '@dao/sections.dao'
import SquadsDao from '@dao/squads.dao'
import TestCoveredByDao from '@dao/testCoveredBy.dao'
import TestsDao, {IBulkAddTestsDao} from '~/db/dao/test.dao'
import {handleNewSectionAndSquad} from './utils'
import SectionsController from './sections.controller'

export interface ITestStatus {
  projectId: number
  testId: number
  runId: number
}

export interface ITestsController {
  projectId: number
  labelIds?: number[]
  squadIds?: number[]
  sectionIds?: number[]
  page: number
  pageSize: number
  textSearch?: string
  filterType?: 'and' | 'or'
  status?: 'Active' | 'Archived' | 'Deleted'
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ITestsCountController {
  projectId: number
  labelIds?: number[]
  squadIds?: number[]
  filterType?: 'and' | 'or'
  includeTestIds?: boolean
  status?: 'Active' | 'Archived' | 'Deleted'
  textSearch?: string
  sectionIds?: number[]
}

export interface IUpdateTests {
  testIds: number[]
  property: string
  value?: null | any
  projectId?: null | number
  userId: number
}

export interface ICreateTestController extends CreateTestRequestAPIType {
  createdBy: number
  assignedTo: number
}

export interface IDeleteTestController {
  testId: number
  userId: number
}

export type IUpdateTestController = UpdateTestRequestAPIType & {
  updatedBy: number
}

export interface IUpdateLabelTestMapController {
  labelIds: number[]
  testId: number
  createdBy: number
  projectId: number
}

interface IBulkAddTestsController extends BulkAddTestRequestAPIType {
  createdBy: number
  orgId: number
}

export interface IBulkDeleteTests {
  testIds: number[]
  projectId: number
  userId: number
}

const TestsController = {
  getTests: async (params: ITestsController) => {
    const [testData, count] = await Promise.all([
      TestsDao.getTests(params),
      TestsDao.getTestsCount(params),
    ])
    return {testData, count}
  },
  getTestsCount: (params: ITestsCountController) =>
    TestsDao.getTestsCount(params),
  createTest: async (params: ICreateTestController) => {
    const results = await handleNewSectionAndSquad(params)
    if (results?.newSection) params.sectionId = results.newSection.sectionId
    if (results?.newSquad) params.squadId = results.newSquad.squadId

    return TestsDao.createTest(params)
  },
  deleteTest: (params: IDeleteTestController) => TestsDao.deleteTest(params),
  updateTest: async (params: IUpdateTestController) => {
    const results = await handleNewSectionAndSquad({
      ...params,
      createdBy: params.updatedBy,
    })
    if (results?.newSection) params.sectionId = results.newSection.sectionId
    if (results?.newSquad) params.squadId = results.newSquad.squadId

    return TestsDao.updateTest(params)
  },
  updateLabelTestMap: (params: IUpdateLabelTestMapController) =>
    TestsDao.updateLabelTestMap(params),
  updateTests: (params: IUpdateTests) => TestsDao.updateTests(params),

  bulkAddTests: async (param: IBulkAddTestsController) => {
    try {
      //get all squads and sections
      const squadsAdded = []
      const sectionsAdded = []
      const allSquads = await SquadsDao.getAllSquads({
        projectId: param.projectId,
      })
      let squadsData: {
        squadName: string
        squadId: number
        projectId: number
      }[] = []
      if (allSquads) {
        squadsData = allSquads.map((squad) => {
          return {
            squadName: squad.squadName,
            squadId: squad.squadId,
            projectId: squad.projectId,
          }
        })
      }

      const allSections = await SectionsDao.getAllSections({
        projectId: param.projectId,
      })
      let sectionsData: {
        sectionName: string
        sectionId: number
        projectId: number
        sectionHierarchy: string | null
      }[] = []
      if (allSections) {
        sectionsData = allSections.map((section) => {
          return {
            sectionName: section.sectionName,
            sectionId: section.sectionId,
            projectId: section.projectId,
            sectionHierarchy: section.sectionHierarchy,
          }
        })
      }

      //TODO: remove hardcoded orgId
      const allPriority = await PriorityDao.getAllPriority({
        orgId: param.orgId,
      })
      const allAutomationStatus =
        await AutomationStatusDao.getAllAutomationStatus({
          orgId: param.orgId,
        })
      const allPlatforms = await PlatformDao.getAllPlatform({
        orgId: param.orgId,
      })
      const allTestCoveredBy = await TestCoveredByDao.getAllTestCoveredBy({
        orgId: param.orgId,
      })

      const defaultPriorityId = allPriority?.find(
        (priority) => priority.priorityName === 'Medium',
      )?.priorityId
      const defaultAutomationStatusId = allAutomationStatus?.find(
        (automationStatus) =>
          automationStatus.automationStatusName === 'Automatable',
      )?.automationStatusId
      const defaultPlatformId = allPlatforms?.find(
        (platform) => platform.platformName === 'All Platforms',
      )?.platformId
      const defaultTestCoveredById = allTestCoveredBy?.find(
        (testCoveredBy) => testCoveredBy.testCoveredByName === 'Manual',
      )?.testCoveredById

      const insertTest: IBulkAddTestsDao[] = []

      for (const test of param.tests) {
        let squadId = squadsData.find(
          (squad) => squad.squadName === test.squad?.trim(),
        )?.squadId
        if (!squadId && test.squad) {
          const newSquad = await SquadsDao.addSquad({
            squadName: test.squad?.trim(),
            projectId: param.projectId,
            createdBy: param.createdBy,
          })
          if (newSquad) {
            squadsData.push(newSquad)
            squadsAdded.push(newSquad)
            squadId = newSquad.squadId
          }
        }

        let sectionId = sectionsData.find((section) => {
          return (
            section.sectionName === test.sectionName?.trim() &&
            section.sectionHierarchy === test.sectionHierarchy?.trim()
          )
        })?.sectionId
        if (!sectionId) {
          const sectionHierarchyArray = test.sectionHierarchy
            .split('>')
            .map((item) => item?.trim())

          if (test.sectionName !== sectionHierarchyArray.pop()) {
            throw new Error('Section name and hierarchy do not match')
          }

          const newSection =
            await SectionsController.createSectionFromHierarchyString({
              createdBy: param.createdBy,
              projectId: param.projectId,
              sectionHierarchyString: test.sectionHierarchy,
              sectionDescription: test.sectionDescription,
            })

          if (newSection) {
            sectionsData.push(newSection)
            sectionsAdded.push(newSection)
            sectionId = newSection.sectionId
          }
        }

        const priorityId =
          allPriority?.find(
            (priority) => priority.priorityName === test?.priority?.trim(),
          )?.priorityId ?? defaultPriorityId

        const automationStatusId =
          allAutomationStatus?.find(
            (automationStatus) =>
              automationStatus.automationStatusName ===
              test?.automationStatus?.trim(),
          )?.automationStatusId ?? defaultAutomationStatusId

        const platformId =
          allPlatforms?.find(
            (platform) => platform.platformName === test?.platform?.trim(),
          )?.platformId ?? defaultPlatformId

        const testCoveredById =
          allTestCoveredBy?.find(
            (testCoveredBy) =>
              testCoveredBy.testCoveredByName === test?.testCoveredBy?.trim(),
          )?.testCoveredById ?? defaultTestCoveredById

        const testId = test.testId ? Number(test.testId) : undefined

        if (
          priorityId &&
          platformId &&
          automationStatusId &&
          sectionId &&
          testCoveredById
        )
          insertTest.push({
            testId,
            title: test.title?.trim(),
            squadId,
            priorityId,
            platformId,
            testCoveredById,
            automationStatusId,
            steps: test.steps?.trim(),
            preConditions: test.preConditions?.trim(),
            expectedResult: test.expectedResult?.trim(),
            sectionId,
            projectId: param.projectId,
            createdBy: param.createdBy,
            automationId: test.automationId,
            additionalGroups: test.additionalGroups,
            description: test.description,
          })
      }

      const resp = await TestsDao.bulkAddTests({
        insertTest,
        labelIds: param.labelIds,
        projectId: param.projectId,
        createdBy: param.createdBy,
      })
      return {
        testData: resp,
        squadsAdded,
        sectionsAdded,
      }
    } catch (error: any) {
      throw error
    }
  },

  getTestStatus: (param: ITestStatus) => TestsDao.getTestStatus(param),

  getTestDetails: (projectId: number, testId: number) =>
    TestsDao.getTestDetails({projectId, testId}),

  downloadTests: (params: ITestsController) => TestsDao.downloadTests(params),
  bulkDeleteTests: (params: IBulkDeleteTests) =>
    TestsDao.bulkDeleteTests(params),
}

export default TestsController
