import AutomationStatusDao from '@dao/automationStatus.dao'

export interface IGetAllAutomationStatus {
  orgId: number
}

const AutomationStatusController = {
  getAllAutomationStatus: (param: IGetAllAutomationStatus) =>
    AutomationStatusDao.getAllAutomationStatus(param),
}

export default AutomationStatusController
