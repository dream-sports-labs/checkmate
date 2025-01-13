import {z} from 'zod'
import {
  checkForValidId,
  jsonParseWithError,
  safeJsonParse,
  sqlErroMessage,
  zodErrorMessage,
} from '../utils'

describe('checkForValidId', () => {
  it('should return true for a valid number', () => {
    expect(checkForValidId(123)).toBe(true)
  })

  it('should return false for NaN', () => {
    expect(checkForValidId(NaN)).toBe(false)
  })

  it('should return false for null or undefined', () => {
    expect(checkForValidId(undefined)).toBe(false)
    expect(checkForValidId(undefined)).toBe(false)
  })

  it('should return false for invalid numbers', () => {
    expect(checkForValidId(0)).toBe(false)
  })
})

describe('safeJsonParse', () => {
  it('should parse valid JSON strings', () => {
    expect(safeJsonParse('{"key":"value"}')).toEqual({key: 'value'})
  })

  it('should return undefined for null or undefined input', () => {
    expect(safeJsonParse(null)).toBeUndefined()
    expect(safeJsonParse(undefined)).toBeUndefined()
  })

  it('should return undefined for invalid JSON strings', () => {
    expect(safeJsonParse('invalid json')).toBeUndefined()
  })
})

describe('jsonParseWithError', () => {
  it('should parse valid JSON strings', () => {
    expect(jsonParseWithError('{"key":"value"}')).toEqual({key: 'value'})
  })

  it('should throw an error for invalid JSON strings', () => {
    expect(() => jsonParseWithError('invalid json')).toThrow('Invalid JSON')
  })

  it('should include paramName in the error message if provided', () => {
    expect(() => jsonParseWithError('invalid json', 'paramName')).toThrow(
      'Invalid JSON paramName',
    )
  })
})

describe('sqlErroMessage', () => {
  it('should return "Entry Already Exists" for duplicate entry errors', () => {
    const error = {message: 'Duplicate entry'}
    expect(sqlErroMessage(error)).toBe('Entry Already Exists')
  })

  it('should return detailed error message for other errors', () => {
    const error = {message: 'Some error occurred', cause: 'Some cause'}
    expect(sqlErroMessage(error)).toBe('Some error occurred, cause: Some cause')
  })

  it('should return the error message if no cause is present', () => {
    const error = {message: 'Some error occurred'}
    expect(sqlErroMessage(error)).toBe('Some error occurred')
  })
})

describe('zodErrorMessage', () => {
  it('should return a formatted error message for Zod validation errors', () => {
    const schema = z.object({
      runId: z.number(),
      testIds: z.array(z.number()),
    })

    const invalidData = {
      runId: 'not_a_number',
      testIds: ['invalid_element'],
    }

    let error
    try {
      schema.parse(invalidData)
    } catch (e) {
      error = e
    }

    const expectedMessage =
      'Data validation error: runId: Expected number, received string, testIds.0: Expected number, received string'

    expect(zodErrorMessage(error)).toBe(expectedMessage)
  })

  it('should handle errors with nested paths', () => {
    const schema = z.object({
      config: z.object({
        retries: z.number(),
      }),
    })

    const invalidData = {
      config: {
        retries: 'not_a_number',
      },
    }

    let error
    try {
      schema.parse(invalidData)
    } catch (e) {
      error = e
    }

    const expectedMessage =
      'Data validation error: config.retries: Expected number, received string'

    expect(zodErrorMessage(error)).toBe(expectedMessage)
  })

  it('should handle errors for multiple fields', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    })

    const invalidData = {
      name: 123,
      age: 'not_a_number',
    }

    let error
    try {
      schema.parse(invalidData)
    } catch (e) {
      error = e
    }

    const expectedMessage =
      'Data validation error: name: Expected string, received number, age: Expected number, received string'

    expect(zodErrorMessage(error)).toBe(expectedMessage)
  })
})
