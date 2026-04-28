import { useState, useCallback, useEffect, useRef } from 'react'
import type { SlideModule } from '@/types'

function storageKey(slug: string) {
  return `deck:${slug}`
}

function substepStorageKey(slug: string) {
  return `deck:${slug}:substep`
}

export function useDeck(slug: string, slides: SlideModule[]) {
  const totalSlides = slides.length

  const [index, setIndex] = useState(() => {
    const saved = localStorage.getItem(storageKey(slug))
    const parsed = saved ? parseInt(saved, 10) : 0
    return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), Math.max(totalSlides - 1, 0)) : 0
  })
  const [direction, setDirection] = useState(1)

  const [substep, setSubstep] = useState(() => {
    const saved = localStorage.getItem(substepStorageKey(slug))
    const parsed = saved ? parseInt(saved, 10) : 0
    if (!Number.isFinite(parsed)) return 0
    // Clamp against the restored slide's substep count
    const restoredIndex = Math.min(Math.max(parseInt(localStorage.getItem(storageKey(slug)) ?? '0', 10) || 0, 0), Math.max(totalSlides - 1, 0))
    const maxSub = (slides[restoredIndex]?.substeps ?? 1) - 1
    return Math.min(Math.max(parsed, 0), Math.max(maxSub, 0))
  })

  // Refs for synchronous access in callbacks (prevents stale reads during rapid key presses)
  const indexRef = useRef(index)
  const substepRef = useRef(substep)

  // Per-slide substep memory (session-only, not persisted)
  const substepMapRef = useRef<Record<number, number>>({})

  // Seed map with initial state
  substepMapRef.current[index] = substep

  // Persist slide index
  useEffect(() => {
    if (totalSlides > 0) {
      localStorage.setItem(storageKey(slug), String(index))
    }
  }, [slug, index, totalSlides])

  // Persist substep
  useEffect(() => {
    localStorage.setItem(substepStorageKey(slug), String(substep))
  }, [slug, substep])

  // Keep refs in sync during render
  indexRef.current = index
  substepRef.current = substep

  const getMaxSubstep = useCallback((slideIdx: number) => {
    return (slides[slideIdx]?.substeps ?? 1) - 1
  }, [slides])

  const advance = useCallback(() => {
    if (totalSlides === 0) return
    const currentIdx = indexRef.current
    const currentSub = substepRef.current
    const maxSub = getMaxSubstep(currentIdx)

    if (currentSub < maxSub) {
      const newSub = currentSub + 1
      substepMapRef.current[currentIdx] = newSub
      substepRef.current = newSub
      setSubstep(newSub)
    } else {
      const nextIdx = currentIdx + 1
      if (nextIdx >= totalSlides) return
      substepMapRef.current[nextIdx] = 0
      indexRef.current = nextIdx
      substepRef.current = 0
      setDirection(1)
      setIndex(nextIdx)
      setSubstep(0)
    }
  }, [totalSlides, getMaxSubstep])

  const retreat = useCallback(() => {
    if (totalSlides === 0) return
    const currentIdx = indexRef.current
    const currentSub = substepRef.current

    if (currentSub > 0) {
      const newSub = currentSub - 1
      substepMapRef.current[currentIdx] = newSub
      substepRef.current = newSub
      setSubstep(newSub)
    } else {
      const prevIdx = currentIdx - 1
      if (prevIdx < 0) return
      const maxSub = getMaxSubstep(prevIdx)
      substepMapRef.current[prevIdx] = maxSub
      indexRef.current = prevIdx
      substepRef.current = maxSub
      setDirection(-1)
      setIndex(prevIdx)
      setSubstep(maxSub)
    }
  }, [totalSlides, getMaxSubstep])

  const skipForward = useCallback(() => {
    if (totalSlides === 0) return
    const currentIdx = indexRef.current
    const nextIdx = currentIdx + 1
    if (nextIdx >= totalSlides) return
    // Save current substep before leaving
    substepMapRef.current[currentIdx] = substepRef.current
    const savedSub = substepMapRef.current[nextIdx] ?? 0
    const maxSub = getMaxSubstep(nextIdx)
    const clampedSub = Math.min(savedSub, maxSub)
    indexRef.current = nextIdx
    substepRef.current = clampedSub
    setDirection(1)
    setIndex(nextIdx)
    setSubstep(clampedSub)
  }, [totalSlides, getMaxSubstep])

  const skipBack = useCallback(() => {
    if (totalSlides === 0) return
    const currentIdx = indexRef.current
    const prevIdx = currentIdx - 1
    if (prevIdx < 0) return
    // Save current substep before leaving
    substepMapRef.current[currentIdx] = substepRef.current
    const savedSub = substepMapRef.current[prevIdx] ?? 0
    const maxSub = getMaxSubstep(prevIdx)
    const clampedSub = Math.min(savedSub, maxSub)
    indexRef.current = prevIdx
    substepRef.current = clampedSub
    setDirection(-1)
    setIndex(prevIdx)
    setSubstep(clampedSub)
  }, [totalSlides, getMaxSubstep])

  const goTo = useCallback(
    (n: number, sub?: number) => {
      if (totalSlides === 0) return
      const targetIndex = Math.min(Math.max(n, 0), totalSlides - 1)
      setDirection(n > indexRef.current ? 1 : -1)
      indexRef.current = targetIndex
      setIndex(targetIndex)

      const maxSub = getMaxSubstep(targetIndex)
      if (sub !== undefined) {
        const clamped = Math.min(Math.max(sub, 0), maxSub)
        substepMapRef.current[targetIndex] = clamped
        substepRef.current = clamped
        setSubstep(clamped)
      } else {
        const savedSub = substepMapRef.current[targetIndex] ?? 0
        const clamped = Math.min(savedSub, maxSub)
        substepRef.current = clamped
        setSubstep(clamped)
      }
    },
    [totalSlides, getMaxSubstep],
  )

  const clampedSubstep = Math.min(substep, getMaxSubstep(index))

  return { index, direction, substep: clampedSubstep, advance, retreat, skipForward, skipBack, goTo }
}
