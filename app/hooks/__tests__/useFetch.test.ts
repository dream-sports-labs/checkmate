/**
 * @jest-environment jsdom
 */
import {renderHook, act} from '@testing-library/react-hooks'
import {useFetch} from '@hooks/useFetch'

global.fetch = jest.fn()

describe('useFetch Hook', () => {
  const mockUrl = '/api/test'
  const mockData = {message: 'Success'}

  beforeAll(() => {
    jest.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      origin: 'http://localhost',
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default states', () => {
    const {result} = renderHook(() => useFetch<typeof mockData>(mockUrl))
    const [, state] = result.current

    expect(state.loading).toBe(false)
    expect(state.data).toBeNull()
    expect(state.error).toBeNull()
  })

  it('should make a successful GET request', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockData),
    })

    const {result} = renderHook(() => useFetch<typeof mockData>(mockUrl))
    const [fetcher] = result.current

    await act(async () => {
      await fetcher()
    })

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({
        method: 'get',
        headers: expect.any(Headers),
      }),
    )

    const [, state] = result.current
    expect(state.data).toEqual(mockData)
    expect(state.error).toBeNull()
  })

  it('should handle request errors', async () => {
    const mockError = new Error('Request failed')

    ;(global.fetch as jest.Mock).mockRejectedValueOnce(mockError)

    const {result} = renderHook(() => useFetch(mockUrl))
    const [fetcher] = result.current

    await act(async () => {
      await fetcher()
    })

    const [, state] = result.current
    expect(state.loading).toBe(false)
    expect(state.data).toBeNull()
    expect(state.error).toEqual(mockError)
  })
})
