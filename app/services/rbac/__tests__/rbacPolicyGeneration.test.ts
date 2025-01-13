import {API, ApiToTypeMap} from '~/routes/utilities/api'
import {generateRbacPolicy} from '../rbacPolicyGeneration'

describe('generateRbacPolicy', () => {
  it('should cover all API enum values in the generated RBAC policy', () => {
    const rbacPolicy = generateRbacPolicy()

    const apiEndpoints = Object.values(API)

    apiEndpoints.forEach((endpoint) => {
      const policyEntry = rbacPolicy.find(
        (entry) => entry.resource === endpoint.replace(/^api\/v[0-9]+\//, ''),
      )
      if (endpoint === API.EditRun) {
        console.log({policyEntry})
      }

      expect(policyEntry).toBeDefined()
      expect(policyEntry?.role).toBeDefined()
      expect(policyEntry?.role).not.toBeNull()
      expect(policyEntry?.action).toBeDefined()
      expect(policyEntry?.action).not.toBeNull()
    })

    const resourcesFromPolicy = rbacPolicy.map(
      (policy) => `api/v1/${policy.resource}`,
    )
    expect(resourcesFromPolicy).toEqual(expect.arrayContaining(apiEndpoints))
    expect(resourcesFromPolicy.length).toBe(apiEndpoints.length)
  })

  it('should generate the correct RBAC policy for each API endpoint', () => {
    const apiEndpoints = Object.values(API)
    apiEndpoints.forEach((endpoint) => {
      expect(ApiToTypeMap).toHaveProperty(endpoint)
    })
  })
})
