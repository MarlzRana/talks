import { useEffect } from 'react'

interface KeyNavOptions {
  advance: () => void
  retreat: () => void
  skipForward: () => void
  skipBack: () => void
  escape: () => void
  toggleFullscreen: () => void
  togglePresenter: () => void
}

export function useKeyNav({ advance, retreat, skipForward, skipBack, escape, toggleFullscreen, togglePresenter }: KeyNavOptions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          advance()
          break
        case 'ArrowLeft':
          e.preventDefault()
          retreat()
          break
        case 'ArrowUp':
          e.preventDefault()
          skipForward()
          break
        case 'ArrowDown':
          e.preventDefault()
          skipBack()
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
  }, [advance, retreat, skipForward, skipBack, escape, toggleFullscreen, togglePresenter])
}
