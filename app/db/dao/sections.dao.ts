import {logger, LogType} from '~/utils/logger'
import {dbClient} from '../client'
import {and, eq, inArray} from 'drizzle-orm/sql'
import {errorHandling} from './utils'
import {sections, tests} from '../schema/tests'
import {
  IAddSection,
  IEditSection,
  IGetAllSections,
  IGetSectionIdByHierarcy,
} from '@controllers/sections.controller'
import {runs, testRunMap} from '@schema/runs'

const SectionsDao = {
  getAllSections: async ({projectId, runId}: IGetAllSections) => {
    try {
      if (!runId) {
        const data = await dbClient
          .select()
          .from(sections)
          .where(eq(sections.projectId, projectId))

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

      if (data?.length > 1)
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
