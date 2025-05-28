import {errorHandling, generateToken, sortingFunction} from '@dao/utils'
import {SqlError} from '@services/ErrorTypes'

// Mock drizzle-orm table objects
jest.mock('@schema/tests', () => {
  const mockColumn = (name: string) => ({
    name,
    table: {name: 'mockTable'},
    __brand: 'Column',
    dataType: 'string',
    columnType: 'string',
    notNull: false,
    hasDefault: false,
    isPrimaryKey: false,
    isAutoincrement: false,
    tableName: 'mockTable',
    hasRuntimeDefault: false,
    enumValues: undefined,
    data: undefined,
    driverParam: undefined,
    generated: undefined,
    primary: false,
    keyAsName: name,
    _: {name},
  })

  return {
    tests: {
      testId: mockColumn('testId'),
      title: mockColumn('title'),
    },
    priority: {
      priorityId: mockColumn('priorityId'),
    },
    platform: {
      platformName: mockColumn('platformName'),
    },
    sections: {
      sectionName: mockColumn('sectionName'),
    },
    automationStatus: {
      automationStatusName: mockColumn('automationStatusName'),
    },
  }
})

// Mock SqlError constructor
jest.mock('../../../services/ErrorTypes', () => ({
  SqlError: jest.fn().mockImplementation((message, options) => {
    const error = new Error(message)
    error.name = 'SqlError'
    if (options) {
      Object.assign(error, options)
    }
    return error
  }),
}))

jest.mock('uuid', () => ({
  v4: () => '123e4567-e89b-12d3-a456-426614174000',
}))

describe('errorHandling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should throw "Invalid SQL Syntax" for errno 1064', () => {
    const error = {errno: 1064}
    expect(() => errorHandling(error)).toThrow('Invalid SQL Syntax')
    expect(SqlError).toHaveBeenCalledWith('Invalid SQL Syntax')
  })

  it('should throw error code for errno 1146', () => {
    const error = {errno: 1146, code: 'ER_NO_SUCH_TABLE'}
    expect(() => errorHandling(error)).toThrow('ER_NO_SUCH_TABLE')
    expect(SqlError).toHaveBeenCalledWith('ER_NO_SUCH_TABLE')
  })

  it('should handle foreign key constraint error', () => {
    const error = {
      errno: 1452,
      sqlMessage:
        'Cannot add or update a child row: a foreign key constraint fails (`test_db`.`tests`, CONSTRAINT `tests_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`))',
    }
    expect(() => errorHandling(error)).toThrow('Invalid Value provided')
    expect(SqlError).toHaveBeenCalledWith('Invalid Value provided', {
      cause: '`project_id` does not exist',
    })
  })

  it('should rethrow the error for other cases', () => {
    const error = {errno: 9999, message: 'Unknown error'}
    expect(() => errorHandling(error)).toThrow('Unknown error')
    expect(SqlError).toHaveBeenCalledWith('Unknown error')
  })

  it('should rethrow the error if errno is not present', () => {
    const error = {message: 'Some other error'}
    expect(() => errorHandling(error)).toThrow('Some other error')
    expect(SqlError).toHaveBeenCalledWith('Some other error')
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
  it('should sort by testId in ascending order by default', () => {
    const result = sortingFunction(undefined, 'asc')
    expect(result).toBeDefined()
  })

  it('should sort by testId in descending order by default', () => {
    const result = sortingFunction(undefined, 'desc')
    expect(result).toBeDefined()
  })

  it('should sort by title in ascending order', () => {
    const result = sortingFunction('title', 'asc')
    expect(result).toBeDefined()
  })

  it('should sort by title in descending order', () => {
    const result = sortingFunction('title', 'desc')
    expect(result).toBeDefined()
  })

  it('should sort by priority in ascending order', () => {
    const result = sortingFunction('priority', 'asc')
    expect(result).toBeDefined()
  })

  it('should sort by priority in descending order', () => {
    const result = sortingFunction('priority', 'desc')
    expect(result).toBeDefined()
  })

  it('should sort by platform in ascending order', () => {
    const result = sortingFunction('platform', 'asc')
    expect(result).toBeDefined()
  })

  it('should sort by platform in descending order', () => {
    const result = sortingFunction('platform', 'desc')
    expect(result).toBeDefined()
  })

  it('should sort by section in ascending order', () => {
    const result = sortingFunction('section', 'asc')
    expect(result).toBeDefined()
  })

  it('should sort by section in descending order', () => {
    const result = sortingFunction('section', 'desc')
    expect(result).toBeDefined()
  })

  it('should sort by automation status in ascending order', () => {
    const result = sortingFunction('automation+status', 'asc')
    expect(result).toBeDefined()
  })

  it('should sort by automation status in descending order', () => {
    const result = sortingFunction('automation+status', 'desc')
    expect(result).toBeDefined()
  })

  it('should handle invalid sortBy value', () => {
    const result = sortingFunction('invalid', 'asc')
    expect(result).toBeDefined()
  })
})
