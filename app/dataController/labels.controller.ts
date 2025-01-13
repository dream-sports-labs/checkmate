import LabelsDao from '~/db/dao/labels.dao'

export interface IGetAllLables {
  projectId: number
  minData?: boolean
}

export interface IAddLabel {
  testIds: number[]
  labelId: number
  projectId: number
  createdBy: number
}

export interface IAddLabels {
  labels: string[]
  projectId: number
  createdBy: number
}

const LabelsController = {
  getAllLabels: (param: IGetAllLables) => LabelsDao.getAllLabels(param),
  getSystemLabels: (projectId: number) => LabelsDao.getSystemLabels(projectId),
  getCustomLabels: (projectId: number) => LabelsDao.getCustomLabels(projectId),
  addLabelTestMap: (param: IAddLabel) => LabelsDao.addLabelTestMap(param),
  addLabels: (param: IAddLabels) => LabelsDao.addLabels(param),
}

export default LabelsController
LabelsDao
