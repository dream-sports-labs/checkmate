import {
  IAddSection,
  IEditSection,
  IGetAllSections,
  IGetSectionIdByHierarcy,
} from '@controllers/sections.controller'
import {testRunMap} from '@schema/runs'
import {and, eq, inArray} from 'drizzle-orm/sql'
import {logger, LogType} from '~/utils/logger'
import {dbClient} from '../client'
import {sections, tests} from '../schema/tests'
import {errorHandling} from './utils'

const SectionsDao = {
  getAllSections: async ({projectId, runId}: IGetAllSections) => {
    try {
      const whereClauses = []

      if (projectId) {
        whereClauses.push(eq(sections.projectId, projectId))
      }

      if (!runId) {
        const data = await dbClient
          .select()
          .from(sections)
          .where(and(...whereClauses))

        return data
      } else {
        const sectionIds = await dbClient
          .selectDistinct({sectionId: tests.sectionId})
          .from(testRunMap)
          .innerJoin(tests, eq(testRunMap.testId, tests.testId))
          .where(eq(testRunMap.runId, runId))

        const sectionIdList = sectionIds
          .map((row) => row.sectionId)
          .filter((sectionId) => sectionId !== null)

        if (sectionIdList.length === 0) return []

        const data = await dbClient
          .select()
          .from(sections)
          .where(inArray(sections.sectionId, sectionIdList as number[]))

        return data
      }
    } catch (error: any) {
      // FOR DEV PURPOSES
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while fetching sections',
        message: error,
      })
      errorHandling(error)
    }
  },

  getSectionIdByHierarcy: async (param: IGetSectionIdByHierarcy) => {
    try {
      const whereClauses: any[] = [
        eq(sections.sectionName, param.sectionName),
        eq(sections.projectId, param.projectId),
      ]

      if (param.parentId)
        whereClauses.push(eq(sections.parentId, param.parentId))

      const data = await dbClient
        .select({
          sectionId: sections.sectionId,
          sectionName: sections.sectionName,
          projectId: sections.projectId,
          parentId: sections.parentId,
        })
        .from(sections)
        .where(and(...whereClauses))

      if (data?.length > 1 || param.parentId === null)
        return data.filter((section) => section.parentId === param.parentId)

      return data
    } catch (error: any) {
      // FOR DEV PURPOSES
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while fetching section by name',
        message: error,
      })
      errorHandling(error)
    }
  },

  addSection: async ({
    sectionName,
    parentId,
    projectId,
    createdBy,
    sectionDescription,
  }: IAddSection) => {
    try {
      sectionName = sectionName.trim()
      if (sectionName === '') {
        throw new Error('Section name cannot be empty')
      }

      if (parentId === null) {
        const data = await dbClient
          .select()
          .from(sections)
          .where(
            and(
              eq(sections.sectionName, sectionName),
              eq(sections.projectId, projectId),
            ),
          )
        if (data.length > 0) {
          if (data.find((section) => section.parentId === null)) {
            throw new Error('Entry already exists')
          }
        }
      }

      const data = await dbClient.insert(sections).values({
        sectionName,
        projectId,
        createdBy,
        parentId,
        sectionDescription: sectionDescription ?? null,
      })

      return {
        sectionId: data[0]?.insertId,
        sectionName,
        parentId,
        projectId,
      }
    } catch (error: any) {
      // FOR DEV PURPOSE
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while adding section',
        message: error,
      })
      errorHandling(error)
    }
  },
  editSection: async (param: IEditSection) => {
    try {
      if (param.parentId === null) {
        if (!param.projectId) {
          throw new Error('Project id is required when parentId is null')
        }

        const resp = await dbClient
          .select()
          .from(sections)
          .where(
            and(
              eq(sections.sectionName, param.sectionName),
              eq(sections.projectId, param.projectId),
            ),
          )

        if (resp?.length > 0) {
          if (
            resp.find((section) => section.parentId === null) &&
            resp.find((section) => section.sectionName === param.sectionName)
          ) {
            throw new Error('Entry already exists')
          }
        }
      }

      if (param.parentId !== undefined) {
        const data = await dbClient
          .update(sections)
          .set({
            sectionName: param.sectionName,
            sectionDescription: param.sectionDescription,
            updatedBy: param.userId,
            parentId: param.parentId,
          })
          .where(eq(sections.sectionId, param.sectionId))

        return data
      }

      const data = await dbClient
        .update(sections)
        .set({
          sectionName: param.sectionName,
          sectionDescription: param.sectionDescription,
          updatedBy: param.userId,
        })
        .where(eq(sections.sectionId, param.sectionId))

      return data
    } catch (error: any) {
      // FOR DEV PURPOSE
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while editing section',
        message: error,
      })
      errorHandling(error)
    }
  },
}

export default SectionsDao
