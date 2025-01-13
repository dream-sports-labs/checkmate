import {z} from 'zod'
import {ErrorCause} from '~/constants'

export const checkForValidId = (id?: number): boolean => {
  return !!(id && id !== null && !Number.isNaN(id))
}
export const checkForProjectId = (projectId?: number) => {
  //TODO:: Put the check for projectId from db here
  return checkForValidId(projectId)
}

export const checkForTestId = (testId?: number) => {
  //TODO:: Put the check for testId from db here
  return checkForValidId(testId)
}

export const checkForRunId = (runId?: number) => {
  //TODO:: Put the check for runId from db here
  return checkForValidId(runId)
}

export const getRequestParams = async <T>(
  request: Request,
  validator?: z.ZodSchema<T>,
): Promise<T> => {
  const data = await request.json()
  if (validator) validator.parse(data)
  return data
}

export const safeJsonParse = (jsonString?: string | null) => {
  try {
    return jsonString ? JSON.parse(jsonString) : undefined
  } catch (error) {
    return undefined
  }
}

export const jsonParseWithError = (
  jsonString?: string | null,
  paramName?: string,
) => {
  try {
    return jsonString ? JSON.parse(jsonString) : undefined
  } catch (error) {
    throw new Error(paramName ? `Invalid JSON ${paramName}` : 'Invalid JSON', {
      cause: ErrorCause.INVALID_PARAMS,
    })
  }
}

export const sqlErroMessage = (error: any) => {
  if (error.message.includes('Duplicate entry')) {
    return 'Entry Already Exists'
  }
  return error.cause ? `${error.message}, cause: ${error.cause}` : error.message
}

export const zodErrorMessage = (error: any) => {
  const errorMessage = error.errors
    .map((error: any) => `${error.path.join('.')}: ${error.message}`)
    .join(', ')
  return 'Data validation error: ' + errorMessage
}
