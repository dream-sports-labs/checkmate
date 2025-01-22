import TestCoveredByController from '../testCoveredBy.controller';
import TestCoveredByDao from '@dao/testCoveredBy.dao';

jest.mock('@dao/testCoveredBy.dao');

describe('TestCoveredByController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all test covered by for a given organisation', async () => {
    const mockTestCoveredBy = [{ id: 1, name: 'Manual' }, { id: 2, name: 'Automated' }];
    (TestCoveredByDao.getAllTestCoveredBy as jest.Mock).mockResolvedValue(mockTestCoveredBy);

    const param = { orgId: 1 };
    const result = await TestCoveredByController.getAllTestCoveredBy(param);

    expect(result).toEqual(mockTestCoveredBy);
    expect(TestCoveredByDao.getAllTestCoveredBy).toHaveBeenCalledWith(param);
    expect(TestCoveredByDao.getAllTestCoveredBy).toHaveBeenCalledTimes(1);
  });
});
