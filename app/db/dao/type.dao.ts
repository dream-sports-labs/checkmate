import {dbClient} from '../client'
import {eq} from 'drizzle-orm'
import {type} from '@schema/tests'
import {IGetAllType} from '@controllers/type.controller'
import {logger, LogType} from '~/utils/logger'
import {errorHandling} from './utils'

const TypeDao = {
  getAllType: async ({orgId}: IGetAllType) => {
    try {
      return dbClient.select().from(type).where(eq(type.orgId, orgId))
    } catch (error: any) {
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while fetching sections',
        message: error,
      })
      errorHandling(error)
    }
  },
}

export default TypeDao
