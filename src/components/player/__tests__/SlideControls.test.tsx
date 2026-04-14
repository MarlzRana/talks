import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SlideControls from '../SlideControls'

describe('SlideControls', () => {
  it('previous button exists with aria-label "Previous slide"', () => {
    render(<SlideControls onPrev={() => {}} onNext={() => {}} />)
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeInTheDocument()
  })

  it('next button exists with aria-label "Next slide"', () => {
    render(<SlideControls onPrev={() => {}} onNext={() => {}} />)
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument()
  })

  it('clicking previous button calls onPrev', async () => {
    const user = userEvent.setup()
    const onPrev = vi.fn()
    render(<SlideControls onPrev={onPrev} onNext={() => {}} />)

    await user.click(screen.getByRole('button', { name: 'Previous slide' }))
    expect(onPrev).toHaveBeenCalledTimes(1)
  })

  it('clicking next button calls onNext', async () => {
    const user = userEvent.setup()
    const onNext = vi.fn()
    render(<SlideControls onPrev={() => {}} onNext={onNext} />)

    await user.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(onNext).toHaveBeenCalledTimes(1)
  })
})
