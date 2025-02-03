import {json} from '@remix-run/node'
import {SqlError} from '@services/ErrorTypes'
import {z} from 'zod'
import {ErrorCause} from '~/constants'
import {
  ACCESS_ERROR_MESSAGE,
  LOGOUT_ERROR_MESSAGE,
} from '~/routes/utilities/constants'
import {logger, LogType} from '../../utils/logger'
import {sqlErroMessage, zodErrorMessage} from './utils'

interface IResponse {
  data?: any
  error?: any
  status: number
}

export const errorResponseHandler = (error: any) => {
  if (error.cause == ErrorCause.INVALID_PARAMS) {
    return responseHandler({error: error.message, status: 400})
  }
  if (error instanceof SqlError) {
    if (!!(error?.cause as any)?.includes('labelId')) {
      return responseHandler({
        data: {
          message: `Updated test successfully, but failed to update labels for test`,
        },
        status: 206,
      })
    }
    return responseHandler({
      error: sqlErroMessage(error),
      status: 500,
    })
  }
  if (error instanceof z.ZodError) {
    return responseHandler({error: zodErrorMessage(error), status: 400})
  }
  return responseHandler({error: error.message, status: 500})
}

export const responseHandler = ({
  data = null,
  error = null,
  status,
}: IResponse) => {
  if (error)
    logger({
      message: JSON.stringify(error),
      type: LogType.ERROR,
      tag: 'API Error',
    })

  if (
    error === LOGOUT_ERROR_MESSAGE ||
    error?.message === LOGOUT_ERROR_MESSAGE
  ) {
    return json(
      {error: error?.message ?? error, status: 403},
      {
        status: 403,
        headers: {
          'Clear-Site-Data': 'cookies',
        },
      },
    )
  }

  if (
    error === ACCESS_ERROR_MESSAGE ||
    error?.message === ACCESS_ERROR_MESSAGE
  ) {
    return json(
      {error: error?.message ?? error, status: 401},
      {
        status: 401,
        headers: {
          'Clear-Site-Data': 'cookies',
        },
      },
    )
  }
  if (error === 'Unexpected end of JSON input') {
    return json({error: 'Request body is missing', status: 400}, {status: 400})
  }

  return json({data, error, status}, {status})
}
