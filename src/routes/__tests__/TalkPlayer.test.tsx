import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { createSlideModule, createTalkConfig } from '@/test/mocks'
import TalkPlayer from '../TalkPlayer'

const mockUseDeck = vi.fn()
const mockUsePresenter = vi.fn()
const mockUseBroadcast = vi.fn()

vi.mock('@/lib/talks', () => ({
  talks: [
    createTalkConfig({
      slug: 'test-talk',
      title: 'Test Talk',
      description: 'A test talk',
      theme: 'dark',
      slides: [createSlideModule(), createSlideModule(), createSlideModule()],
    }),
  ],
}))

vi.mock('@/lib/useDeck', () => ({
  useDeck: (...args: unknown[]) => mockUseDeck(...args),
}))

vi.mock('@/lib/useKeyNav', () => ({
  useKeyNav: vi.fn(),
}))

vi.mock('@/lib/useFullscreen', () => ({
  useFullscreen: () => ({ isFullscreen: false, toggle: vi.fn() }),
}))

vi.mock('@/lib/usePresenter', () => ({
  usePresenter: (...args: unknown[]) => mockUsePresenter(...args),
}))

vi.mock('@/lib/useBroadcast', () => ({
  useBroadcast: (...args: unknown[]) => mockUseBroadcast(...args),
}))

vi.mock('@/components/player/DeckPlayer', () => ({
  default: (props: any) => <div data-testid="deck-player" data-index={props.currentIndex} />,
}))

vi.mock('@/components/player/SlideProgress', () => ({
  default: () => <div data-testid="slide-progress" />,
}))

vi.mock('@/components/player/SlideControls', () => ({
  default: () => <div data-testid="slide-controls" />,
}))

vi.mock('@/components/player/PresenterView', () => ({
  default: () => <div data-testid="presenter-view" />,
}))

function renderWithRoute(entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/talks/:slug" element={<TalkPlayer />} />
        <Route path="/talks" element={<div data-testid="talks-list">Talks List</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('TalkPlayer', () => {
  beforeEach(() => {
    mockUseDeck.mockReturnValue({
      index: 0,
      direction: 1,
      next: vi.fn(),
      prev: vi.fn(),
      goTo: vi.fn(),
    })
    mockUsePresenter.mockReturnValue({
      isPresenter: false,
      togglePresenter: vi.fn(),
    })
    mockUseBroadcast.mockReturnValue({
      send: vi.fn(),
    })
  })

  it('renders DeckPlayer for a valid slug', () => {
    renderWithRoute('/talks/test-talk')
    expect(screen.getByTestId('deck-player')).toBeInTheDocument()
  })

  it('renders SlideProgress and SlideControls alongside DeckPlayer', () => {
    renderWithRoute('/talks/test-talk')
    expect(screen.getByTestId('slide-progress')).toBeInTheDocument()
    expect(screen.getByTestId('slide-controls')).toBeInTheDocument()
  })

  it('redirects to /talks for an invalid slug', () => {
    renderWithRoute('/talks/nonexistent')
    expect(screen.queryByTestId('deck-player')).not.toBeInTheDocument()
    expect(screen.getByTestId('talks-list')).toBeInTheDocument()
  })

  it('renders PresenterView when isPresenter is true', () => {
    mockUsePresenter.mockReturnValue({
      isPresenter: true,
      togglePresenter: vi.fn(),
    })
    renderWithRoute('/talks/test-talk')
    expect(screen.getByTestId('presenter-view')).toBeInTheDocument()
    expect(screen.queryByTestId('deck-player')).not.toBeInTheDocument()
  })

  it('does not render PresenterView when isPresenter is false', () => {
    renderWithRoute('/talks/test-talk')
    expect(screen.queryByTestId('presenter-view')).not.toBeInTheDocument()
    expect(screen.getByTestId('deck-player')).toBeInTheDocument()
  })

  it('applies data-theme attribute from talk config', () => {
    renderWithRoute('/talks/test-talk')
    const container = screen.getByTestId('deck-player').parentElement
    expect(container).toHaveAttribute('data-theme', 'dark')
  })

  it('passes the current index to DeckPlayer', () => {
    mockUseDeck.mockReturnValue({
      index: 2,
      direction: 1,
      next: vi.fn(),
      prev: vi.fn(),
      goTo: vi.fn(),
    })
    renderWithRoute('/talks/test-talk')
    expect(screen.getByTestId('deck-player')).toHaveAttribute('data-index', '2')
  })
})
