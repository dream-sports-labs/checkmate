import TestRunsController from '@controllers/testRuns.controller'
import {TestStatusType} from '@controllers/types'
import TestRunsDao, {ITestRunData} from '@dao/testRuns.dao'
import RunsDao from '@dao/runs.dao'

jest.mock('@dao/testRuns.dao')
jest.mock('@dao/runs.dao')

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
    {status: TestStatusType.Passed},
  ]

  const mixedTestIdStatusArray = [
    ...validTestIdStatusArray,
    ...invalidTestIdStatusArray,
  ]

  const partiallyFailedUpdateResponse = [{affectedRows: 2}]
  const allFailedUpdateResponse = [{affectedRows: 2}]

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
              message: `Invalid status provided, provide one of {${Object.values(
                TestStatusType,
              ).join(', ')}}`,
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
        passed: {message: 'Updated status of 2 test(s)', count: 2},
        failed: {
          message: '2 test(s) failed to update',
          count: 2,
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
    it('should handle undefined response from DAO', async () => {
      ;(TestRunsDao.updateStatusTestRuns as jest.Mock).mockResolvedValue(
        undefined,
      )

      const result = await TestRunsController.updateStatusTestRuns({
        runId: 1,
        projectId: 1,
        testIdStatusArray: validTestIdStatusArray,
        userId: 123,
      })

      expect(result).toEqual({
        passed: undefined,
        failed: {
          message: '2 test(s) failed to update',
          count: 2,
          details: [],
        },
      })
    })

    it('should handle all testId values missing', async () => {
      ;(TestRunsDao.updateStatusTestRuns as jest.Mock).mockRejectedValue(
        new Error('No data provided to update status'),
      )
      const allMissing = [
        {status: TestStatusType.Passed},
        {status: TestStatusType.Failed},
      ]
      await expect(
        TestRunsController.updateStatusTestRuns({
          runId: 1,
          projectId: 1,
          testIdStatusArray: validTestIdStatusArray,
          userId: 123,
        }),
      ).rejects.toThrow('No data provided to update status')
    })

    it('should handle all statuses invalid', async () => {
      ;(TestRunsDao.updateStatusTestRuns as jest.Mock).mockRejectedValue(
        new Error('No data provided to update status'),
      )
      const allInvalid = [
        {testId: 1, status: 'INVALID' as TestStatusType},
        {testId: 2, status: 'WRONG' as TestStatusType},
      ]
      await expect(
        TestRunsController.updateStatusTestRuns({
          runId: 1,
          projectId: 1,
          testIdStatusArray: validTestIdStatusArray,
          userId: 123,
        }),
      ).rejects.toThrow('No data provided to update status')
    })

    it('should use per-item comment over global comment', async () => {
      ;(TestRunsDao.updateStatusTestRuns as jest.Mock).mockResolvedValue(
        mockUpdateStatusResponse,
      )
      const result = await TestRunsController.updateStatusTestRuns({
        runId: 1,
        projectId: 1,
        testIdStatusArray: [
          {testId: 1, status: TestStatusType.Passed, comment: 'item'},
        ],
        userId: 123,
        comment: 'global',
      })
      expect(TestRunsDao.updateStatusTestRuns).toHaveBeenCalledWith(
        expect.objectContaining({
          markStatusArray: [expect.objectContaining({comment: 'item'})],
        }),
      )
      expect(result.passed).toBeDefined()
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

    it('should handle empty status counts and fetch run info when needed', async () => {
      const mockEmptyStatusArray = {
        statuCountArray: [],
      }

      const mockRunInfo = [{runId: 1, name: 'Test Run'}]

      ;(TestRunsDao.runsMetaInfo as jest.Mock).mockResolvedValue(
        mockEmptyStatusArray,
      )
      ;(RunsDao.getRunInfo as jest.Mock).mockResolvedValue(mockRunInfo)

      const result = await TestRunsController.runsMetaInfo({
        runId: 1,
        projectId: 1,
      })

      expect(TestRunsDao.runsMetaInfo).toHaveBeenCalledWith({
        runId: 1,
        projectId: 1,
        groupBy: undefined,
      })

      expect(RunsDao.getRunInfo).toHaveBeenCalledWith({
        runId: 1,
        projectId: 1,
      })

      // Default values for all statuses should be 0
      expect(result).toEqual({
        total: 0,
        passed: 0,
        failed: 0,
        untested: 0,
        blocked: 0,
        retest: 0,
        archived: 0,
        skipped: 0,
        inprogress: 0,
      })
    })

    it('should return an error message if no run is found', async () => {
      const mockEmptyStatusArray = {
        statuCountArray: [],
      }

      const mockEmptyRunInfo: any[] = []

      ;(TestRunsDao.runsMetaInfo as jest.Mock).mockResolvedValue(
        mockEmptyStatusArray,
      )
      ;(RunsDao.getRunInfo as jest.Mock).mockResolvedValue(mockEmptyRunInfo)

      const result = await TestRunsController.runsMetaInfo({
        runId: 999, // Non-existent run
        projectId: 1,
      })

      expect(result).toEqual({status: 'Provide valid runId'})
    })

    it('should handle undefined groupByData', async () => {
      const mockMetaInfo = {
        statuCountArray: [
          {status: 'Passed', status_count: 5},
          {status: 'Failed', status_count: 3},
        ],
        groupByData: undefined,
      }

      ;(TestRunsDao.runsMetaInfo as jest.Mock).mockResolvedValue(mockMetaInfo)

      const result = await TestRunsController.runsMetaInfo({
        runId: 1,
        projectId: 1,
        groupBy: 'squads',
      })

      expect(result).toEqual({
        total: 8,
        passed: 5,
        failed: 3,
        untested: 0,
        blocked: 0,
        retest: 0,
        archived: 0,
        skipped: 0,
        inprogress: 0,
      })
    })

    it('should handle undefined statuCountArray', async () => {
      const mockMetaInfo = {
        statuCountArray: undefined,
      }

      ;(TestRunsDao.runsMetaInfo as jest.Mock).mockResolvedValue(mockMetaInfo)

      const result = await TestRunsController.runsMetaInfo({
        runId: 1,
        projectId: 1,
      })

      expect(result).toEqual({status: 'Error in fetching data'})
    })

    it('should handle undefined groupByData when groupBy is specified', async () => {
      const mockMetaInfo = {
        statuCountArray: [
          {status: 'Passed', status_count: 5},
          {status: 'Failed', status_count: 3},
        ],
        groupByData: undefined,
      }

      ;(TestRunsDao.runsMetaInfo as jest.Mock).mockResolvedValue(mockMetaInfo)

      const result = await TestRunsController.runsMetaInfo({
        runId: 1,
        projectId: 1,
        groupBy: 'squads',
      })

      expect(result).toEqual({
        total: 8,
        passed: 5,
        failed: 3,
        untested: 0,
        blocked: 0,
        retest: 0,
        archived: 0,
        skipped: 0,
        inprogress: 0,
      })
    })

    it('should handle metaInfo as null', async () => {
      ;(TestRunsDao.runsMetaInfo as jest.Mock).mockResolvedValue(null)
      const result = await TestRunsController.runsMetaInfo({
        runId: 1,
        projectId: 1,
      })
      expect(result).toEqual({status: 'Error in fetching data'})
    })
  })

  describe('getTestStatusHistoryOfRun', () => {
    it('should call TestRunsDao.getTestStatusHistoryOfRun with correct parameters', async () => {
      const params = {
        runId: 1,
        testId: 123,
      }

      const mockResponse = [
        {status: 'Passed', updatedBy: 1, updatedOn: new Date()},
      ]

      ;(TestRunsDao.getTestStatusHistoryOfRun as jest.Mock).mockResolvedValue(
        mockResponse,
      )

      const result = await TestRunsController.getTestStatusHistoryOfRun(params)

      expect(TestRunsDao.getTestStatusHistoryOfRun).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResponse)
    })

    it('should handle DAO returning undefined', async () => {
      ;(TestRunsDao.getTestStatusHistoryOfRun as jest.Mock).mockResolvedValue(
        undefined,
      )
      const result = await TestRunsController.getTestStatusHistoryOfRun({
        runId: 1,
        testId: 1,
      })
      expect(result).toBeUndefined()
    })

    it('should handle DAO throwing error', async () => {
      ;(TestRunsDao.getTestStatusHistoryOfRun as jest.Mock).mockRejectedValue(
        new Error('DAO error'),
      )
      await expect(
        TestRunsController.getTestStatusHistoryOfRun({runId: 1, testId: 1}),
      ).rejects.toThrow('DAO error')
    })
  })

  describe('testStatusHistory', () => {
    it('should call TestRunsDao.testStatusHistory with correct parameters', async () => {
      const params = {
        testId: 123,
      }

      const mockResponse = [
        {runId: 1, status: 'Passed', updatedBy: 1, updatedOn: new Date()},
        {runId: 2, status: 'Failed', updatedBy: 1, updatedOn: new Date()},
      ]

      ;(TestRunsDao.testStatusHistory as jest.Mock).mockResolvedValue(
        mockResponse,
      )

      const result = await TestRunsController.testStatusHistory(params)

      expect(TestRunsDao.testStatusHistory).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResponse)
    })

    it('should handle DAO returning undefined', async () => {
      ;(TestRunsDao.testStatusHistory as jest.Mock).mockResolvedValue(undefined)
      const result = await TestRunsController.testStatusHistory({testId: 1})
      expect(result).toBeUndefined()
    })

    it('should handle DAO throwing error', async () => {
      ;(TestRunsDao.testStatusHistory as jest.Mock).mockRejectedValue(
        new Error('DAO error'),
      )
      await expect(
        TestRunsController.testStatusHistory({testId: 1}),
      ).rejects.toThrow('DAO error')
    })
  })

  describe('deleteTestFromRun', () => {
    it('should call TestRunsDao.deleteTestFromRun with correct parameters', async () => {
      const params = {
        testIds: [123, 456],
        runId: 1,
        projectId: 1,
        updatedBy: 100,
      }

      const mockResponse = {affectedRows: 2}

      ;(TestRunsDao.deleteTestFromRun as jest.Mock).mockResolvedValue(
        mockResponse,
      )

      const result = await TestRunsController.deleteTestFromRun(params)

      expect(TestRunsDao.deleteTestFromRun).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResponse)
    })

    it('should handle DAO returning undefined', async () => {
      ;(TestRunsDao.deleteTestFromRun as jest.Mock).mockResolvedValue(undefined)
      const result = await TestRunsController.deleteTestFromRun({
        testIds: [1],
        runId: 1,
        projectId: 1,
        updatedBy: 1,
      })
      expect(result).toBeUndefined()
    })

    it('should handle DAO throwing error', async () => {
      ;(TestRunsDao.deleteTestFromRun as jest.Mock).mockRejectedValue(
        new Error('DAO error'),
      )
      await expect(
        TestRunsController.deleteTestFromRun({
          testIds: [1],
          runId: 1,
          projectId: 1,
          updatedBy: 1,
        }),
      ).rejects.toThrow('DAO error')
    })
  })

  describe('markPassedAsRetest', () => {
    it('should call TestRunsDao.markPassedAsRetest with correct parameters', async () => {
      const params = {
        runId: 1,
        userId: 100,
      }

      const mockResponse = {affectedRows: 5}

      ;(TestRunsDao.markPassedAsRetest as jest.Mock).mockResolvedValue(
        mockResponse,
      )

      const result = await TestRunsController.markPassedAsRetest(params)

      expect(TestRunsDao.markPassedAsRetest).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResponse)
    })

    it('should handle DAO returning undefined', async () => {
      ;(TestRunsDao.markPassedAsRetest as jest.Mock).mockResolvedValue(
        undefined,
      )
      const result = await TestRunsController.markPassedAsRetest({
        runId: 1,
        userId: 1,
      })
      expect(result).toBeUndefined()
    })

    it('should handle DAO throwing error', async () => {
      ;(TestRunsDao.markPassedAsRetest as jest.Mock).mockRejectedValue(
        new Error('DAO error'),
      )
      await expect(
        TestRunsController.markPassedAsRetest({runId: 1, userId: 1}),
      ).rejects.toThrow('DAO error')
    })
  })

  describe('downloadReport', () => {
    it('should call TestRunsDao.downloadReport with correct parameters', async () => {
      const params = {
        runId: 1,
      }

      const mockResponse = [
        {testId: 123, title: 'Test 1', status: 'Passed'},
        {testId: 456, title: 'Test 2', status: 'Failed'},
      ]

      ;(TestRunsDao.downloadReport as jest.Mock).mockResolvedValue(mockResponse)

      const result = await TestRunsController.downloadReport(params)

      expect(TestRunsDao.downloadReport).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockResponse)
    })

    it('should handle DAO returning empty array', async () => {
      ;(TestRunsDao.downloadReport as jest.Mock).mockResolvedValue([])
      const result = await TestRunsController.downloadReport({runId: 1})
      expect(result).toEqual([])
    })

    it('should handle DAO throwing error', async () => {
      ;(TestRunsDao.downloadReport as jest.Mock).mockRejectedValue(
        new Error('DAO error'),
      )
      await expect(
        TestRunsController.downloadReport({runId: 1}),
      ).rejects.toThrow('DAO error')
    })
  })
})
