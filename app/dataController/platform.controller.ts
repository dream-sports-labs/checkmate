import PlatformDao from '@dao/platform.dao'

export interface IGetAllPlatform {
  projectId: number
}
export interface ICreatePlatform {
  platformNames: string[]
  createdBy: number
  projectId: number
}

const PlatformController = {
  getAllPlatform: (param: IGetAllPlatform) => PlatformDao.getAllPlatform(param),
  createPlatform: (param: ICreatePlatform) => PlatformDao.createPlatform(param),
}

export default PlatformController
