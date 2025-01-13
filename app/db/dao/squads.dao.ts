import {
  IAddSquad,
  IAddSquads,
  IGetAllSquads,
  IGetSquadIdByName,
} from '@controllers/squads.controller'
import {and, eq} from 'drizzle-orm'
import {logger, LogType} from '~/utils/logger'
import {dbClient} from '../client'
import {squads} from '../schema/squads'
import {errorHandling} from './utils'

const SquadsDao = {
  getAllSquads: async ({projectId}: IGetAllSquads) => {
    try {
      const data = await dbClient
        .select({
          squadId: squads.squadId,
          squadName: squads.squadName,
          projectId: squads.projectId,
          createdOn: squads.createdOn,
          createdBy: squads.createdBy,
        })
        .from(squads)
        .where(eq(squads.projectId, projectId))
      return data
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

  getSquadIdByName: async (param: IGetSquadIdByName) => {
    try {
      const data = await dbClient
        .select({
          squadId: squads.squadId,
          squadName: squads.squadName,
          projectId: squads.projectId,
          createdOn: squads.createdOn,
          createdBy: squads.createdBy,
        })
        .from(squads)
        .where(
          and(
            eq(squads.squadName, param.squadName),
            eq(squads.projectId, param.projectId),
          ),
        )
      return data
    } catch (error: any) {
      // FOR DEV PURPOSE
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while adding squad',
        message: error,
      })
      errorHandling(error)
    }
  },

  addSquad: async ({squadName, projectId, createdBy}: IAddSquad) => {
    try {
      const data = await dbClient.insert(squads).values({
        squadName: squadName.trim(),
        projectId,
        createdBy,
      })
      return {
        squadId: data[0]?.insertId,
        squadName,
        projectId,
      }
    } catch (error: any) {
      // FOR DEV PURPOSE
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while adding squad',
        message: error,
      })
      errorHandling(error)
    }
  },
  addSquads: async (params: IAddSquads) => {
    try {
      const insertData = params.squads.map((squad) => ({
        squadName: squad?.trim(),
        projectId: params.projectId,
        createdBy: params.createdBy,
      }))

      const data = await dbClient.insert(squads).values(insertData)
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

export default SquadsDao
