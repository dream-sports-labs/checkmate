import {isUserAllowedToAccess} from '../isAllowedToAccess'
import {getEnforcer} from '@services/rbac/enforcer'
import {UserRoleStore} from '@services/rbac/userRoleStore'

jest.mock('@services/rbac/enforcer')

describe('isUserAllowedToAccess', () => {
  const mockEnforce = jest.fn()
  const mockGetEnforcer = getEnforcer as jest.Mock
  let mockUserRoleStore: jest.Mocked<UserRoleStore>

  beforeEach(() => {
    jest.clearAllMocks()

    mockUserRoleStore = Object.create(UserRoleStore.prototype)
    mockUserRoleStore.addUserRole = jest.fn()
    mockUserRoleStore.hasUserRole = jest.fn()
    mockUserRoleStore.hasUserId = jest.fn()

    jest.spyOn(UserRoleStore, 'getInstance').mockReturnValue(mockUserRoleStore)

    mockGetEnforcer.mockResolvedValue({enforce: mockEnforce})
  })

  it('should return true when access is allowed with role check', async () => {
    mockUserRoleStore.hasUserRole.mockReturnValue(true)
    mockEnforce.mockResolvedValue(true)

    const result = await isUserAllowedToAccess({
      resource: 'some/resource',
      action: 'read',
      userId: 1,
      role: 'admin',
    })

    expect(mockGetEnforcer).toHaveBeenCalledTimes(1)
    expect(mockEnforce).toHaveBeenCalledWith(1, 'some/resource', 'read')
    expect(mockUserRoleStore.hasUserRole).toHaveBeenCalledWith(1, 'admin')
    expect(result).toBe(true)
  })

  it('should return true when access is allowed without role check', async () => {
    mockUserRoleStore.hasUserId.mockReturnValue(true)
    mockEnforce.mockResolvedValue(true)

    const result = await isUserAllowedToAccess({
      resource: 'some/resource',
      action: 'read',
      userId: 2,
    })

    expect(mockGetEnforcer).toHaveBeenCalledTimes(1)
    expect(mockEnforce).toHaveBeenCalledWith(2, 'some/resource', 'read')
    expect(mockUserRoleStore.hasUserId).toHaveBeenCalledWith(2)
    expect(result).toBe(true)
  })

  it('should call getEnforcer with true when user role is not found', async () => {
    mockUserRoleStore.hasUserRole.mockReturnValue(false)
    mockGetEnforcer.mockResolvedValueOnce({enforce: mockEnforce})
    mockEnforce.mockResolvedValue(false)

    const result = await isUserAllowedToAccess({
      resource: 'some/resource',
      action: 'write',
      userId: 3,
      role: 'editor',
    })

    expect(mockGetEnforcer).toHaveBeenCalledTimes(2)
    expect(mockEnforce).toHaveBeenCalledWith(3, 'some/resource', 'write')
    expect(mockUserRoleStore.hasUserRole).toHaveBeenCalledWith(3, 'editor')
    expect(result).toBe(false)
  })

  it('should call getEnforcer with true when user ID is not found', async () => {
    mockUserRoleStore.hasUserId.mockReturnValue(false)
    mockGetEnforcer.mockResolvedValueOnce({enforce: mockEnforce})
    mockEnforce.mockResolvedValue(false)

    const result = await isUserAllowedToAccess({
      resource: 'some/resource',
      action: 'delete',
      userId: 4,
    })

    expect(mockGetEnforcer).toHaveBeenCalledTimes(2)
    expect(mockEnforce).toHaveBeenCalledWith(4, 'some/resource', 'delete')
    expect(mockUserRoleStore.hasUserId).toHaveBeenCalledWith(4)
    expect(result).toBe(false)
  })

  it('should handle errors from the enforcer', async () => {
    mockEnforce.mockRejectedValue(new Error('Enforcer error'))
    mockUserRoleStore.hasUserId.mockReturnValue(true)

    await expect(
      isUserAllowedToAccess({
        resource: 'some/resource',
        action: 'update',
        userId: 5,
      }),
    ).rejects.toThrow('Enforcer error')

    expect(mockGetEnforcer).toHaveBeenCalledTimes(1)
    expect(mockEnforce).toHaveBeenCalledWith(5, 'some/resource', 'update')
  })
})
