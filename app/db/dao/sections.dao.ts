import {logger, LogType} from '~/utils/logger'
import {dbClient} from '../client'
import {and, eq, inArray} from 'drizzle-orm/sql'
import {errorHandling} from './utils'
import {sections, tests} from '../schema/tests'
import {
  IAddSection,
  IGetAllSections,
  IGetSectionIdByNameAndHierarcy,
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

  getSectionIdByNameAndHierarcy: async (
    param: IGetSectionIdByNameAndHierarcy,
  ) => {
    try {
      const data = await dbClient
        .select({
          sectionId: sections.sectionId,
          sectionName: sections.sectionName,
          projectId: sections.projectId,
          sectionHierarchy: sections.sectionHierarchy,
        })
        .from(sections)
        .where(
          and(
            eq(sections.sectionName, param.sectionName),
            eq(sections.sectionHierarchy, param.sectionHierarchy),
            eq(sections.projectId, param.projectId),
          ),
        )

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
    sectionHierarchy,
    projectId,
    createdBy,
    sectionDescription,
  }: IAddSection) => {
    try {
      sectionName = sectionName.trim()
      if (sectionName === '' || sectionHierarchy === '') {
        throw new Error('Section name or hierarchy cannot be empty')
      }
      if (sectionName !== sectionHierarchy.split('>').pop()?.trim()) {
        throw new Error('Section name and hierarchy do not match')
      }

      const data = await dbClient.insert(sections).values({
        sectionName,
        sectionHierarchy: sectionHierarchy.trim(),
        projectId,
        createdBy,
        sectionDescription: sectionDescription ?? null,
        sectionDepth: sectionHierarchy.split('>').length - 1,
      })

      return {
        sectionId: data[0]?.insertId,
        sectionName,
        sectionHierarchy,
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
}

export default SectionsDao
