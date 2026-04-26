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
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0
  })

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

  const next = useCallback(() => {
    setDirection(1)
    setIndex((i) => Math.min(i + 1, totalSlides - 1))
    setSubstep(0)
  }, [totalSlides])

  const prev = useCallback(() => {
    setDirection(-1)
    setIndex((i) => Math.max(i - 1, 0))
    setSubstep(0)
  }, [])

  const indexRef = useRef(index)
  indexRef.current = index

  const goTo = useCallback(
    (n: number, sub?: number) => {
      const targetIndex = Math.min(Math.max(n, 0), totalSlides - 1)
      setDirection(n > indexRef.current ? 1 : -1)
      setIndex(targetIndex)
      if (sub !== undefined) {
        const maxSub = (slides[targetIndex]?.substeps ?? 1) - 1
        setSubstep(Math.min(Math.max(sub, 0), maxSub))
      }
    },
    [totalSlides, slides],
  )

  const currentSlideSubsteps = (slides[index]?.substeps ?? 1) - 1 // max substep index

  const nextSubstep = useCallback(() => {
    setSubstep((s) => Math.min(s + 1, currentSlideSubsteps))
  }, [currentSlideSubsteps])

  const prevSubstep = useCallback(() => {
    setSubstep((s) => Math.max(s - 1, 0))
  }, [])

  const clampedSubstep = Math.min(substep, currentSlideSubsteps)

  return { index, direction, next, prev, goTo, substep: clampedSubstep, nextSubstep, prevSubstep }
}
