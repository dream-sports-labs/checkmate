import {loadPolicies, loadRoles} from '@services/rbac/policyUtils'
import {Adapter} from 'casbin'
import {AccessType} from '~/routes/utilities/api'
import {UserRoleStore} from './userRoleStore'

export class DrizzleAdapter implements Adapter {
  async loadPolicy(model: any): Promise<void> {
    const policies = await loadPolicies()
    const roles = await loadRoles()
    const userRoleStore = UserRoleStore.getInstance()

    for (const policy of policies) {
      const policyLine = `p, ${policy.role}, ${policy.resource}, ${policy.action}`
      this.loadPolicyLine(policyLine, model)
    }

    if (roles)
      for (const role of roles) {
        const policyLine = `g, ${role.userId}, ${role.role}`
        this.loadPolicyLine(policyLine, model)
        userRoleStore.addUserRole(role.userId, role.role)
      }

    this.loadPolicyLine(`g, ${AccessType.ADMIN}, ${AccessType.USER}`, model)
    this.loadPolicyLine(`g, ${AccessType.ADMIN}, ${AccessType.READER}`, model)
    this.loadPolicyLine(`g, ${AccessType.USER}, ${AccessType.READER}`, model)
  }

  async addPolicy(sec: string, pType: string, rule: string[]): Promise<void> {}

  async removePolicy(
    sec: string,
    ptype: string,
    rule: string[],
  ): Promise<void> {}

  async savePolicy(model: any): Promise<boolean> {
    console.log('savePolicy is called but not implemented.')
    return true
  }

  // Empty implementation of removeFilteredPolicy (no functionality)
  async removeFilteredPolicy(
    sec: string,
    pType: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<void> {
    console.log('removeFilteredPolicy is called but not implemented.')
  }

  loadPolicyLine(line: string, model: any): void {
    const tokens = line.split(',').map((token) => token.trim())
    const pType = tokens[0]
    if (pType === 'p')
      model.model.get(pType).get('p').policy.push(tokens.slice(1))
    else model.model.get(pType).get('g').policy.push(tokens.slice(1))
  }
}
