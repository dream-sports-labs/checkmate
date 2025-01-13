import TestCoveredByDao from '@dao/testCoveredBy.dao'

export interface IGetAllTestCoveredBy {
  orgId: number
}

const TestCoveredByController = {
  getAllTestCoveredBy: (param: IGetAllTestCoveredBy) =>
    TestCoveredByDao.getAllTestCoveredBy(param),
}

export default TestCoveredByController
