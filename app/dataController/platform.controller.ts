import PlatformDao from '@dao/platform.dao'

export interface IGetAllPlatform {
  orgId: number
}
export interface ICreatePlatform {
  platformNames: string[]
  createdBy: number
  projectId?: null | number
  orgId: number
}

const PlatformController = {
  getAllPlatform: (param: IGetAllPlatform) => PlatformDao.getAllPlatform(param),
  createPlatform: (param: ICreatePlatform) => PlatformDao.createPlatform(param),
}

export default PlatformController
