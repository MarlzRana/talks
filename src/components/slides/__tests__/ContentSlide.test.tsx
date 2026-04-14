import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ContentSlide from '../ContentSlide'

describe('ContentSlide', () => {
  it('renders title', () => {
    render(<ContentSlide title="My Title">Content here</ContentSlide>)
    expect(screen.getByText('My Title')).toBeInTheDocument()
  })

  it('renders children in body area', () => {
    render(<ContentSlide title="Title"><p>Body text</p></ContentSlide>)
    expect(screen.getByText('Body text')).toBeInTheDocument()
  })

  it('renders complex nested children', () => {
    render(
      <ContentSlide title="Title">
        <ul>
          <li>Item one</li>
          <li>Item two</li>
        </ul>
        <p>Additional paragraph</p>
      </ContentSlide>,
    )
    expect(screen.getByText('Item one')).toBeInTheDocument()
    expect(screen.getByText('Item two')).toBeInTheDocument()
    expect(screen.getByText('Additional paragraph')).toBeInTheDocument()
  })
})
