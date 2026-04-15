import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

let capturedHandler: ((state: any) => void) | null = null
let capturedConfig: Record<string, any> | null = null

vi.mock('@use-gesture/react', () => ({
  useDrag: (handler: (state: any) => void, config: Record<string, any>) => {
    capturedHandler = handler
    capturedConfig = config
    return vi.fn()
  },
}))

import { useSwipe } from '../useSwipe'

describe('useSwipe', () => {
  it('swipe left (swipe[0] === -1) calls next()', () => {
    const next = vi.fn()
    const prev = vi.fn()
    renderHook(() => useSwipe({ next, prev }))

    capturedHandler!({ swipe: [-1, 0] })
    expect(next).toHaveBeenCalledOnce()
    expect(prev).not.toHaveBeenCalled()
  })

  it('swipe right (swipe[0] === 1) calls prev()', () => {
    const next = vi.fn()
    const prev = vi.fn()
    renderHook(() => useSwipe({ next, prev }))

    capturedHandler!({ swipe: [1, 0] })
    expect(prev).toHaveBeenCalledOnce()
    expect(next).not.toHaveBeenCalled()
  })

  it('no swipe (swipe[0] === 0) calls neither', () => {
    const next = vi.fn()
    const prev = vi.fn()
    renderHook(() => useSwipe({ next, prev }))

    capturedHandler!({ swipe: [0, 0] })
    expect(next).not.toHaveBeenCalled()
    expect(prev).not.toHaveBeenCalled()
  })

  it('passes axis: "x" in config', () => {
    renderHook(() => useSwipe({ next: vi.fn(), prev: vi.fn() }))
    expect(capturedConfig!.axis).toBe('x')
  })

  it('passes filterTaps: true in config', () => {
    renderHook(() => useSwipe({ next: vi.fn(), prev: vi.fn() }))
    expect(capturedConfig!.filterTaps).toBe(true)
  })
})
