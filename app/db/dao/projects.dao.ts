import {eq, and, count, like, desc} from 'drizzle-orm/sql'
import {dbClient} from '../client'
import {projects} from '../schema/projects'
import {
  ICreateProject,
  IEditProject,
  IGetAllProjects,
  IArchiveProjects,
} from '~/dataController/projects.controller'
import {logger, LogType} from '~/utils/logger'
import {errorHandling} from './utils'
import {users} from '@schema/users'

const ProjectsDao = {
  getAll: async ({
    orgId,
    status = 'Active',
    page,
    pageSize,
    textSearch,
    projectDescription,
  }: IGetAllProjects) => {
    try {
      const whereClauses = [
        eq(projects.orgId, orgId),
        eq(projects.status, status),
      ]
      if (textSearch) {
        whereClauses.push(
          like(projects.projectName, `%${textSearch.toLowerCase()}%`),
        )
      }
      if (projectDescription) {
        whereClauses.push(
          like(
            projects.projectDescription,
            `%${projectDescription.toLowerCase()}%`,
          ),
        )
      }

      const projectsListQuery = dbClient
        .select({
          projectId: projects.projectId,
          createdByName: users.userName,
          projectName: projects.projectName,
          projectDescription: projects.projectDescription,
          orgId: projects.orgId,
          createdOn: projects.createdOn,
        })
        .from(projects)
        .leftJoin(users, eq(projects.createdBy, users.userId))
        .where(and(...whereClauses))
        .limit(pageSize)
        .orderBy(desc(projects.projectId))
        .offset((page - 1) * pageSize)

      const projectCountQuery = dbClient
        .select({count: count()})
        .from(projects)
        .where(and(...whereClauses))

      const [projectsList, projectCount] = await Promise.all([
        projectsListQuery.execute(),
        projectCountQuery.execute(),
      ])

      return {projectsList, projectCount}
    } catch (error) {
      console.error('Error fetching projects:', error)
      throw error
    }
  },
  getProjectInfo: (projectId: number) => {
    try {
      return dbClient
        .select()
        .from(projects)
        .where(eq(projects.projectId, projectId))
    } catch (error) {
      console.error('Error fetching project:', error)
      throw error
    }
  },
  createProject: async ({
    projectName,
    projectDescription,
    orgId,
    createdBy,
  }: ICreateProject) => {
    try {
      const project = await dbClient.insert(projects).values({
        projectName,
        orgId,
        createdBy,
        projectDescription,
      })
      return project
    } catch (error: any) {
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while creating Project',
        message: 'this is an error',
      })
      errorHandling(error)
    }
  },

  editProject: async ({
    projectId,
    projectName,
    projectDescription,
    userId,
  }: IEditProject) => {
    try {
      const updatedProject = await dbClient
        .update(projects)
        .set({
          projectName,
          projectDescription,
          updatedBy: userId,
        })
        .where(eq(projects.projectId, projectId))
      return updatedProject
    } catch (error: any) {
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while editing Project',
        message: error,
      })
      errorHandling(error)
    }
  },

  updateProjectStatus: async ({
    projectId,
    status,
    userId,
    updatedName,
  }: IArchiveProjects) => {
    try {
      if (status === 'Archived' && !updatedName) {
        throw new Error('Updated name is required for archiving the project')
      }
      const archiveProject = await dbClient
        .update(projects)
        .set({
          status,
          updatedBy: userId,
          ...(updatedName && {projectName: updatedName}),
        })
        .where(eq(projects.projectId, projectId))
      return archiveProject
    } catch (error: any) {
      errorHandling(error)
    }
  },
}

export default ProjectsDao
