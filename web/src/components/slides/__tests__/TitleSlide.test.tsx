import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TitleSlide from '../TitleSlide'

describe('TitleSlide', () => {
  it('renders title text', () => {
    render(<TitleSlide title="Hello World" />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<TitleSlide title="Title" subtitle="A subtitle" />)
    expect(screen.getByText('A subtitle')).toBeInTheDocument()
  })

  it('renders author when provided', () => {
    render(<TitleSlide title="Title" author="Jane Doe" />)
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })

  it('does not render subtitle element when not provided', () => {
    const { container } = render(<TitleSlide title="Title" />)
    // Title is an h1, subtitle would be a p — with no subtitle, only the h1 should exist
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs).toHaveLength(0)
  })

  it('does not render author element when not provided', () => {
    // Provide subtitle but not author — only one p should exist (the subtitle)
    const { container } = render(<TitleSlide title="Title" subtitle="Sub" />)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs).toHaveLength(1)
    expect(paragraphs[0].textContent).toBe('Sub')
  })
})
