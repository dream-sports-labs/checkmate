import {
  ICreatePlatform,
  IGetAllPlatform,
} from '@controllers/platform.controller'
import {platform} from '@schema/tests'
import {eq} from 'drizzle-orm/sql'
import {logger, LogType} from '~/utils/logger'
import {dbClient} from '../client'
import {errorHandling} from './utils'

const PlatformDao = {
  getAllPlatform: async ({projectId}: IGetAllPlatform) => {
    try {
      return await dbClient
        .select()
        .from(platform)
        .where(eq(platform.projectId, projectId))
    } catch (error: any) {
      // FOR DEV PURPOSES
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while fetching platforms',
        message: error,
      })
      errorHandling(error)
    }
  },
  createPlatform: async (param: ICreatePlatform) => {

    try {
      const insertData = param.platformNames.map((platformName) => ({
        platformName: platformName?.trim(),
        projectId: param.projectId,
        createdBy: param.createdBy,
      }))
      const data = await dbClient.insert(platform).values(insertData)
      return data
    } catch (error: any) {
      // FOR DEV PURPOSES
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while creating platform',
        message: error,
      })
      errorHandling(error)
    }
  },
}

export default PlatformDao
