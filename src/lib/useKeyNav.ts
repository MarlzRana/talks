import { useEffect } from 'react'

interface KeyNavOptions {
  next: () => void
  prev: () => void
  escape: () => void
  toggleFullscreen: () => void
  togglePresenter: () => void
}

export function useKeyNav({ next, prev, escape, toggleFullscreen, togglePresenter }: KeyNavOptions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prev()
          break
        case 'Escape':
          escape()
          break
        case 'f':
        case 'F':
          toggleFullscreen()
          break
        case 'p':
        case 'P':
          togglePresenter()
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev, escape, toggleFullscreen, togglePresenter])
}
