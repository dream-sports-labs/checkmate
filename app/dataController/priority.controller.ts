import PriorityDao from '@dao/priority.dao'

export interface IGetAllPriority {
  orgId: number
}

const PriorityController = {
  getAllPriority: (param: IGetAllPriority) => PriorityDao.getAllPriority(param),
}

export default PriorityController
