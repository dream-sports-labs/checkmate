import {DrizzleAdapter} from '@services/rbac/adapter'
import {loadPolicies, loadRoles} from '@services/rbac/policyUtils'
import {UserRoleStore} from '~/services/rbac/userRoleStore'
import {AccessType} from '~/routes/utilities/api'

jest.mock('@services/rbac/policyUtils')
jest.mock('~/services/rbac/userRoleStore')

describe('DrizzleAdapter', () => {
  let adapter: DrizzleAdapter
  let mockModel: any

  beforeEach(() => {
    jest.clearAllMocks()

    adapter = new DrizzleAdapter()

    mockModel = {
      model: new Map([
        ['p', new Map([['p', {policy: []}]])],
        ['g', new Map([['g', {policy: []}]])],
      ]),
    }
    ;(UserRoleStore.getInstance as jest.Mock).mockReturnValue({
      addUserRole: jest.fn(),
    })
  })

  describe('loadPolicy', () => {
    it('should load policies and roles into the model', async () => {
      const mockPolicies = [
        {role: 'admin', resource: 'resource1', action: 'read'},
        {role: 'user', resource: 'resource2', action: 'write'},
      ]
      const mockRoles = [
        {userId: 'user1', role: 'admin'},
        {userId: 'user2', role: 'user'},
      ]

      ;(loadPolicies as jest.Mock).mockResolvedValue(mockPolicies)
      ;(loadRoles as jest.Mock).mockResolvedValue(mockRoles)

      await adapter.loadPolicy(mockModel)

      expect(mockModel.model.get('p').get('p').policy).toEqual([
        ['admin', 'resource1', 'read'],
        ['user', 'resource2', 'write'],
      ])

      expect(mockModel.model.get('g').get('g').policy).toEqual([
        ['user1', 'admin'],
        ['user2', 'user'],
        [AccessType.ADMIN, AccessType.USER],
        [AccessType.ADMIN, AccessType.READER],
        [AccessType.USER, AccessType.READER],
      ])

      const userRoleStore = UserRoleStore.getInstance()
      expect(userRoleStore.addUserRole).toHaveBeenCalledWith('user1', 'admin')
      expect(userRoleStore.addUserRole).toHaveBeenCalledWith('user2', 'user')
    })

    it('should handle empty policies and roles gracefully', async () => {
      ;(loadPolicies as jest.Mock).mockResolvedValue([])
      ;(loadRoles as jest.Mock).mockResolvedValue([])

      await adapter.loadPolicy(mockModel)

      expect(mockModel.model.get('p').get('p').policy).toEqual([])
      expect(mockModel.model.get('g').get('g').policy).toEqual([
        [AccessType.ADMIN, AccessType.USER],
        [AccessType.ADMIN, AccessType.READER],
        [AccessType.USER, AccessType.READER],
      ])
    })
  })

  describe('loadPolicyLine', () => {
    it('should add a policy line to the correct section in the model', () => {
      const line = 'p, admin, resource1, read'

      adapter.loadPolicyLine(line, mockModel)

      expect(mockModel.model.get('p').get('p').policy).toEqual([
        ['admin', 'resource1', 'read'],
      ])
    })

    it('should add a role line to the correct section in the model', () => {
      const line = 'g, user1, admin'

      adapter.loadPolicyLine(line, mockModel)

      expect(mockModel.model.get('g').get('g').policy).toEqual([
        ['user1', 'admin'],
      ])
    })
  })
})
