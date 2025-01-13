import {getEnforcer} from '@services/rbac/enforcer'
import {UserRoleStore} from '@services/rbac/userRoleStore'

export const isUserAllowedToAccess = async ({
  resource,
  action,
  userId,
  role,
}: {
  resource: string
  action: string
  userId: number
  role?: string
}) => {
  let enforcer = await getEnforcer()
  const userRoleStore = UserRoleStore.getInstance()

  if (role) {
    if (!userRoleStore.hasUserRole(userId, role)) {
      enforcer = await getEnforcer(true)
    }
  } else if (!userRoleStore.hasUserId(userId)) {
    enforcer = await getEnforcer(true)
  }

  return await enforcer.enforce(userId, resource, action)
}
