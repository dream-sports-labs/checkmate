import {IGetAllTestCoveredBy} from '@controllers/testCoveredBy.controller'
import {testCoveredBy} from '@schema/tests'
import {eq} from 'drizzle-orm/sql'
import {logger, LogType} from '~/utils/logger'
import {dbClient} from '../client'
import {errorHandling} from './utils'

const TestCoveredByDao = {
  getAllTestCoveredBy: async ({orgId}: IGetAllTestCoveredBy) => {
    try {
      return await dbClient
        .select()
        .from(testCoveredBy)
        .where(eq(testCoveredBy.orgId, orgId))
    } catch (error: any) {
      // FOR DEV PURPOSES
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while fetching testCoveredBy',
        message: error,
      })
      errorHandling(error)
    }
  },
}

export default TestCoveredByDao
