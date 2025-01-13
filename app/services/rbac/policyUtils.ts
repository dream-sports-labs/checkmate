import UsersController from '@controllers/users.controller'
import {generateRbacPolicy} from './rbacPolicyGeneration'

export async function loadPolicies() {
  return generateRbacPolicy()
}

export async function loadRoles() {
  return UsersController.getUsersRoles()
}
