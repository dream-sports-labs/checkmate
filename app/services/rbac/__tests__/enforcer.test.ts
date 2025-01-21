import {newEnforcer} from 'casbin'
import {DrizzleAdapter} from '@services/rbac/adapter'
import {getEnforcer} from '@services/rbac/enforcer' // Adjust the path as necessary

jest.mock('casbin', () => ({
  newEnforcer: jest.fn(),
}))
jest.mock('@services/rbac/adapter')

describe('EnforcerManager', () => {
  let mockEnforcer: any

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock the enforcer object
    mockEnforcer = {
      loadPolicy: jest.fn().mockResolvedValue(undefined),
    }

    ;(newEnforcer as jest.Mock).mockResolvedValue(mockEnforcer)
  })

  it('should initialize a new enforcer if not already initialized', async () => {
    const enforcer = await getEnforcer()

    // Verify newEnforcer is called with the correct arguments
    expect(newEnforcer).toHaveBeenCalledWith(
      expect.stringContaining('/app/services/rbac/model.conf'),
      expect.any(DrizzleAdapter),
    )

    // Verify loadPolicy is called on the enforcer
    expect(mockEnforcer.loadPolicy).toHaveBeenCalled()

    // Verify the returned enforcer is the same as the mock
    expect(enforcer).toBe(mockEnforcer)
  })

  it('should reload the enforcer if the reload flag is true', async () => {
    const enforcer = await getEnforcer(true)

    // Verify newEnforcer is called again
    expect(newEnforcer).toHaveBeenCalledTimes(1)
    expect(newEnforcer).toHaveBeenCalledWith(
      expect.stringContaining('/app/services/rbac/model.conf'),
      expect.any(DrizzleAdapter),
    )

    // Verify loadPolicy is called again
    expect(mockEnforcer.loadPolicy).toHaveBeenCalled()

    // Verify the returned enforcer is the same as the mock
    expect(enforcer).toBe(mockEnforcer)
  })

  it('should not reinitialize the enforcer if already initialized and reload is false', async () => {
    // Initialize the enforcer first
    await getEnforcer()
    const firstEnforcer = await getEnforcer()
    const secondEnforcer = await getEnforcer(false)

    
    // Verify the same enforcer instance is returned
    expect(secondEnforcer).toBe(firstEnforcer)
  })
})
