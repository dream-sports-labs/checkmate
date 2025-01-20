import PriorityController from '../priority.controller';
import PriorityDao from '@dao/priority.dao';

jest.mock('@dao/priority.dao');

describe('PriorityController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all priorities for a given organisation', async () => {
    const mockPriorities = [{ id: 1, name: 'Priority1' }, { id: 2, name: 'Priority2' }];
    (PriorityDao.getAllPriority as jest.Mock).mockResolvedValue(mockPriorities);

    const param = { orgId: 1 };
    const result = await PriorityController.getAllPriority(param);

    expect(result).toEqual(mockPriorities);
    expect(PriorityDao.getAllPriority).toHaveBeenCalledWith(param);
    expect(PriorityDao.getAllPriority).toHaveBeenCalledTimes(1);
  });
});
