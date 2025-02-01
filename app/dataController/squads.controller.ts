import SquadsDao from '~/db/dao/squads.dao'

export interface IGetSquadIdByName {
  squadName: string
  projectId: number
}

export interface IGetAllSquads {
  projectId: number
}
export interface IAddSquad {
  squadName: string
  projectId: number
  createdBy: number
}

export interface ICheckAndCreateSquad {
  squadName: string
  projectId: number
  createdBy: number
}
export interface IAddSquads {
  squads: string[]
  projectId: number
  createdBy: number
}

type SquadResult =
  | {
      squadId: number
      squadName: string
      projectId: number
      createdOn?: Date
      createdBy?: number | null
    }
  | undefined

const SquadsController = {
  getAllSquads: (param: IGetAllSquads) => SquadsDao.getAllSquads(param),
  getSquadIdByName: (param: IGetSquadIdByName) =>
    SquadsDao.getSquadIdByName(param),
  addSquad: (param: IAddSquad) => SquadsDao.addSquad(param),

  // check if squad exists, if not create a new squad
  checkAndCreateSquad: async (
    param: ICheckAndCreateSquad,
  ): Promise<SquadResult> => {
    if (!param.squadName)
      return Promise.reject({
        squadName: param.squadName,
        reason: 'Squad name is required',
      })

    // check if squad exists
    const squad = await SquadsDao.getSquadIdByName(param)
    if (squad && squad.length > 0) {
      return squad?.[0] ?? squad
    } else {
      // if not create a new squad
      const addSquad = await SquadsDao.addSquad(param)
      return addSquad
    }
  },
  addMulitpleSquads: async (param: IAddSquads) => {
    const {squads, projectId, createdBy} = param

    const results = await Promise.allSettled(
      squads.map((squadName) =>
        SquadsController.checkAndCreateSquad({squadName, projectId, createdBy}),
      ),
    )

    const success = results
      .filter((result) => result?.status === 'fulfilled')
      .map((result) => result?.value)

    const failed = results
      .filter((result) => result?.status === 'rejected')
      .map((result) => result?.reason)

    return {success, failed}
  },
}

export default SquadsController
