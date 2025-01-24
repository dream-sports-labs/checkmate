import PlatformDao from '@dao/platform.dao'

export interface IGetAllPlatform {
  orgId: number
}
export interface ICreatePlatform {
  platformName: string
  createdBy: number
  orgId: number
}

const PlatformController = {
  getAllPlatform: (param: IGetAllPlatform) => PlatformDao.getAllPlatform(param),
  createPlatform: (param: ICreatePlatform) => PlatformDao.createPlatform(param),
}

export default PlatformController
