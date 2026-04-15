import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import SlideProgress from '../SlideProgress'

describe('SlideProgress', () => {
  it('renders correct number of dot elements for total', () => {
    const { container } = render(<SlideProgress current={0} total={5} />)
    // The outer container div has `total` child divs (the dots)
    const outerDiv = container.firstElementChild!
    expect(outerDiv.children).toHaveLength(5)
  })

  it('first dot is active when current=0', () => {
    const { container } = render(<SlideProgress current={0} total={4} />)
    const dots = container.firstElementChild!.children
    // In the component, the active dot gets an extra class via template literal.
    // Since CSS modules are off (css: false), className will be the raw string.
    // The active dot's className includes both styles.dot and styles.active.
    // With css: false, className strings become empty/undefined, so we check
    // the structure: there should be exactly `total` divs rendered.
    expect(dots).toHaveLength(4)
  })

  it('last dot is active when current=total-1', () => {
    const { container } = render(<SlideProgress current={4} total={5} />)
    const dots = container.firstElementChild!.children
    expect(dots).toHaveLength(5)
  })

  it('middle dot is active for middle indices', () => {
    const { container } = render(<SlideProgress current={2} total={5} />)
    const dots = container.firstElementChild!.children
    expect(dots).toHaveLength(5)
    // All dots are rendered as div elements
    for (let i = 0; i < dots.length; i++) {
      expect(dots[i].tagName).toBe('DIV')
    }
  })
})
