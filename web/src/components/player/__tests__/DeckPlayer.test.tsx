import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { SlideModule } from '@/types'
import { createSlideModule } from '@/test/mocks'

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  motion: { div: ({ children, ...props }: any) => <div {...props}>{children}</div> },
}))

vi.mock('@/lib/useSwipe', () => ({
  useSwipe: () => () => ({}),
}))

import DeckPlayer from '../DeckPlayer'

function makeSlide(text: string): SlideModule {
  return createSlideModule({
    default: function TestSlide() {
      return <div>{text}</div>
    },
  })
}

describe('DeckPlayer', () => {
  it('renders the slide component from slides[currentIndex].default', () => {
    const slides = [makeSlide('Slide A'), makeSlide('Slide B'), makeSlide('Slide C')]
    render(<DeckPlayer slides={slides} currentIndex={1} direction={1} />)
    expect(screen.getByText('Slide B')).toBeInTheDocument()
  })

  it('returns null when slides[currentIndex] is undefined (empty slides array)', () => {
    const { container } = render(<DeckPlayer slides={[]} currentIndex={0} direction={1} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders different slide when currentIndex changes', () => {
    const slides = [makeSlide('First'), makeSlide('Second')]
    const { rerender } = render(<DeckPlayer slides={slides} currentIndex={0} direction={1} />)
    expect(screen.getByText('First')).toBeInTheDocument()

    rerender(<DeckPlayer slides={slides} currentIndex={1} direction={1} />)
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.queryByText('First')).not.toBeInTheDocument()
  })
})
