import {UserRoleStore} from '~/services/rbac/userRoleStore'

describe('UserRoleStore', () => {
  let userRoleStore: UserRoleStore

  beforeEach(() => {
    userRoleStore = UserRoleStore.getInstance()
    // Clear the internal data for isolated tests
    ;(userRoleStore as any).userRoles = new Set()
    ;(userRoleStore as any).userIds = new Set()
  })

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = UserRoleStore.getInstance()
      const instance2 = UserRoleStore.getInstance()

      expect(instance1).toBe(instance2)
    })
  })

  describe('addUserRole', () => {
    it('should add a user role to the store', () => {
      userRoleStore.addUserRole(1, 'admin')

      const hasRole = userRoleStore.hasUserRole(1, 'admin')
      expect(hasRole).toBe(true)
    })

    it('should add the user ID to the store', () => {
      userRoleStore.addUserRole(1, 'admin')

      const hasUserId = userRoleStore.hasUserId(1)
      expect(hasUserId).toBe(true)
    })

    it('should not duplicate user roles', () => {
      userRoleStore.addUserRole(1, 'admin')
      userRoleStore.addUserRole(1, 'admin')

      expect(userRoleStore.hasUserRole(1, 'admin')).toBe(true)
      expect((userRoleStore as any).userRoles.size).toBe(1)
    })

    it('should allow multiple roles for the same user', () => {
      userRoleStore.addUserRole(1, 'admin')
      userRoleStore.addUserRole(1, 'user')

      expect(userRoleStore.hasUserRole(1, 'admin')).toBe(true)
      expect(userRoleStore.hasUserRole(1, 'user')).toBe(true)
      expect((userRoleStore as any).userRoles.size).toBe(2)
    })
  })

  describe('hasUserRole', () => {
    it('should return true if the user has the role', () => {
      userRoleStore.addUserRole(1, 'admin')

      const hasRole = userRoleStore.hasUserRole(1, 'admin')
      expect(hasRole).toBe(true)
    })

    it('should return false if the user does not have the role', () => {
      const hasRole = userRoleStore.hasUserRole(1, 'admin')
      expect(hasRole).toBe(false)
    })
  })

  describe('hasUserId', () => {
    it('should return true if the user ID exists', () => {
      userRoleStore.addUserRole(1, 'admin')

      const hasUserId = userRoleStore.hasUserId(1)
      expect(hasUserId).toBe(true)
    })

    it('should return false if the user ID does not exist', () => {
      const hasUserId = userRoleStore.hasUserId(1)
      expect(hasUserId).toBe(false)
    })
  })
})
