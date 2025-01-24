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
  getAllPlatform: async ({orgId}: IGetAllPlatform) => {
    try {
      return await dbClient
        .select()
        .from(platform)
        .where(eq(platform.orgId, orgId))
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
      return await dbClient.insert(platform).values(param)
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
