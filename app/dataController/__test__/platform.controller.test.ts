import PlatformController from '../platform.controller';
import PlatformDao from '@dao/platform.dao';

jest.mock('@dao/platform.dao');

describe('PlatformController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all platforms for a given organisation', async () => {
    const mockPlatforms = [{ id: 1, name: 'Platform1' }, { id: 2, name: 'Platform2' }];
    (PlatformDao.getAllPlatform as jest.Mock).mockResolvedValue(mockPlatforms);

    const param = { projectId: 1 };
    const result = await PlatformController.getAllPlatform(param);

    expect(result).toEqual(mockPlatforms);
    expect(PlatformDao.getAllPlatform).toHaveBeenCalledWith(param);
    expect(PlatformDao.getAllPlatform).toHaveBeenCalledTimes(1);
  });
});
