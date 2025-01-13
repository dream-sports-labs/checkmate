import TypeDao from '~/db/dao/type.dao'

export interface IGetAllType {
  orgId: number
}

const TypeController = {
  getAllType: (param: IGetAllType) => TypeDao.getAllType(param),
}

export default TypeController
