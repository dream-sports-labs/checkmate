import {newEnforcer} from 'casbin'
import {DrizzleAdapter} from '@services/rbac/adapter'
import {getEnforcer} from '@services/rbac/enforcer'

jest.mock('casbin', () => ({
  newEnforcer: jest.fn(),
}))
jest.mock('@services/rbac/adapter')

describe('EnforcerManager', () => {
  let mockEnforcer: any

  beforeEach(() => {
    jest.clearAllMocks()

    mockEnforcer = {
      loadPolicy: jest.fn().mockResolvedValue(undefined),
    }
    ;(newEnforcer as jest.Mock).mockResolvedValue(mockEnforcer)
  })

  it('should initialize a new enforcer if not already initialized', async () => {
    const enforcer = await getEnforcer()

    expect(newEnforcer).toHaveBeenCalledWith(
      expect.stringContaining('/app/services/rbac/model.conf'),
      expect.any(DrizzleAdapter),
    )

    expect(mockEnforcer.loadPolicy).toHaveBeenCalled()

    expect(enforcer).toBe(mockEnforcer)
  })

  it('should reload the enforcer if the reload flag is true', async () => {
    const enforcer = await getEnforcer(true)

    expect(newEnforcer).toHaveBeenCalledTimes(1)
    expect(newEnforcer).toHaveBeenCalledWith(
      expect.stringContaining('/app/services/rbac/model.conf'),
      expect.any(DrizzleAdapter),
    )

    expect(mockEnforcer.loadPolicy).toHaveBeenCalled()

    expect(enforcer).toBe(mockEnforcer)
  })

  it('should not reinitialize the enforcer if already initialized and reload is false', async () => {
    await getEnforcer()
    const firstEnforcer = await getEnforcer()
    const secondEnforcer = await getEnforcer(false)

    expect(secondEnforcer).toBe(firstEnforcer)
  })
})
