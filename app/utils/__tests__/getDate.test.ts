import {
  getFormatedDate,
  getDateDetail,
  shortDate,
  shortDate2,
} from '~/utils/getDate'

describe('Date Formatting Utilities', () => {
  const mockDate = new Date('2023-12-25T10:15:30')

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(mockDate)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('getFormatedDate', () => {
    it('should format the provided date correctly', () => {
      expect(getFormatedDate(mockDate)).toBe('December 25th 2023, 10:15 AM')
    })

    it('should format the current date correctly if no date is provided', () => {
      expect(getFormatedDate()).toBe('December 25th 2023, 10:15 AM')
    })
  })

  describe('getDateDetail', () => {
    it('should return the detailed date for the provided date', () => {
      expect(getDateDetail(mockDate)).toBe('December 25th 2023')
    })

    it('should return the detailed date for the current date if no date is provided', () => {
      expect(getDateDetail()).toBe('December 25th 2023')
    })
  })

  describe('shortDate', () => {
    it('should return the short date format for the provided date', () => {
      expect(shortDate(mockDate)).toBe('10:15 25/12')
    })

    it('should return the short date format for the current date if no date is provided', () => {
      expect(shortDate()).toBe('10:15 25/12')
    })
  })

  describe('shortDate2', () => {
    it('should return the alternative short date format for the provided date', () => {
      expect(shortDate2(mockDate)).toBe('10:15 AM, 25 Dec 23')
    })

    it('should return the alternative short date format for the current date if no date is provided', () => {
      expect(shortDate2()).toBe('10:15 AM, 25 Dec 23')
    })
  })
})
