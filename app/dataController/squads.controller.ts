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

const SquadsController = {
  getAllSquads: (param: IGetAllSquads) => SquadsDao.getAllSquads(param),
  getSquadIdByName: (param: IGetSquadIdByName) =>
    SquadsDao.getSquadIdByName(param),
  addSquad: (param: IAddSquad) => SquadsDao.addSquad(param),

  // check if squad exists, if not create a new squad
  checkAndCreateSquad: async (param: ICheckAndCreateSquad) => {
    // check if squad exists
    const squad = await SquadsDao.getSquadIdByName(param)
    if (squad && squad.length > 0) {
      return squad?.[0] ?? squad
    } else {
      // if not create a new squad
      const addSquad = SquadsDao.addSquad(param)
      return addSquad
    }
  },
  addSquads: (param: IAddSquads) => SquadsDao.addSquads(param),
}

export default SquadsController
