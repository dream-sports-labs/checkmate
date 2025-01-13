import {IGetAllAutomationStatus} from '@controllers/automationStatus.controller'
import {automationStatus} from '@schema/tests'
import {eq} from 'drizzle-orm/sql'
import {logger, LogType} from '~/utils/logger'
import {dbClient} from '../client'
import {errorHandling} from './utils'

const AutomationStatusDao = {
  getAllAutomationStatus: async ({orgId}: IGetAllAutomationStatus) => {
    try {
      return await dbClient
        .select()
        .from(automationStatus)
        .where(eq(automationStatus.orgId, orgId))
    } catch (error: any) {
      // FOR DEV PURPOSES
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while fetching automation status',
        message: error,
      })
      errorHandling(error)
    }
  },
}

export default AutomationStatusDao
