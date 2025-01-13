import {TestStatusType} from '@controllers/types'
import {isValidStatus} from '@controllers/utils'

describe('isValidStatus', () => {
  it('should return true for a valid status', () => {
    const validStatus = Object.values(TestStatusType)[0]
    expect(isValidStatus(validStatus)).toBe(true)
  })

  it('should return false for an invalid status', () => {
    expect(isValidStatus('InProgresss')).toBe(false)
  })

  it('should return false for an empty string', () => {
    expect(isValidStatus('')).toBe(false)
  })

  it('should return false for a null value', () => {
    expect(isValidStatus(null as unknown as string)).toBe(false)
  })

  it('should return false for an undefined value', () => {
    expect(isValidStatus(undefined as unknown as string)).toBe(false)
  })
})
