import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SplitSlide from '../SplitSlide'

describe('SplitSlide', () => {
  it('SplitSlide.Text and SplitSlide.Visual exist as properties', () => {
    expect(SplitSlide.Text).toBeDefined()
    expect(typeof SplitSlide.Text).toBe('function')
    expect(SplitSlide.Visual).toBeDefined()
    expect(typeof SplitSlide.Visual).toBe('function')
  })

  it('renders children from Text and Visual sub-components', () => {
    render(
      <SplitSlide>
        <SplitSlide.Text>Left content</SplitSlide.Text>
        <SplitSlide.Visual>Right content</SplitSlide.Visual>
      </SplitSlide>,
    )
    expect(screen.getByText('Left content')).toBeInTheDocument()
    expect(screen.getByText('Right content')).toBeInTheDocument()
  })

  it("data-ratio attribute defaults to '50/50'", () => {
    const { container } = render(
      <SplitSlide>
        <SplitSlide.Text>Text</SplitSlide.Text>
        <SplitSlide.Visual>Visual</SplitSlide.Visual>
      </SplitSlide>,
    )
    const columns = container.querySelector('[data-ratio]')
    expect(columns).not.toBeNull()
    expect(columns!.getAttribute('data-ratio')).toBe('50/50')
  })

  it("data-ratio reflects the ratio prop ('40/60')", () => {
    const { container } = render(
      <SplitSlide ratio="40/60">
        <SplitSlide.Text>Text</SplitSlide.Text>
        <SplitSlide.Visual>Visual</SplitSlide.Visual>
      </SplitSlide>,
    )
    const columns = container.querySelector('[data-ratio]')
    expect(columns!.getAttribute('data-ratio')).toBe('40/60')
  })

  it("data-ratio reflects the ratio prop ('60/40')", () => {
    const { container } = render(
      <SplitSlide ratio="60/40">
        <SplitSlide.Text>Text</SplitSlide.Text>
        <SplitSlide.Visual>Visual</SplitSlide.Visual>
      </SplitSlide>,
    )
    const columns = container.querySelector('[data-ratio]')
    expect(columns!.getAttribute('data-ratio')).toBe('60/40')
  })

  it('title renders when provided', () => {
    render(
      <SplitSlide title="Split Title">
        <SplitSlide.Text>Text</SplitSlide.Text>
      </SplitSlide>,
    )
    expect(screen.getByText('Split Title')).toBeInTheDocument()
  })

  it('title omitted when not provided', () => {
    const { container } = render(
      <SplitSlide>
        <SplitSlide.Text>Text</SplitSlide.Text>
      </SplitSlide>,
    )
    const headings = container.querySelectorAll('h2')
    expect(headings).toHaveLength(0)
  })
})
