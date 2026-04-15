import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TalkPicker from '../TalkPicker'

vi.mock('@/lib/talks', () => ({
  talks: [
    { slug: 'talk-a', title: 'Talk A', description: 'First talk', slides: [], tags: ['demo'] },
    { slug: 'talk-b', title: 'Talk B', description: 'Second talk', slides: [] },
  ],
}))

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/talks']}>
      <TalkPicker />
    </MemoryRouter>,
  )
}

describe('TalkPicker', () => {
  it('renders the "Talks" heading', () => {
    renderWithRouter()
    expect(screen.getByRole('heading', { name: 'Talks' })).toBeInTheDocument()
  })

  it('renders a link for each talk', () => {
    renderWithRouter()
    expect(screen.getByText('Talk A')).toBeInTheDocument()
    expect(screen.getByText('Talk B')).toBeInTheDocument()
  })

  it('links point to correct URLs', () => {
    renderWithRouter()
    const linkA = screen.getByText('Talk A').closest('a')
    const linkB = screen.getByText('Talk B').closest('a')
    expect(linkA).toHaveAttribute('href', '/talks/talk-a')
    expect(linkB).toHaveAttribute('href', '/talks/talk-b')
  })

  it('renders description text for each talk', () => {
    renderWithRouter()
    expect(screen.getByText('First talk')).toBeInTheDocument()
    expect(screen.getByText('Second talk')).toBeInTheDocument()
  })

  it('renders tags when present', () => {
    renderWithRouter()
    expect(screen.getByText('demo')).toBeInTheDocument()
  })
})
