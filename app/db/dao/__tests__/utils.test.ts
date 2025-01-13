import {checkForSquadAndLabelIds, errorHandling} from '@dao/utils'
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

describe('checkForSquadAndLabelIds', () => {
  it('should throw "No Squad Selected" if squadIds is an empty array', () => {
    const params = {squadIds: [], labelIds: [1, 2, 3]}
    expect(() => checkForSquadAndLabelIds(params)).toThrow('No Squad Selected')
  })

  it('should throw "No Label Selected" if labelIds is an empty array', () => {
    const params = {squadIds: [1, 2, 3], labelIds: []}
    expect(() => checkForSquadAndLabelIds(params)).toThrow('No Label Selected')
  })

  it('should not throw an error if both squadIds and labelIds are undefined', () => {
    const params = {squadIds: undefined, labelIds: undefined}
    expect(() => checkForSquadAndLabelIds(params)).not.toThrow()
  })

  it('should not throw an error if both squadIds and labelIds are valid arrays', () => {
    const params = {squadIds: [1, 2, 3], labelIds: [1, 2, 3]}
    expect(() => checkForSquadAndLabelIds(params)).not.toThrow()
  })
})
