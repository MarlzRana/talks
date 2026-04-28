import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyNav } from '../useKeyNav'

function createCallbacks() {
  return {
    advance: vi.fn(),
    retreat: vi.fn(),
    skipForward: vi.fn(),
    skipBack: vi.fn(),
    escape: vi.fn(),
    toggleFullscreen: vi.fn(),
    togglePresenter: vi.fn(),
  }
}

function fireKey(key: string, opts?: Partial<KeyboardEventInit & { target: EventTarget }>) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, ...opts })
  if (opts?.target) {
    Object.defineProperty(event, 'target', { value: opts.target })
  }
  window.dispatchEvent(event)
  return event
}

describe('useKeyNav', () => {
  let callbacks: ReturnType<typeof createCallbacks>

  beforeEach(() => {
    callbacks = createCallbacks()
  })

  it('ArrowRight calls advance()', () => {
    renderHook(() => useKeyNav(callbacks))
    fireKey('ArrowRight')
    expect(callbacks.advance).toHaveBeenCalledOnce()
  })

  it('Space calls advance() and preventDefault', () => {
    renderHook(() => useKeyNav(callbacks))
    const spy = vi.spyOn(KeyboardEvent.prototype, 'preventDefault')
    fireKey(' ')
    expect(callbacks.advance).toHaveBeenCalledOnce()
    expect(spy).toHaveBeenCalled()
  })

  it('ArrowLeft calls retreat()', () => {
    renderHook(() => useKeyNav(callbacks))
    fireKey('ArrowLeft')
    expect(callbacks.retreat).toHaveBeenCalledOnce()
  })

  it('ArrowUp calls skipForward()', () => {
    renderHook(() => useKeyNav(callbacks))
    fireKey('ArrowUp')
    expect(callbacks.skipForward).toHaveBeenCalledOnce()
  })

  it('ArrowDown calls skipBack()', () => {
    renderHook(() => useKeyNav(callbacks))
    fireKey('ArrowDown')
    expect(callbacks.skipBack).toHaveBeenCalledOnce()
  })

  it('Escape calls escape()', () => {
    renderHook(() => useKeyNav(callbacks))
    fireKey('Escape')
    expect(callbacks.escape).toHaveBeenCalledOnce()
  })

  it('f calls toggleFullscreen()', () => {
    renderHook(() => useKeyNav(callbacks))
    fireKey('f')
    expect(callbacks.toggleFullscreen).toHaveBeenCalledOnce()
  })

  it('F calls toggleFullscreen()', () => {
    renderHook(() => useKeyNav(callbacks))
    fireKey('F')
    expect(callbacks.toggleFullscreen).toHaveBeenCalledOnce()
  })

  it('p calls togglePresenter()', () => {
    renderHook(() => useKeyNav(callbacks))
    fireKey('p')
    expect(callbacks.togglePresenter).toHaveBeenCalledOnce()
  })

  it('P calls togglePresenter()', () => {
    renderHook(() => useKeyNav(callbacks))
    fireKey('P')
    expect(callbacks.togglePresenter).toHaveBeenCalledOnce()
  })

  it('ignores events from HTMLInputElement', () => {
    renderHook(() => useKeyNav(callbacks))
    const input = document.createElement('input')
    fireKey('ArrowRight', { target: input })
    expect(callbacks.advance).not.toHaveBeenCalled()
  })

  it('ignores events from HTMLTextAreaElement', () => {
    renderHook(() => useKeyNav(callbacks))
    const textarea = document.createElement('textarea')
    fireKey('ArrowRight', { target: textarea })
    expect(callbacks.advance).not.toHaveBeenCalled()
  })

  it('cleans up listener on unmount', () => {
    const { unmount } = renderHook(() => useKeyNav(callbacks))
    unmount()
    fireKey('ArrowRight')
    expect(callbacks.advance).not.toHaveBeenCalled()
  })
})
