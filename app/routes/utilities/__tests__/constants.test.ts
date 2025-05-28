import {
  ORG_ID,
  MED_PAGE_SIZE,
  SMALL_PAGE_SIZE,
  LARGE_PAGE_SIZE,
  LOGOUT_ERROR_MESSAGE,
  ACCESS_ERROR_MESSAGE,
  TOKEN_DELETED_SUCCESSFULLY,
  TOKEN_GENERATED_SUCCESSFULLY,
  TOKEN_ALREADY_EXISTS,
  TOKEN_DELETION_UNSUCCESSFUL,
} from '../constants'

describe('Constants', () => {
  describe('Organization ID', () => {
    it('should have correct organization ID', () => {
      expect(ORG_ID).toBe(1)
    })
  })

  describe('Page Sizes', () => {
    it('should have correct page size values', () => {
      expect(SMALL_PAGE_SIZE).toBe(10)
      expect(MED_PAGE_SIZE).toBe(100)
      expect(LARGE_PAGE_SIZE).toBe(250)
    })

    it('should have page sizes in ascending order', () => {
      expect(SMALL_PAGE_SIZE).toBeLessThan(MED_PAGE_SIZE)
      expect(MED_PAGE_SIZE).toBeLessThan(LARGE_PAGE_SIZE)
    })
  })

  describe('Error Messages', () => {
    it('should have correct error messages', () => {
      expect(LOGOUT_ERROR_MESSAGE).toBe('Authentication Error')
      expect(ACCESS_ERROR_MESSAGE).toBe('You are not authorized to perform this action')
    })
  })

  describe('Token Messages', () => {
    it('should have correct token-related messages', () => {
      expect(TOKEN_DELETED_SUCCESSFULLY).toBe('Token deleted successfully')
      expect(TOKEN_GENERATED_SUCCESSFULLY).toBe('Token generated successfully')
      expect(TOKEN_ALREADY_EXISTS).toBe('Token already exists')
      expect(TOKEN_DELETION_UNSUCCESSFUL).toBe('Token deletion unsuccessful')
    })
  })
}) 