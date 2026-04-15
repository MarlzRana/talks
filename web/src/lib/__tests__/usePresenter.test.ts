import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import React from 'react'
import { usePresenter } from '../usePresenter'

function createWrapper(initialEntries: string[]) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      MemoryRouter,
      { initialEntries },
      React.createElement(Routes, null, React.createElement(Route, { path: '/talks/:slug', element: children })),
    )
  }
}

describe('usePresenter', () => {
  it('isPresenter is false when no query param', () => {
    const { result } = renderHook(() => usePresenter(), {
      wrapper: createWrapper(['/talks/demo']),
    })
    expect(result.current.isPresenter).toBe(false)
  })

  it('isPresenter is true when ?presenter=true', () => {
    const { result } = renderHook(() => usePresenter(), {
      wrapper: createWrapper(['/talks/demo?presenter=true']),
    })
    expect(result.current.isPresenter).toBe(true)
  })

  it('togglePresenter() adds presenter=true when absent', () => {
    const { result } = renderHook(() => usePresenter(), {
      wrapper: createWrapper(['/talks/demo']),
    })
    expect(result.current.isPresenter).toBe(false)

    act(() => result.current.togglePresenter())
    expect(result.current.isPresenter).toBe(true)
  })

  it('togglePresenter() removes presenter param when present', () => {
    const { result } = renderHook(() => usePresenter(), {
      wrapper: createWrapper(['/talks/demo?presenter=true']),
    })
    expect(result.current.isPresenter).toBe(true)

    act(() => result.current.togglePresenter())
    expect(result.current.isPresenter).toBe(false)
  })
})
