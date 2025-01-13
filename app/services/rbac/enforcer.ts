import {newEnforcer} from 'casbin'
import {DrizzleAdapter} from '@services/rbac/adapter'

class EnforcerManager {
  private enforcer?: any

  async initializeEnforcer(reload?: boolean): Promise<any> {
    if (!this.enforcer || reload) {
      const adapter = new DrizzleAdapter()
      this.enforcer = await newEnforcer(
        process.cwd() + '/app/services/rbac/model.conf',
        adapter,
      )
      await this.enforcer.loadPolicy()
    }
    return this.enforcer
  }

  async getEnforcer(reload?: boolean): Promise<any> {
    return this.initializeEnforcer(reload)
  }
}

const enforcerManager = new EnforcerManager()

export async function getEnforcer(reload?: boolean): Promise<any> {
  return enforcerManager.getEnforcer(reload)
}
