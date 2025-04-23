import {
  automationStatus,
  platform,
  priority,
  sections,
  tests,
} from '@schema/tests'
import {SqlError} from '@services/ErrorTypes'
import {asc, desc} from 'drizzle-orm'
import {v4 as uuidv4} from 'uuid'

export const errorHandling = (error: any) => {
  if (error.errno && error.errno === 1064)
    throw new SqlError('Invalid SQL Syntax')

  if (error.errno && error.errno === 1146) throw new SqlError(error.code)

  if (error.errno && error.errno === 1452) {
    const cause = getForeignKeyConstraint(error.sqlMessage)
    if (cause)
      throw new SqlError('Invalid Value provided', {
        cause: '' + cause + ' does not exist',
      })
  }
  throw new SqlError(error.message || 'Unknown error')
}

function getForeignKeyConstraint(errorString: string) {
  const foreignKeyPattern = /FOREIGN KEY \(`[^`]+\`\)/
  const KEY_PATTERN = /`[^`]+`/
  const match = errorString.match(foreignKeyPattern)
  const keyValue = match?.[0].match(KEY_PATTERN)

  return keyValue ? keyValue[0] : null
}

export function generateToken(): string {
  return uuidv4().replace(/-/g, '').substring(0, 16)
}

export const sortingFunction = (sortBy?: string, sortOrder?: string) => {
  let orderByClause =
    sortOrder === 'asc' ? asc(tests.testId) : desc(tests.testId)

  switch (sortBy) {
    case 'title':
      orderByClause = sortOrder === 'asc' ? asc(tests.title) : desc(tests.title)
      break
    case 'test id':
      orderByClause =
        sortOrder === 'asc' ? asc(tests.testId) : desc(tests.testId)
      break
    case 'priority':
      orderByClause =
        sortOrder === 'asc'
          ? desc(priority.priorityId)
          : asc(priority.priorityId)
      break
    case 'platform':
      orderByClause =
        sortOrder === 'asc'
          ? asc(platform.platformName)
          : desc(platform.platformName)
      break
    case 'section':
      orderByClause =
        sortOrder === 'asc'
          ? asc(sections.sectionName)
          : desc(sections.sectionName)
    case 'automation+status':
      orderByClause =
        sortOrder === 'asc'
          ? asc(automationStatus.automationStatusName)
          : desc(automationStatus.automationStatusName)
      break
    default:
      sortOrder === 'asc' ? asc(tests.testId) : desc(tests.testId)
  }
  return orderByClause
}
