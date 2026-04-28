import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { SlideModule } from '@/types'
import { useDeck } from '../useDeck'

function makeSlides(n: number, substepCounts?: number[]): SlideModule[] {
  return Array.from({ length: n }, (_, i) => ({
    default: () => null,
    ...(substepCounts?.[i] ? { substeps: substepCounts[i] } : {}),
  }))
}

describe('useDeck', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('initialization', () => {
    it('initializes index to 0 when no localStorage', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(5)))
      expect(result.current.index).toBe(0)
    })

    it('restores index from localStorage', () => {
      localStorage.setItem('deck:demo', '3')
      const { result } = renderHook(() => useDeck('demo', makeSlides(5)))
      expect(result.current.index).toBe(3)
    })

    it('clamps restored index to valid range', () => {
      localStorage.setItem('deck:demo', '10')
      const { result } = renderHook(() => useDeck('demo', makeSlides(3)))
      expect(result.current.index).toBe(2)
    })

    it('handles invalid localStorage (NaN string)', () => {
      localStorage.setItem('deck:demo', 'garbage')
      const { result } = renderHook(() => useDeck('demo', makeSlides(5)))
      expect(result.current.index).toBe(0)
    })

    it('uses different storage keys for different slugs', () => {
      localStorage.setItem('deck:alpha', '2')
      localStorage.setItem('deck:beta', '4')

      const { result: a } = renderHook(() => useDeck('alpha', makeSlides(5)))
      const { result: b } = renderHook(() => useDeck('beta', makeSlides(5)))

      expect(a.current.index).toBe(2)
      expect(b.current.index).toBe(4)
    })

    it('does not crash when totalSlides is 0', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(0)))
      expect(result.current.index).toBe(0)
    })
  })

  describe('advance()', () => {
    it('increments substep before moving slides', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(3, [3, 1, 1])))
      expect(result.current.substep).toBe(0)

      act(() => result.current.advance())
      expect(result.current.index).toBe(0)
      expect(result.current.substep).toBe(1)

      act(() => result.current.advance())
      expect(result.current.index).toBe(0)
      expect(result.current.substep).toBe(2)
    })

    it('moves to next slide at substep 0 when at max substep', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(3, [2, 1, 1])))

      act(() => result.current.advance()) // substep 0 → 1
      expect(result.current.substep).toBe(1)

      act(() => result.current.advance()) // overflow → next slide
      expect(result.current.index).toBe(1)
      expect(result.current.substep).toBe(0)
      expect(result.current.direction).toBe(1)
    })

    it('moves to next slide immediately when slide has no substeps', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(3)))
      act(() => result.current.advance())
      expect(result.current.index).toBe(1)
      expect(result.current.direction).toBe(1)
    })

    it('no-ops at last slide max substep', () => {
      localStorage.setItem('deck:demo', '2')
      const { result } = renderHook(() => useDeck('demo', makeSlides(3, [1, 1, 2])))

      act(() => result.current.advance()) // substep 0 → 1
      expect(result.current.substep).toBe(1)

      act(() => result.current.advance()) // at last slide, max substep → no-op
      expect(result.current.index).toBe(2)
      expect(result.current.substep).toBe(1)
    })

    it('no-ops when totalSlides is 0', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(0)))
      act(() => result.current.advance())
      expect(result.current.index).toBe(0)
    })
  })

  describe('retreat()', () => {
    it('decrements substep before moving slides', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(3, [3, 1, 1])))

      act(() => result.current.advance())
      act(() => result.current.advance())
      expect(result.current.substep).toBe(2)

      act(() => result.current.retreat())
      expect(result.current.index).toBe(0)
      expect(result.current.substep).toBe(1)
    })

    it('moves to previous slide at its last substep when at substep 0', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(3, [4, 1, 1])))

      // Advance to slide 1
      act(() => result.current.skipForward())
      expect(result.current.index).toBe(1)

      // Retreat from slide 1 substep 0 → goes to slide 0 at its last substep (3)
      act(() => result.current.retreat())
      expect(result.current.index).toBe(0)
      expect(result.current.substep).toBe(3) // maxSubstep for slide with 4 substeps
      expect(result.current.direction).toBe(-1)
    })

    it('no-ops at first slide substep 0', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(3)))
      act(() => result.current.retreat())
      expect(result.current.index).toBe(0)
    })

    it('no-ops when totalSlides is 0', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(0)))
      act(() => result.current.retreat())
      expect(result.current.index).toBe(0)
    })
  })

  describe('skipForward()', () => {
    it('saves current substep and restores target saved substep', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(3, [5, 3, 1])))

      // Advance to substep 2 on slide 0
      act(() => result.current.advance())
      act(() => result.current.advance())
      expect(result.current.substep).toBe(2)

      // Skip forward to slide 1
      act(() => result.current.skipForward())
      expect(result.current.index).toBe(1)
      expect(result.current.substep).toBe(0) // never visited, defaults to 0
      expect(result.current.direction).toBe(1)

      // Advance substep on slide 1
      act(() => result.current.advance())
      expect(result.current.substep).toBe(1)

      // Skip forward to slide 2
      act(() => result.current.skipForward())
      expect(result.current.index).toBe(2)

      // Skip back to slide 1 — should restore substep 1
      act(() => result.current.skipBack())
      expect(result.current.index).toBe(1)
      expect(result.current.substep).toBe(1)

      // Skip back to slide 0 — should restore substep 2
      act(() => result.current.skipBack())
      expect(result.current.index).toBe(0)
      expect(result.current.substep).toBe(2)
    })

    it('no-ops at last slide', () => {
      localStorage.setItem('deck:demo', '2')
      const { result } = renderHook(() => useDeck('demo', makeSlides(3)))
      act(() => result.current.skipForward())
      expect(result.current.index).toBe(2)
    })
  })

  describe('skipBack()', () => {
    it('saves current substep and restores target saved substep', () => {
      localStorage.setItem('deck:demo', '1')
      const { result } = renderHook(() => useDeck('demo', makeSlides(3, [3, 3, 1])))

      act(() => result.current.advance()) // slide 1, sub 1
      act(() => result.current.skipBack()) // back to slide 0, saved sub 0
      expect(result.current.index).toBe(0)
      expect(result.current.substep).toBe(0)
      expect(result.current.direction).toBe(-1)
    })

    it('no-ops at first slide', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(3)))
      act(() => result.current.skipBack())
      expect(result.current.index).toBe(0)
    })
  })

  describe('goTo()', () => {
    it('sets index and correct direction', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(5)))

      act(() => result.current.goTo(3))
      expect(result.current.index).toBe(3)
      expect(result.current.direction).toBe(1)

      act(() => result.current.goTo(1))
      expect(result.current.index).toBe(1)
      expect(result.current.direction).toBe(-1)
    })

    it('clamps negative values to 0', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(5)))
      act(() => result.current.goTo(-5))
      expect(result.current.index).toBe(0)
    })

    it('clamps values over max to last slide', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(5)))
      act(() => result.current.goTo(100))
      expect(result.current.index).toBe(4)
    })

    it('sets substep when sub is provided', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(3, [5, 5, 5])))
      act(() => result.current.goTo(2, 3))
      expect(result.current.index).toBe(2)
      expect(result.current.substep).toBe(3)
    })

    it('clamps provided substep to slide max', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(3, [2, 2, 2])))
      act(() => result.current.goTo(1, 99))
      expect(result.current.substep).toBe(1) // max for substeps=2 is index 1
    })

    it('restores saved substep when sub is omitted', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(3, [5, 5, 1])))

      // Set substep on slide 0
      act(() => result.current.advance())
      act(() => result.current.advance())
      expect(result.current.substep).toBe(2)

      // Navigate away
      act(() => result.current.goTo(1, 0))

      // Navigate back without sub — should restore saved substep
      act(() => result.current.goTo(0))
      expect(result.current.substep).toBe(2)
    })

    it('no-ops when totalSlides is 0', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(0)))
      act(() => result.current.goTo(5))
      expect(result.current.index).toBe(0)
    })
  })

  describe('persistence', () => {
    it('persists index to localStorage on change', () => {
      const { result } = renderHook(() => useDeck('demo', makeSlides(5)))

      act(() => result.current.advance())
      expect(localStorage.getItem('deck:demo')).toBe('1')

      act(() => result.current.goTo(4))
      expect(localStorage.getItem('deck:demo')).toBe('4')
    })

    it('does not persist when totalSlides is 0', () => {
      renderHook(() => useDeck('demo', makeSlides(0)))
      expect(localStorage.getItem('deck:demo')).toBeNull()
    })
  })
})
