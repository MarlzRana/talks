import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FullscreenSlide from '../FullscreenSlide'

describe('FullscreenSlide', () => {
  it('renders children', () => {
    render(<FullscreenSlide><div>Full content</div></FullscreenSlide>)
    expect(screen.getByText('Full content')).toBeInTheDocument()
  })

  it('renders caption when provided', () => {
    render(<FullscreenSlide caption="Photo credit: NASA"><img alt="space" /></FullscreenSlide>)
    expect(screen.getByText('Photo credit: NASA')).toBeInTheDocument()
  })

  it('does not render caption when not provided', () => {
    const { container } = render(<FullscreenSlide><div>Content</div></FullscreenSlide>)
    // The container has two children divs: .content wrapping the children.
    // Without a caption, there should be only the content div, not a caption div.
    const topDiv = container.firstElementChild!
    // The component structure: outer div > .content div + optional .caption div
    // With no caption, only the .content div should be a child
    expect(topDiv.children).toHaveLength(1)
  })
})
