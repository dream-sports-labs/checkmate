import {IGetAllPriority} from '@controllers/priority.controller'
import {priority} from '@schema/tests'
import {eq} from 'drizzle-orm/sql'
import {logger, LogType} from '~/utils/logger'
import {dbClient} from '../client'
import {errorHandling} from './utils'

const PriorityDao = {
  getAllPriority: async ({orgId}: IGetAllPriority) => {
    try {
      return await dbClient
        .select()
        .from(priority)
        .where(eq(priority.orgId, orgId))
    } catch (error: any) {
      // FOR DEV PURPOSES
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while fetching priority',
        message: error,
      })
      errorHandling(error)
    }
  },
}

export default PriorityDao
