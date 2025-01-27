import {IArchiveProjects} from '@controllers/projects.controller'
import RunsController, {
  ICreateRuns,
  IGetAllRuns,
  IUpdateRun,
} from '@controllers/runs.controller'
import RunsDao from '@dao/runs.dao'

jest.mock('@dao/runs.dao')

describe('RunsController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllRuns', () => {
    it('should call RunsDao.getAllRuns with the correct parameters', async () => {
      const mockParams: IGetAllRuns = {
        projectId: 123,
        pageSize: 10,
        page: 1,
        search: 'Test',
        status: 'Archived' as IGetAllRuns['status'],
      }
      const mockResponse = [{runId: 1, runName: 'Run A'}]

      ;(RunsDao.getAllRuns as jest.Mock).mockResolvedValue(mockResponse)

      const result = await RunsController.getAllRuns(mockParams)

      expect(RunsDao.getAllRuns).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors from RunsDao.getAllRuns', async () => {
      const mockParams = {projectId: 123, pageSize: 10, page: 1}
      const mockError = new Error('Database error')

      ;(RunsDao.getAllRuns as jest.Mock).mockRejectedValue(mockError)

      await expect(RunsController.getAllRuns(mockParams)).rejects.toThrow(
        'Database error',
      )

      expect(RunsDao.getAllRuns).toHaveBeenCalledWith(mockParams)
    })
  })

  describe('createRun', () => {
    it('should call RunsDao.createRun with the correct parameters', async () => {
      const mockParams: ICreateRuns = {
        projectId: 123,
        runName: 'New Run',
        runDescription: 'Description of the run',
        labelIds: [1, 2],
        createdBy: 456,
        filterType: 'and',
      }
      const mockResponse = {runId: 789}

      ;(RunsDao.createRun as jest.Mock).mockResolvedValue(mockResponse)

      const result = await RunsController.createRun(mockParams)

      expect(RunsDao.createRun).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors from RunsDao.createRun', async () => {
      const mockParams = {
        projectId: 123,
        runName: 'New Run',
        createdBy: 456,
      }
      const mockError = new Error('Database error')

      ;(RunsDao.createRun as jest.Mock).mockRejectedValue(mockError)

      await expect(RunsController.createRun(mockParams)).rejects.toThrow(
        'Database error',
      )

      expect(RunsDao.createRun).toHaveBeenCalledWith(mockParams)
    })
  })

  describe('getRunInfo', () => {
    it('should call RunsDao.getRunInfo with the correct parameters', async () => {
      const mockParams = {runId: 123, projectId: 456}
      const mockResponse = {runId: 123, runName: 'Run A'}

      ;(RunsDao.getRunInfo as jest.Mock).mockResolvedValue(mockResponse)

      const result = await RunsController.getRunInfo(mockParams)

      expect(RunsDao.getRunInfo).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors from RunsDao.getRunInfo', async () => {
      const mockParams = {runId: 123, projectId: 456}
      const mockError = new Error('Database error')

      ;(RunsDao.getRunInfo as jest.Mock).mockRejectedValue(mockError)

      await expect(RunsController.getRunInfo(mockParams)).rejects.toThrow(
        'Database error',
      )

      expect(RunsDao.getRunInfo).toHaveBeenCalledWith(mockParams)
    })
  })

  describe('deleteRun', () => {
    it('should call RunsDao.deleteRun with the correct parameters', async () => {
      const mockParams = {runId: 123, projectId: 456, userId: 789}
      const mockResponse = {affectedRows: 1}

      ;(RunsDao.deleteRun as jest.Mock).mockResolvedValue(mockResponse)

      const result = await RunsController.deleteRun(mockParams)

      expect(RunsDao.deleteRun).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors from RunsDao.deleteRun', async () => {
      const mockParams = {runId: 123, projectId: 456, userId: 789}
      const mockError = new Error('Database error')

      ;(RunsDao.deleteRun as jest.Mock).mockRejectedValue(mockError)

      await expect(RunsController.deleteRun(mockParams)).rejects.toThrow(
        'Database error',
      )

      expect(RunsDao.deleteRun).toHaveBeenCalledWith(mockParams)
    })
  })

  describe('lockRun', () => {
    it('should call RunsDao.lockRun with the correct parameters', async () => {
      const mockParams = {runId: 123, projectId: 456, userId: 789}
      const mockResponse = {affectedRows: 1}

      ;(RunsDao.lockRun as jest.Mock).mockResolvedValue(mockResponse)

      const result = await RunsController.lockRun(mockParams)

      expect(RunsDao.lockRun).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors from RunsDao.lockRun', async () => {
      const mockParams = {runId: 123, projectId: 456, userId: 789}
      const mockError = new Error('Database error')

      ;(RunsDao.lockRun as jest.Mock).mockRejectedValue(mockError)

      await expect(RunsController.lockRun(mockParams)).rejects.toThrow(
        'Database error',
      )

      expect(RunsDao.lockRun).toHaveBeenCalledWith(mockParams)
    })
  })

  describe('updateRun', () => {
    it('should call RunsDao.updateRun with the correct parameters', async () => {
      const mockParams = {
        runId: 123,
        runName: 'Updated Run',
        runDescription: 'Updated description',
        projectId: 456,
        userId: 789,
      }
      const mockResponse = {affectedRows: 1}

      ;(RunsDao.updateRun as jest.Mock).mockResolvedValue(mockResponse)

      const result = await RunsController.updateRun(mockParams)

      expect(RunsDao.updateRun).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors from RunsDao.updateRun', async () => {
      const mockParams: IUpdateRun = {
        runId: 123,
        runName: 'Updated Run',
        projectId: 456,
        userId: 789,
        runDescription: 'Desc',
      }
      const mockError = new Error('Database error')

      ;(RunsDao.updateRun as jest.Mock).mockRejectedValue(mockError)

      await expect(RunsController.updateRun(mockParams)).rejects.toThrow(
        'Database error',
      )

      expect(RunsDao.updateRun).toHaveBeenCalledWith(mockParams)
    })
  })
})
