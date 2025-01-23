import {generateRbacPolicy} from '@services/rbac/rbacPolicyGeneration'
import UsersController from '@controllers/users.controller'
import {loadPolicies, loadRoles} from '@services/rbac/policyUtils'

jest.mock('@services/rbac/rbacPolicyGeneration')
jest.mock('@controllers/users.controller')

describe('Policy Utils', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('loadPolicies', () => {
    it('should return the generated RBAC policy', async () => {
      const mockPolicy = [
        {role: 'admin', resource: 'dashboard', action: 'read'},
        {role: 'user', resource: 'profile', action: 'write'},
      ]

      ;(generateRbacPolicy as jest.Mock).mockResolvedValue(mockPolicy)

      const result = await loadPolicies()

      expect(generateRbacPolicy).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockPolicy)
    })

    it('should handle errors during policy generation', async () => {
      const mockError = new Error('Failed to generate policies')

      ;(generateRbacPolicy as jest.Mock).mockRejectedValue(mockError)

      await expect(loadPolicies()).rejects.toThrow(
        'Failed to generate policies',
      )
      expect(generateRbacPolicy).toHaveBeenCalledTimes(1)
    })
  })

  describe('loadRoles', () => {
    it('should return the roles from UsersController', async () => {
      const mockRoles = [
        {userId: 1, role: 'admin'},
        {userId: 2, role: 'user'},
      ]

      ;(UsersController.getUsersRoles as jest.Mock).mockResolvedValue(mockRoles)

      const result = await loadRoles()

      expect(UsersController.getUsersRoles).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockRoles)
    })

    it('should handle errors during role fetching', async () => {
      const mockError = new Error('Failed to load roles')

      ;(UsersController.getUsersRoles as jest.Mock).mockRejectedValue(mockError)

      await expect(loadRoles()).rejects.toThrow('Failed to load roles')
      expect(UsersController.getUsersRoles).toHaveBeenCalledTimes(1)
    })
  })
})
