import {errorHandling, generateToken, sortingFunction} from '@dao/utils'
import {SqlError} from '@services/ErrorTypes'
import {asc, desc} from 'drizzle-orm'
import {
  automationStatus,
  platform,
  priority,
  sections,
  tests,
} from '@schema/tests'
import { getForeignKeyConstraint } from '../utils'

jest.mock('../../../services/ErrorTypes')
jest.mock('uuid', () => ({
  v4: () => '123e4567-e89b-12d3-a456-426614174000',
}))

describe('errorHandling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should throw Invalid SQL Syntax for errno 1064', () => {
    const error = { errno: 1064 }
    expect(() => errorHandling(error)).toThrow(new SqlError('Invalid SQL Syntax'))
  })

  it('should throw error code for errno 1146', () => {
    const error = { errno: 1146, code: 'TEST_CODE' }
    expect(() => errorHandling(error)).toThrow(new SqlError('TEST_CODE'))
  })

  it('should throw foreign key constraint error for errno 1452', () => {
    const error = {
      errno: 1452,
      sqlMessage:
        'Cannot add or update a child row: a foreign key constraint fails (`test`.`table`, CONSTRAINT `fk_test` FOREIGN KEY (`test_id`) REFERENCES `test` (`id`))',
    }
    expect(() => errorHandling(error)).toThrow(
      new SqlError('Invalid Value provided', {
        cause: '`test_id` does not exist',
      })
    )
  })

  it('should rethrow error for other cases', () => {
    const error = { message: 'Test error' }
    expect(() => errorHandling(error)).toThrow(new SqlError('Test error'))
  })

  it('should throw Unknown error when no message is present', () => {
    const error = {}
    expect(() => errorHandling(error)).toThrow(new SqlError('Unknown error'))
  })
})

describe('generateToken', () => {
  it('should generate a valid token', () => {
    const token = generateToken()
    expect(token).toBe('123e4567e89b12d3')
    expect(token.length).toBe(16)
    expect(token).toMatch(/^[a-f0-9]+$/)
  })
})

describe('sortingFunction', () => {
  const stringifySQL = (sql: any) => JSON.stringify({
    name: sql.name,
    direction: sql.direction,
    column: sql.column?.name
  })

  it('should sort by testId in ascending order by default', () => {
    const result = sortingFunction(undefined, 'asc')
    expect(stringifySQL(result)).toBe(stringifySQL(asc(tests.testId)))
  })

  it('should sort by testId in descending order by default', () => {
    const result = sortingFunction(undefined, 'desc')
    expect(stringifySQL(result)).toBe(stringifySQL(desc(tests.testId)))
  })

  it('should sort by title in ascending order', () => {
    const result = sortingFunction('title', 'asc')
    expect(stringifySQL(result)).toBe(stringifySQL(asc(tests.title)))
  })

  it('should sort by title in descending order', () => {
    const result = sortingFunction('title', 'desc')
    expect(stringifySQL(result)).toBe(stringifySQL(desc(tests.title)))
  })

  it('should sort by priority in ascending order', () => {
    const result = sortingFunction('priority', 'asc')
    expect(stringifySQL(result)).toBe(stringifySQL(desc(priority.priorityId)))
  })

  it('should sort by priority in descending order', () => {
    const result = sortingFunction('priority', 'desc')
    expect(stringifySQL(result)).toBe(stringifySQL(asc(priority.priorityId)))
  })

  it('should sort by platform in ascending order', () => {
    const result = sortingFunction('platform', 'asc')
    expect(stringifySQL(result)).toBe(stringifySQL(asc(platform.platformName)))
  })

  it('should sort by platform in descending order', () => {
    const result = sortingFunction('platform', 'desc')
    expect(stringifySQL(result)).toBe(stringifySQL(desc(platform.platformName)))
  })

  it('should sort by section in ascending order', () => {
    const result = sortingFunction('section', 'asc')
    expect(stringifySQL(result)).toBe(stringifySQL(asc(sections.sectionName)))
  })

  it('should sort by section in descending order', () => {
    const result = sortingFunction('section', 'desc')
    expect(stringifySQL(result)).toBe(stringifySQL(desc(sections.sectionName)))
  })

  it('should sort by automation status in ascending order', () => {
    const result = sortingFunction('automation+status', 'asc')
    expect(stringifySQL(result)).toBe(stringifySQL(asc(automationStatus.automationStatusName)))
  })

  it('should sort by automation status in descending order', () => {
    const result = sortingFunction('automation+status', 'desc')
    expect(stringifySQL(result)).toBe(stringifySQL(desc(automationStatus.automationStatusName)))
  })

  it('should handle invalid sortBy value', () => {
    const result = sortingFunction('invalid', 'asc')
    expect(stringifySQL(result)).toBe(stringifySQL(asc(tests.testId)))
  })
})

describe('getForeignKeyConstraint', () => {
  it('should extract foreign key constraint from error message', () => {
    const message = 'Cannot add or update a child row: a foreign key constraint fails (`test`.`table`, CONSTRAINT `fk_test` FOREIGN KEY (`test_id`) REFERENCES `test` (`id`))'
    expect(getForeignKeyConstraint(message)).toBe('`test_id`')
  })

  it('should return null for invalid error message', () => {
    const message = 'Invalid message'
    expect(getForeignKeyConstraint(message)).toBeNull()
  })
})
