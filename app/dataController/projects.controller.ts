import ProjectsDao from '~/db/dao/projects.dao'

export interface ICreateProject {
  projectName: string
  projectDescription?: string
  orgId: number
  createdBy: number
}

export interface IEditProject {
  projectName: string
  projectDescription?: string
  projectId: number
  userId: number
}

export interface IGetAllProjects {
  orgId: number
  page: number
  pageSize: number
  status?: 'Active' | 'Archived' | 'Deleted'
  textSearch?: String
  projectDescription?: string
}
export interface IArchiveProjects {
  projectId: number
  status: 'Active' | 'Archived' | 'Deleted'
  userId: number
  projectName?: string
}

const ProjectsController = {
  getAllProjects: (params: IGetAllProjects) => ProjectsDao.getAll(params),
  getProjectInfo: (projectId: number) => ProjectsDao.getProjectInfo(projectId),
  createProject: (params: ICreateProject) => ProjectsDao.createProject(params),
  editProject: (params: IEditProject) => ProjectsDao.editProject(params),
  updateProjectStatus: async (params: IArchiveProjects) => {
    const {projectId, status} = params
    if (status === 'Archived') {
      const projectInfo = await ProjectsDao.getProjectInfo(projectId)
      const project = projectInfo?.[0]
      const projectName = project?.projectName
      if (!project || !projectName) {
        return Promise.reject({
          projectId: projectId,
          reason: 'Project not found',
        })
      }
      const timestamp = new Date().toISOString()
      const updatedName = `${projectName}_${timestamp}`
      return ProjectsDao.updateProjectStatus({
        ...params,
        projectName: updatedName,
      })
    } else {
      return ProjectsDao.updateProjectStatus(params)
    }
  },
}

export default ProjectsController
