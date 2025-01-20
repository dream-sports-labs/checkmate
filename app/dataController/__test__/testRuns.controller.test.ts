import TestRunsController from '@controllers/testRuns.controller'
import {TestStatusType} from '@controllers/types'
import TestRunsDao, {ITestRunData} from '@dao/testRuns.dao'

jest.mock('@dao/testRuns.dao')

describe('TestRunsController', () => {
  const mockTestRunData: ITestRunData = {
    runId: 1,
    projectId: 1,
    page: 1,
    pageSize: 10,
    textSearch: '',
    sortOrder: 'asc',
  }

  const mockGetAllTestRunsResp = {}
  const mockUpdateStatusResponse = [{affectedRows: 2}]

  const validTestIdStatusArray = [
    {testId: 1, status: TestStatusType.Passed},
    {testId: 2, status: TestStatusType.Failed},
  ]

  const invalidTestIdStatusArray = [
    {testId: 3, status: 'INVALID_STATUS' as TestStatusType},
    {status: TestStatusType.Passed}, // missing testId
  ]

  const mixedTestIdStatusArray = [
    ...validTestIdStatusArray,
    ...invalidTestIdStatusArray,
  ]

  const partiallyFailedUpdateResponse = [{affectedRows: 1}]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllTestRuns', () => {
    it('should fetch all test runs successfully', async () => {
      ;(TestRunsDao.getAllTestRuns as jest.Mock).mockResolvedValue(
        mockGetAllTestRunsResp,
      )

      const result = await TestRunsController.getAllTestRuns(mockTestRunData)

      expect(TestRunsDao.getAllTestRuns).toHaveBeenCalledWith(mockTestRunData)
      expect(result).toEqual(mockGetAllTestRunsResp)
    })

    it('should return empty response when no test runs exist', async () => {
      ;(TestRunsDao.getAllTestRuns as jest.Mock).mockResolvedValue([])

      const result = await TestRunsController.getAllTestRuns(mockTestRunData)

      expect(TestRunsDao.getAllTestRuns).toHaveBeenCalledWith(mockTestRunData)
      expect(result).toEqual([])
    })
  })

  describe('updateStatusTestRuns', () => {
    it('should throw an error when no data is provided', async () => {
      await expect(
        TestRunsController.updateStatusTestRuns({
          runId: 1,
          projectId: 1,
          testIdStatusArray: [],
          userId: 123,
        }),
      ).rejects.toThrow('No data provided to update status')
    })

    it('should return a failed response for invalid statuses', async () => {
      const result = await TestRunsController.updateStatusTestRuns({
        runId: 1,
        projectId: 1,
        testIdStatusArray: invalidTestIdStatusArray,
        userId: 123,
      })

      expect(result).toEqual({
        passed: undefined,
        failed: {
          message: '2 test(s) failed to update',
          count: 2,
          details: [
            {
              message:
                'Invalid status provided, provide one of {Passed, Failed, Untested, Blocked, Retest, Archived, Skipped, InProgress}',
              id: 3,
            },
            {
              message: 'testId missing',
            },
          ],
        },
      })
    })

    it('should update statuses successfully for valid testIds', async () => {
      ;(TestRunsDao.updateStatusTestRuns as jest.Mock).mockResolvedValue(
        mockUpdateStatusResponse,
      )

      const result = await TestRunsController.updateStatusTestRuns({
        runId: 1,
        projectId: 1,
        testIdStatusArray: validTestIdStatusArray,
        userId: 123,
      })

      expect(result).toEqual({
        passed: {
          message: 'Updated status of 2 test(s)',
          count: 2,
        },
        failed: undefined,
      })
    })

    it('should handle partial updates when some testIds are valid and others are invalid', async () => {
      ;(TestRunsDao.updateStatusTestRuns as jest.Mock).mockResolvedValue(
        partiallyFailedUpdateResponse,
      )

      const result = await TestRunsController.updateStatusTestRuns({
        runId: 1,
        projectId: 1,
        testIdStatusArray: mixedTestIdStatusArray,
        userId: 123,
      })

      expect(result).toEqual({
        passed: {message: 'Updated status of 1 test(s)', count: 1},
        failed: {
          message: '3 test(s) failed to update',
          count: 3,
          details: [
            {
              message:
                'Invalid status provided, provide one of {Passed, Failed, Untested, Blocked, Retest, Archived, Skipped, InProgress}',
              id: 3,
            },
            {message: 'testId missing'},
          ],
        },
      })
    })

    it('should handle DAO-level errors gracefully', async () => {
      ;(TestRunsDao.updateStatusTestRuns as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      )

      await expect(
        TestRunsController.updateStatusTestRuns({
          runId: 1,
          projectId: 1,
          testIdStatusArray: validTestIdStatusArray,
          userId: 123,
        }),
      ).rejects.toThrow('Database error')
    })
  })

  describe('runsMetaInfo', () => {
    it('should return meta info for a run', async () => {
      const mockMetaInfo = {
        total: 10,
        passed: 5,
        failed: 3,
        blocked: 2,
      }

      ;(TestRunsDao.runsMetaInfo as jest.Mock).mockResolvedValue(mockMetaInfo)
      const result = await TestRunsController.runsMetaInfo({
        runId: 1,
        projectId: 1,
        groupBy: undefined,
      })

      expect(result).toEqual({status: 'Error in fetching data'})
      expect(TestRunsDao.runsMetaInfo).toHaveBeenCalledWith({
        runId: 1,
        projectId: 1,
        groupBy: undefined,
      })
    })

    it('should handle missing data gracefully', async () => {
      ;(TestRunsDao.runsMetaInfo as jest.Mock).mockResolvedValue(undefined)

      const result = await TestRunsController.runsMetaInfo({
        runId: 1,
        projectId: 1,
        groupBy: undefined,
      })

      expect(result).toEqual({status: 'Error in fetching data'})
    })

    it('should handle grouped data by squads', async () => {
      const mockGroupedData = {
        statuCountArray: [
          {status: 'Retest', status_count: 1},
          {status: 'InProgress', status_count: 1},
          {status: 'Untested', status_count: 5619},
          {status: 'Skipped', status_count: 1},
        ],
        groupByData: [
          {
            squadName: 'User_Identity_Pod',
            squadId: 16,
            status: 'Retest',
            status_count: 1,
          },
          {
            squadName: 'User_Identity_Pod',
            squadId: 16,
            status: 'InProgress',
            status_count: 1,
          },
        ],
      }

      ;(TestRunsDao.runsMetaInfo as jest.Mock).mockResolvedValue(
        mockGroupedData,
      )

      const result = await TestRunsController.runsMetaInfo({
        runId: 1,
        projectId: 1,
        groupBy: 'squads',
      })

      const expectedResult = {
        total: 5622,
        passed: 0,
        failed: 0,
        untested: 5619,
        blocked: 0,
        retest: 1,
        archived: 0,
        skipped: 1,
        inprogress: 1,
        squadData: [
          {
            squadName: 'User_Identity_Pod',
            squadId: 16,
            runData: {
              total: 2,
              passed: 0,
              failed: 0,
              untested: 0,
              blocked: 0,
              retest: 1,
              archived: 0,
              skipped: 0,
              inprogress: 1,
            },
          },
        ],
      }

      expect(result).toEqual(expectedResult)
      expect(TestRunsDao.runsMetaInfo).toHaveBeenCalledWith({
        runId: 1,
        projectId: 1,
        groupBy: 'squads',
      })
    })
  })
})
