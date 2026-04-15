import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDeck } from '../useDeck'

describe('useDeck', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('initialization', () => {
    it('initializes index to 0 when no localStorage', () => {
      const { result } = renderHook(() => useDeck('demo', 5))
      expect(result.current.index).toBe(0)
    })

    it('restores index from localStorage', () => {
      localStorage.setItem('deck:demo', '3')
      const { result } = renderHook(() => useDeck('demo', 5))
      expect(result.current.index).toBe(3)
    })

    it('clamps restored index to valid range', () => {
      localStorage.setItem('deck:demo', '10')
      const { result } = renderHook(() => useDeck('demo', 3))
      expect(result.current.index).toBe(2)
    })

    it('handles invalid localStorage (NaN string)', () => {
      localStorage.setItem('deck:demo', 'garbage')
      const { result } = renderHook(() => useDeck('demo', 5))
      expect(result.current.index).toBe(0)
    })

    it('uses different storage keys for different slugs', () => {
      localStorage.setItem('deck:alpha', '2')
      localStorage.setItem('deck:beta', '4')

      const { result: a } = renderHook(() => useDeck('alpha', 5))
      const { result: b } = renderHook(() => useDeck('beta', 5))

      expect(a.current.index).toBe(2)
      expect(b.current.index).toBe(4)
    })

    it('does not crash when totalSlides is 0', () => {
      const { result } = renderHook(() => useDeck('demo', 0))
      expect(result.current.index).toBe(0)
    })
  })

  describe('next()', () => {
    it('increments index and sets direction to 1', () => {
      const { result } = renderHook(() => useDeck('demo', 5))
      act(() => result.current.next())
      expect(result.current.index).toBe(1)
      expect(result.current.direction).toBe(1)
    })

    it('clamps at last slide', () => {
      localStorage.setItem('deck:demo', '4')
      const { result } = renderHook(() => useDeck('demo', 5))
      expect(result.current.index).toBe(4)

      act(() => result.current.next())
      expect(result.current.index).toBe(4)
    })
  })

  describe('prev()', () => {
    it('decrements index and sets direction to -1', () => {
      localStorage.setItem('deck:demo', '3')
      const { result } = renderHook(() => useDeck('demo', 5))

      act(() => result.current.prev())
      expect(result.current.index).toBe(2)
      expect(result.current.direction).toBe(-1)
    })

    it('clamps at 0', () => {
      const { result } = renderHook(() => useDeck('demo', 5))
      expect(result.current.index).toBe(0)

      act(() => result.current.prev())
      expect(result.current.index).toBe(0)
    })
  })

  describe('goTo()', () => {
    it('sets index and correct direction', () => {
      const { result } = renderHook(() => useDeck('demo', 5))

      act(() => result.current.goTo(3))
      expect(result.current.index).toBe(3)
      expect(result.current.direction).toBe(1)

      act(() => result.current.goTo(1))
      expect(result.current.index).toBe(1)
      expect(result.current.direction).toBe(-1)
    })

    it('clamps negative values to 0', () => {
      const { result } = renderHook(() => useDeck('demo', 5))
      act(() => result.current.goTo(-5))
      expect(result.current.index).toBe(0)
    })

    it('clamps values over max to last slide', () => {
      const { result } = renderHook(() => useDeck('demo', 5))
      act(() => result.current.goTo(100))
      expect(result.current.index).toBe(4)
    })
  })

  describe('persistence', () => {
    it('persists index to localStorage on change', () => {
      const { result } = renderHook(() => useDeck('demo', 5))

      act(() => result.current.next())
      expect(localStorage.getItem('deck:demo')).toBe('1')

      act(() => result.current.goTo(4))
      expect(localStorage.getItem('deck:demo')).toBe('4')
    })

    it('does not persist when totalSlides is 0', () => {
      renderHook(() => useDeck('demo', 0))
      expect(localStorage.getItem('deck:demo')).toBeNull()
    })
  })
})
