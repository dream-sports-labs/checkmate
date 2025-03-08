import ProjectsController, {
  IArchiveProjects,
} from '@controllers/projects.controller'
import ProjectsDao from '~/db/dao/projects.dao'

jest.mock('~/db/dao/projects.dao')

describe('ProjectsController', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAllProjects', () => {
    it('should call ProjectsDao.getAll with the correct parameters', async () => {
      const mockParams = {
        orgId: 123,
        page: 1,
        pageSize: 10,
      }
      const mockResponse = [
        {projectId: 1, projectName: 'Project A'},
        {projectId: 2, projectName: 'Project B'},
      ]

      ;(ProjectsDao.getAll as jest.Mock).mockResolvedValue(mockResponse)

      const result = await ProjectsController.getAllProjects(mockParams)

      expect(ProjectsDao.getAll).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors from ProjectsDao.getAll', async () => {
      const mockParams = {orgId: 123, page: 1, pageSize: 10}
      const mockError = new Error('Database error')

      ;(ProjectsDao.getAll as jest.Mock).mockRejectedValue(mockError)

      await expect(
        ProjectsController.getAllProjects(mockParams),
      ).rejects.toThrow('Database error')

      expect(ProjectsDao.getAll).toHaveBeenCalledWith(mockParams)
    })
  })

  describe('getProjectInfo', () => {
    it('should call ProjectsDao.getProjectInfo with the correct projectId', async () => {
      const projectId = 123
      const mockResponse = {projectId: 123, projectName: 'Project A'}

      ;(ProjectsDao.getProjectInfo as jest.Mock).mockResolvedValue(mockResponse)

      const result = await ProjectsController.getProjectInfo(projectId)

      expect(ProjectsDao.getProjectInfo).toHaveBeenCalledWith(projectId)
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors from ProjectsDao.getProjectInfo', async () => {
      const projectId = 123
      const mockError = new Error('Database error')

      ;(ProjectsDao.getProjectInfo as jest.Mock).mockRejectedValue(mockError)

      await expect(
        ProjectsController.getProjectInfo(projectId),
      ).rejects.toThrow('Database error')

      expect(ProjectsDao.getProjectInfo).toHaveBeenCalledWith(projectId)
    })
  })

  describe('createProject', () => {
    it('should call ProjectsDao.createProject with the correct parameters', async () => {
      const mockParams = {
        projectName: 'New Project',
        projectDescription: 'A new project description',
        orgId: 123,
        createdBy: 456,
      }
      const mockResponse = {projectId: 789}

      ;(ProjectsDao.createProject as jest.Mock).mockResolvedValue(mockResponse)

      const result = await ProjectsController.createProject(mockParams)

      expect(ProjectsDao.createProject).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors from ProjectsDao.createProject', async () => {
      const mockParams = {
        projectName: 'New Project',
        orgId: 123,
        createdBy: 456,
      }
      const mockError = new Error('Database error')

      ;(ProjectsDao.createProject as jest.Mock).mockRejectedValue(mockError)

      await expect(
        ProjectsController.createProject(mockParams),
      ).rejects.toThrow('Database error')

      expect(ProjectsDao.createProject).toHaveBeenCalledWith(mockParams)
    })
  })

  describe('editProject', () => {
    it('should call ProjectsDao.editProject with the correct parameters', async () => {
      const mockParams = {
        projectName: 'Updated Project',
        projectDescription: 'Updated description',
        projectId: 123,
        userId: 456,
      }
      const mockResponse = {affectedRows: 1}

      ;(ProjectsDao.editProject as jest.Mock).mockResolvedValue(mockResponse)

      const result = await ProjectsController.editProject(mockParams)

      expect(ProjectsDao.editProject).toHaveBeenCalledWith(mockParams)
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors from ProjectsDao.editProject', async () => {
      const mockParams = {
        projectName: 'Updated Project',
        projectId: 123,
        userId: 456,
      }
      const mockError = new Error('Database error')

      ;(ProjectsDao.editProject as jest.Mock).mockRejectedValue(mockError)

      await expect(ProjectsController.editProject(mockParams)).rejects.toThrow(
        'Database error',
      )

      expect(ProjectsDao.editProject).toHaveBeenCalledWith(mockParams)
    })
  })

  describe('updateProjectStatus', () => {
    it('should update project status and append timestamp to projectName when status is Archived', async () => {
      const mockParams: IArchiveProjects = {
        projectId: 123,
        status: 'Archived' as IArchiveProjects['status'],
        userId: 456,
      }
      const mockProjectInfo = [{projectName: 'MyProject', status: 'Active'}] // Mock response from getProjectInfo
      const mockResponse = {affectedRows: 1} // Mock response from updateProjectStatus

      // Mock getProjectInfo and updateProjectStatus
      ;(ProjectsDao.getProjectInfo as jest.Mock).mockResolvedValue(
        mockProjectInfo,
      )
      ;(ProjectsDao.updateProjectStatus as jest.Mock).mockResolvedValue(
        mockResponse,
      )

      const result = await ProjectsController.updateProjectStatus(mockParams)

      // Check that getProjectInfo was called
      expect(ProjectsDao.getProjectInfo).toHaveBeenCalledWith(123)

      // Check that updateProjectStatus was called with the updated projectName
      const expectedUpdatedParams = {
        ...mockParams,
        projectName: expect.stringMatching(
          /^MyProject_\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
        ), // Matches ISO timestamp
      }
      expect(ProjectsDao.updateProjectStatus).toHaveBeenCalledWith(
        expectedUpdatedParams,
      )

      expect(result).toEqual(mockResponse)
    })

    it('should reject with error if project is not found when status is Archived', async () => {
      const mockParams: IArchiveProjects = {
        projectId: 123,
        status: 'Archived' as IArchiveProjects['status'],
        userId: 456,
      }
      const mockProjectInfo: [] = [] // No project found

      ;(ProjectsDao.getProjectInfo as jest.Mock).mockResolvedValue(
        mockProjectInfo,
      )

      await expect(
        ProjectsController.updateProjectStatus(mockParams),
      ).rejects.toEqual({
        data: null,
        message: 'Project not found',
        status: 404,
      })

      expect(ProjectsDao.getProjectInfo).toHaveBeenCalledWith(123)
      expect(ProjectsDao.updateProjectStatus).not.toHaveBeenCalled() // No update if project not found
    })

    it('should call ProjectsDao.updateProjectStatus without modifying projectName for non-Archived status', async () => {
      const mockParams: IArchiveProjects = {
        projectId: 123,
        status: 'Deleted' as IArchiveProjects['status'],
        userId: 456,
      }
      const mockResponse = {affectedRows: 1}

      ;(ProjectsDao.updateProjectStatus as jest.Mock).mockResolvedValue(
        mockResponse,
      )

      const result = await ProjectsController.updateProjectStatus(mockParams)

      expect(ProjectsDao.getProjectInfo).not.toHaveBeenCalled() // No fetch for non-Archived
      expect(ProjectsDao.updateProjectStatus).toHaveBeenCalledWith(mockParams) // Original params unchanged
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors from ProjectsDao.getProjectInfo when status is Archived', async () => {
      const mockParams: IArchiveProjects = {
        projectId: 123,
        status: 'Archived' as IArchiveProjects['status'],
        userId: 456,
      }
      const mockError = new Error('Database error')

      ;(ProjectsDao.getProjectInfo as jest.Mock).mockRejectedValue(mockError)

      await expect(
        ProjectsController.updateProjectStatus(mockParams),
      ).rejects.toThrow('Database error')

      expect(ProjectsDao.getProjectInfo).toHaveBeenCalledWith(123)
      expect(ProjectsDao.updateProjectStatus).not.toHaveBeenCalled()
    })

    it('should handle errors from ProjectsDao.updateProjectStatus', async () => {
      const mockParams: IArchiveProjects = {
        projectId: 123,
        status: 'Archived' as IArchiveProjects['status'],
        userId: 456,
      }
      const mockProjectInfo = [{projectName: 'MyProject', status: 'Active'}]
      const mockError = new Error('Database error')

      ;(ProjectsDao.getProjectInfo as jest.Mock).mockResolvedValue(
        mockProjectInfo,
      )
      ;(ProjectsDao.updateProjectStatus as jest.Mock).mockRejectedValue(
        mockError,
      )

      await expect(
        ProjectsController.updateProjectStatus(mockParams),
      ).rejects.toThrow('Database error')

      expect(ProjectsDao.getProjectInfo).toHaveBeenCalledWith(123)
      expect(ProjectsDao.updateProjectStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: 123,
          status: 'Archived',
          userId: 456,
          projectName: expect.stringMatching(
            /^MyProject_\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
          ),
        }),
      )
    })
  })
})
