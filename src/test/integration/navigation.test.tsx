import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import TalkPlayer from '@/routes/TalkPlayer'

vi.mock('shiki', () => ({
  codeToHtml: vi.fn().mockResolvedValue('<pre>code</pre>'),
}))

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: any) => children,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useInView: () => false,
}))

vi.mock('@use-gesture/react', () => ({
  useDrag: () => () => ({}),
}))

vi.mock('@/lib/talks', async () => {
  const { createSlideModuleWithContent } = await import('@/test/mocks')
  return {
    talks: [
      {
        slug: 'test-talk',
        title: 'Test Talk',
        description: 'A test talk for navigation',
        theme: 'dark',
        slides: [
          createSlideModuleWithContent('Slide One'),
          createSlideModuleWithContent('Slide Two'),
          createSlideModuleWithContent('Slide Three'),
        ],
      },
    ],
  }
})

function renderPlayer() {
  return render(
    <MemoryRouter initialEntries={['/talks/test-talk']}>
      <Routes>
        <Route path="/talks/:slug" element={<TalkPlayer />} />
        <Route path="/talks" element={<div data-testid="talks-list">Talks List</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Navigation integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the first slide on initial load', () => {
    renderPlayer()
    expect(screen.getByText('Slide One')).toBeInTheDocument()
  })

  it('advances to the next slide on ArrowRight', () => {
    renderPlayer()
    expect(screen.getByText('Slide One')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('Slide Two')).toBeInTheDocument()
  })

  it('goes back to the previous slide on ArrowLeft', () => {
    renderPlayer()

    // Go forward first
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('Slide Two')).toBeInTheDocument()

    // Go back
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText('Slide One')).toBeInTheDocument()
  })

  it('cannot go below index 0', () => {
    renderPlayer()
    expect(screen.getByText('Slide One')).toBeInTheDocument()

    // Press left on the first slide — should stay on the first slide
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(screen.getByText('Slide One')).toBeInTheDocument()
  })

  it('cannot go above the last slide', () => {
    renderPlayer()

    // Navigate to the last slide
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('Slide Three')).toBeInTheDocument()

    // Press right on the last slide — should stay on the last slide
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(screen.getByText('Slide Three')).toBeInTheDocument()
  })

  it('persists position to localStorage after navigation', () => {
    renderPlayer()

    // Navigate forward twice
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    fireEvent.keyDown(window, { key: 'ArrowRight' })

    expect(localStorage.getItem('deck:test-talk')).toBe('2')
  })

  it('persists position 0 on initial render', () => {
    renderPlayer()
    expect(localStorage.getItem('deck:test-talk')).toBe('0')
  })

  it('navigates forward with Space key', () => {
    renderPlayer()
    expect(screen.getByText('Slide One')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: ' ' })
    expect(screen.getByText('Slide Two')).toBeInTheDocument()
  })
})
