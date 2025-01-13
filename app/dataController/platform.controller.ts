import PlatformDao from '@dao/platform.dao'

export interface IGetAllPlatform {
  orgId: number
}

const PlatformController = {
  getAllPlatform: (param: IGetAllPlatform) => PlatformDao.getAllPlatform(param),
}

export default PlatformController
