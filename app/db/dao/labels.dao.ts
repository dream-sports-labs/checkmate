import {
  IAddLabel,
  IAddLabels,
  IGetAllLables,
} from '@controllers/labels.controller'
import {dbClient} from '../client'
import {labels, labelTestMap} from '../schema/labels'
import {eq, and} from 'drizzle-orm'
import {logger, LogType} from '~/utils/logger'
import {errorHandling} from './utils'

const LabelsDao = {
  getAllLabels: async ({projectId, minData}: IGetAllLables) => {
    try {
      if (minData) {
        return await dbClient
          .select({
            labelId: labels.labelId,
            labelName: labels.labelName,
            labelType: labels.labelType,
          })
          .from(labels)
          .where(eq(labels.projectId, projectId))
      }
      return await dbClient
        .select()
        .from(labels)
        .where(eq(labels.projectId, projectId))
    } catch (error: any) {
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Fetching tests',
        message: `${error.message}  ${error.cause}`,
      })
      errorHandling(error)
    }
  },
  getSystemLabels: async (projectId: number) => {
    return dbClient
      .select()
      .from(labels)
      .where(
        and(eq(labels.projectId, projectId), eq(labels.labelType, 'System')),
      )
  },
  getCustomLabels: async (projectId: number) => {
    return dbClient
      .select()
      .from(labels)
      .where(
        and(eq(labels.projectId, projectId), eq(labels.labelType, 'Custom')),
      )
  },
  addLabelTestMap: async (param: IAddLabel) => {
    try {
      const insertData = param.testIds.map((testId) => ({
        testId,
        labelId: param.labelId,
        projectId: param.projectId,
        createdBy: param.createdBy,
      }))
      const data = await dbClient.insert(labelTestMap).values(insertData)
      return data[0]
    } catch (error: any) {
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Adding label',
        message: `${error.message}  ${error.cause}`,
      })
      errorHandling(error)
    }
  },
  addLabels: async (params: IAddLabels) => {
    try {
      const insertData = params.labels.map((label) => ({
        labelName: label?.trim(),
        projectId: params.projectId,
        createdBy: params.createdBy,
      }))

      const data = await dbClient.insert(labels).values(insertData)
      return data
    } catch (error: any) {
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Adding labels',
        message: `${error.message}  ${error.cause}`,
      })
      errorHandling(error)
    }
  },
}

export default LabelsDao
