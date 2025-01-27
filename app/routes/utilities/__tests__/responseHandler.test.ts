import {responseHandler} from '../responseHandler'
import {json} from '@remix-run/node'
import {logger, LogType} from '../../../utils/logger'
import {
  ACCESS_ERROR_MESSAGE,
  LOGOUT_ERROR_MESSAGE,
} from '~/routes/utilities/constants'

jest.mock('@remix-run/node', () => ({
  json: jest.fn(),
}))

jest.mock('../../../utils/logger')

describe('responseHandler', () => {
  const mockJson = json as jest.Mock
  const mockLogger = logger as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should log an error and return a 401 response with Clear-Site-Data header for LOGOUT_ERROR_MESSAGE', () => {
    const response = responseHandler({
      error: LOGOUT_ERROR_MESSAGE,
      status: 401,
    })

    expect(mockLogger).toHaveBeenCalledWith({
      message: JSON.stringify(LOGOUT_ERROR_MESSAGE),
      type: LogType.ERROR,
      tag: 'API Error',
    })

    expect(mockJson).toHaveBeenCalledWith(
      {error: LOGOUT_ERROR_MESSAGE, status: 403},
      {
        status: 403,
        headers: {
          'Clear-Site-Data': 'cookies',
        },
      },
    )
    expect(response).toBeUndefined()
  })

  it('should log an error and return a 403 response for ACCESS_ERROR_MESSAGE', () => {
    const response = responseHandler({
      error: {message: ACCESS_ERROR_MESSAGE},
      status: 403,
    })

    expect(mockLogger).toHaveBeenCalledWith({
      message: JSON.stringify({message: ACCESS_ERROR_MESSAGE}),
      type: LogType.ERROR,
      tag: 'API Error',
    })

    expect(mockJson).toHaveBeenCalledWith(
      {error: ACCESS_ERROR_MESSAGE, status: 401},
      {
        status: 401,
        headers: {
          'Clear-Site-Data': 'cookies',
        },
      },
    )
    expect(response).toBeUndefined()
  })

  it('should return a 400 response for a missing request body', () => {
    const response = responseHandler({
      error: 'Unexpected end of JSON input',
      status: 400,
    })

    expect(mockLogger).toHaveBeenCalledWith({
      message: JSON.stringify('Unexpected end of JSON input'),
      type: LogType.ERROR,
      tag: 'API Error',
    })

    expect(mockJson).toHaveBeenCalledWith(
      {error: 'Request body is missing', status: 400},
      {status: 400},
    )
    expect(response).toBeUndefined()
  })

  it('should log an error and return a generic response for other errors', () => {
    const error = {message: 'Some other error'}
    const response = responseHandler({
      error,
      status: 500,
    })

    expect(mockLogger).toHaveBeenCalledWith({
      message: JSON.stringify(error),
      type: LogType.ERROR,
      tag: 'API Error',
    })

    expect(mockJson).toHaveBeenCalledWith(
      {data: null, error, status: 500},
      {status: 500},
    )
    expect(response).toBeUndefined()
  })

  it('should return a response with data if no error is provided', () => {
    const data = {key: 'value'}
    const response = responseHandler({
      data,
      status: 200,
    })

    expect(mockLogger).not.toHaveBeenCalled()

    expect(mockJson).toHaveBeenCalledWith(
      {data, error: null, status: 200},
      {status: 200},
    )
    expect(response).toBeUndefined()
  })
})
