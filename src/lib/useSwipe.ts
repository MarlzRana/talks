import { useDrag } from '@use-gesture/react'

interface SwipeOptions {
  next: () => void
  prev: () => void
}

export function useSwipe({ next, prev }: SwipeOptions) {
  return useDrag(
    (state) => {
      const swipeX = state.swipe[0]
      if (swipeX === -1) next()
      else if (swipeX === 1) prev()
    },
    {
      axis: 'x',
      swipe: { velocity: 0.5, distance: 50, duration: 250 },
      filterTaps: true,
    },
  )
}
