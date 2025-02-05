/**
 * @jest-environment jsdom
 */
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useNavigate} from '@remix-run/react'
import {renderHook} from '@testing-library/react'

jest.mock('@remix-run/react', () => ({
  useNavigate: jest.fn(),
}))

describe('useCustomNavigate Hook', () => {
  let navigateMock: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    navigateMock = jest.fn()
    ;(useNavigate as jest.Mock).mockReturnValue(navigateMock)
    jest.spyOn(window, 'open').mockImplementation(() => null)
  })

  it('should navigate to a string URL without meta/ctrl key', () => {
    const {result} = renderHook(() => useCustomNavigate())

    const customNavigate = result.current
    customNavigate('/test-path')

    expect(navigateMock).toHaveBeenCalledWith('/test-path', undefined)
    expect(window.open).not.toHaveBeenCalled()
  })

  it('should open a new tab when metaKey is pressed', () => {
    const {result} = renderHook(() => useCustomNavigate())

    const customNavigate = result.current
    const mockEvent = {metaKey: true} as React.MouseEvent<HTMLButtonElement>

    customNavigate('/test-path', undefined, mockEvent)

    expect(window.open).toHaveBeenCalledWith('/test-path', '_blank')
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('should open a new tab when ctrlKey is pressed', () => {
    const {result} = renderHook(() => useCustomNavigate())

    const customNavigate = result.current
    const mockEvent = {ctrlKey: true} as React.MouseEvent<HTMLButtonElement>

    customNavigate('/test-path', undefined, mockEvent)

    expect(window.open).toHaveBeenCalledWith('/test-path', '_blank')
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('should navigate using a numeric value', () => {
    const {result} = renderHook(() => useCustomNavigate())

    const customNavigate = result.current
    customNavigate(-1)

    expect(navigateMock).toHaveBeenCalledWith(-1)
    expect(window.open).not.toHaveBeenCalled()
  })

  it('should handle options when navigating to a string URL', () => {
    const {result} = renderHook(() => useCustomNavigate())

    const customNavigate = result.current
    const options = {replace: true}

    customNavigate('/test-path', options)

    expect(navigateMock).toHaveBeenCalledWith('/test-path', options)
    expect(window.open).not.toHaveBeenCalled()
  })

  it('should do nothing if `to` is neither string nor number', () => {
    const {result} = renderHook(() => useCustomNavigate())

    const customNavigate = result.current

    // @ts-expect-error: Simulating invalid input
    customNavigate(undefined)

    expect(navigateMock).not.toHaveBeenCalled()
    expect(window.open).not.toHaveBeenCalled()
  })
})
