import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

export function usePresenter() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isPresenter = searchParams.get('presenter') === 'true'

  const togglePresenter = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (next.get('presenter') === 'true') {
        next.delete('presenter')
      } else {
        next.set('presenter', 'true')
      }
      return next
    })
  }, [setSearchParams])

  return { isPresenter, togglePresenter }
}
