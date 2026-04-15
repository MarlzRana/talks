import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const mockUseInView = vi.fn().mockReturnValue(false)
vi.mock('motion/react', () => ({
  useInView: (...args: unknown[]) => mockUseInView(...args),
}))

import ScrollySlide from '../ScrollySlide'

const sampleSteps = [
  { label: 'Step 1', body: 'First step body' },
  { label: 'Step 2', body: 'Second step body' },
  { label: 'Step 3', body: 'Third step body' },
]

describe('ScrollySlide', () => {
  it('renders all step labels and bodies', () => {
    const visual = vi.fn().mockReturnValue(<div>Visual content</div>)
    render(<ScrollySlide steps={sampleSteps} visual={visual} />)

    expect(screen.getByText('Step 1')).toBeInTheDocument()
    expect(screen.getByText('Step 2')).toBeInTheDocument()
    expect(screen.getByText('Step 3')).toBeInTheDocument()
    expect(screen.getByText('First step body')).toBeInTheDocument()
    expect(screen.getByText('Second step body')).toBeInTheDocument()
    expect(screen.getByText('Third step body')).toBeInTheDocument()
  })

  it('renders visual with initial activeStep (0)', () => {
    const visual = vi.fn().mockReturnValue(<div>Visual output</div>)
    render(<ScrollySlide steps={sampleSteps} visual={visual} />)

    expect(screen.getByText('Visual output')).toBeInTheDocument()
    // The initial call should be with 0 (the default useState value)
    expect(visual).toHaveBeenCalledWith(0)
  })

  it('visual function is called with a number', () => {
    const visual = vi.fn().mockReturnValue(<div>Visual</div>)
    render(<ScrollySlide steps={sampleSteps} visual={visual} />)

    expect(visual).toHaveBeenCalled()
    const firstCallArg = visual.mock.calls[0][0]
    expect(typeof firstCallArg).toBe('number')
  })
})
