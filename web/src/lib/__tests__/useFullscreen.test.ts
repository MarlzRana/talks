import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFullscreen } from '../useFullscreen'

describe('useFullscreen', () => {
  it('isFullscreen is initially false when document.fullscreenElement is null', () => {
    ;(document as any).fullscreenElement = null
    const { result } = renderHook(() => useFullscreen())
    expect(result.current.isFullscreen).toBe(false)
  })

  it('toggle() calls requestFullscreen when not fullscreen', () => {
    ;(document as any).fullscreenElement = null
    const { result } = renderHook(() => useFullscreen())

    act(() => result.current.toggle())
    expect(document.documentElement.requestFullscreen).toHaveBeenCalledOnce()
  })

  it('toggle() calls exitFullscreen when fullscreen', () => {
    ;(document as any).fullscreenElement = document.documentElement
    const { result } = renderHook(() => useFullscreen())

    act(() => result.current.toggle())
    expect(document.exitFullscreen).toHaveBeenCalledOnce()

    // Restore for other tests
    ;(document as any).fullscreenElement = null
  })

  it('isFullscreen updates when fullscreenchange event fires', () => {
    ;(document as any).fullscreenElement = null
    const { result } = renderHook(() => useFullscreen())
    expect(result.current.isFullscreen).toBe(false)

    act(() => {
      ;(document as any).fullscreenElement = document.documentElement
      document.dispatchEvent(new Event('fullscreenchange'))
    })
    expect(result.current.isFullscreen).toBe(true)

    act(() => {
      ;(document as any).fullscreenElement = null
      document.dispatchEvent(new Event('fullscreenchange'))
    })
    expect(result.current.isFullscreen).toBe(false)
  })

  it('cleans up fullscreenchange listener on unmount', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener')
    const { unmount } = renderHook(() => useFullscreen())

    unmount()

    expect(removeSpy).toHaveBeenCalledWith('fullscreenchange', expect.any(Function))
  })
})
