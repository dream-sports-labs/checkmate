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
}

const ProjectsController = {
  getAllProjects: (params: IGetAllProjects) => ProjectsDao.getAll(params),
  getProjectInfo: (projectId: number) => ProjectsDao.getProjectInfo(projectId),
  createProject: (params: ICreateProject) => ProjectsDao.createProject(params),
  editProject: (params: IEditProject) => ProjectsDao.editProject(params),
  updateProjectStatus: (params: IArchiveProjects) =>
    ProjectsDao.updateProjectStatus(params),
}

export default ProjectsController
