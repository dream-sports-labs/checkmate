import {isChecked, downloadReport} from '../utils' // Adjust path as necessary
import {safeJsonParse} from '@route/utils/utils'

// Mock the `safeJsonParse` function
jest.mock('@route/utils/utils', () => ({
  safeJsonParse: jest.fn(),
}))

describe('isChecked function', () => {
  let searchParams: URLSearchParams

  beforeEach(() => {
    searchParams = new URLSearchParams()
  })

  test('should return false if filter is not present in searchParams', () => {
    expect(isChecked({searchParams, filterName: 'squadIds', filterId: 1})).toBe(
      false,
    )
  })

  test('should return false if filter value does not include filterId', () => {
    searchParams.set('squadIds', JSON.stringify([2, 3, 4])) // filterId 1 is not included
    ;(safeJsonParse as jest.Mock).mockReturnValue([2, 3, 4])

    expect(isChecked({searchParams, filterName: 'squadIds', filterId: 1})).toBe(
      false,
    )
  })

  test('should return true if filter value includes filterId', () => {
    searchParams.set('squadIds', JSON.stringify([1, 2, 3]))
    ;(safeJsonParse as jest.Mock).mockReturnValue([1, 2, 3])

    expect(isChecked({searchParams, filterName: 'squadIds', filterId: 1})).toBe(
      true,
    )
  })

  test('should return false if filter value is null', () => {
    searchParams.set('squadIds', 'null')
    ;(safeJsonParse as jest.Mock).mockReturnValue(null)

    expect(isChecked({searchParams, filterName: 'squadIds', filterId: 1})).toBe(
      false,
    )
  })
})

describe('downloadReport function', () => {
  let fetchMock: jest.Mock
  let setDownloadingMock: jest.Mock
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    fetchMock = jest.fn()
    setDownloadingMock = jest.fn()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    // Mock global fetch
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should call setDownloading(true) before fetch and setDownloading(false) after completion', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      blob: async () => new Blob(['test data'], {type: 'text/csv'}),
    })

    await downloadReport({
      fetchUrl: 'https://example.com/report.csv',
      fileName: 'test-report',
      setDownloading: setDownloadingMock,
    })

    expect(setDownloadingMock).toHaveBeenNthCalledWith(1, true) // Ensure setDownloading is called first with true
    expect(setDownloadingMock).toHaveBeenNthCalledWith(2, false) // Ensure setDownloading is finally set to false
  })

  test('should handle fetch errors and setDownloading(false)', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Fetch failed'))

    await downloadReport({
      fetchUrl: 'https://example.com/report.csv',
      fileName: 'test-report',
      setDownloading: setDownloadingMock,
    })

    expect(setDownloadingMock).toHaveBeenNthCalledWith(1, true)
    expect(setDownloadingMock).toHaveBeenNthCalledWith(2, false)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error downloading CSV:',
      expect.any(Error),
    )
  })

  test('should handle HTTP error responses and setDownloading(false)', async () => {
    fetchMock.mockResolvedValueOnce({ok: false}) // Simulate HTTP error response

    await downloadReport({
      fetchUrl: 'https://example.com/report.csv',
      fileName: 'test-report',
      setDownloading: setDownloadingMock,
    })

    expect(setDownloadingMock).toHaveBeenNthCalledWith(1, true)
    expect(setDownloadingMock).toHaveBeenNthCalledWith(2, false)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error downloading CSV:',
      expect.any(Error),
    )
  })
})
