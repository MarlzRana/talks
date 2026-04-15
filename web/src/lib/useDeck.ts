import { useState, useCallback, useEffect, useRef } from 'react'

function storageKey(slug: string) {
  return `deck:${slug}`
}

export function useDeck(slug: string, totalSlides: number) {
  const [index, setIndex] = useState(() => {
    const saved = localStorage.getItem(storageKey(slug))
    const parsed = saved ? parseInt(saved, 10) : 0
    return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), Math.max(totalSlides - 1, 0)) : 0
  })
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    if (totalSlides > 0) {
      localStorage.setItem(storageKey(slug), String(index))
    }
  }, [slug, index, totalSlides])

  const next = useCallback(() => {
    setDirection(1)
    setIndex((i) => Math.min(i + 1, totalSlides - 1))
  }, [totalSlides])

  const prev = useCallback(() => {
    setDirection(-1)
    setIndex((i) => Math.max(i - 1, 0))
  }, [])

  const indexRef = useRef(index)
  indexRef.current = index

  const goTo = useCallback(
    (n: number) => {
      setDirection(n > indexRef.current ? 1 : -1)
      setIndex(Math.min(Math.max(n, 0), totalSlides - 1))
    },
    [totalSlides],
  )

  return { index, direction, next, prev, goTo }
}
