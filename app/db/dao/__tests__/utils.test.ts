import {errorHandling} from '@dao/utils'
import {SqlError} from '@services/ErrorTypes'

jest.mock('../../../services/ErrorTypes')

describe('errorHandling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should throw "Invalid SQL Syntax" for errno 1064', () => {
    const error = {errno: 1064}
    expect(() => errorHandling(error)).toThrow(SqlError)
    expect(SqlError).toHaveBeenCalledWith('Invalid SQL Syntax')
  })

  it('should throw error code for errno 1146', () => {
    const error = {errno: 1146, code: 'ER_NO_SUCH_TABLE'}
    expect(() => errorHandling(error)).toThrow(SqlError)
    expect(SqlError).toHaveBeenCalledWith(error.code)
  })

  it('should rethrow the error for other cases', () => {
    const error = {errno: 9999, message: 'Unknown error'}
    expect(() => errorHandling(error)).toThrow(SqlError)
    expect(SqlError).toHaveBeenCalledWith(error)
  })

  it('should rethrow the error if errno is not present', () => {
    const error = {message: 'Some other error'}
    expect(() => errorHandling(error)).toThrow(SqlError)
    expect(SqlError).toHaveBeenCalledWith(error)
  })
})
