import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

vi.mock('shiki', () => ({
  codeToHtml: vi.fn().mockResolvedValue('<pre>code</pre>'),
}))

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: any) => children,
  motion: new Proxy(
    {},
    {
      get: (_, tag) =>
        ({ children, ...props }: any) =>
          React.createElement(tag as string, props, children),
    },
  ),
  useInView: () => false,
}))

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="r3f-canvas">{children}</div>,
  useFrame: () => {},
}))

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
}))

vi.mock('d3', () => ({
  scaleBand: () => {
    const scale = (val: string) => 0
    scale.domain = () => scale
    scale.range = () => scale
    scale.padding = () => scale
    scale.bandwidth = () => 40
    return scale
  },
  scaleLinear: () => {
    const scale = (val: number) => val
    scale.domain = () => scale
    scale.range = () => scale
    scale.ticks = () => [0, 25, 50, 75, 100]
    return scale
  },
}))

vi.mock('katex', () => ({
  default: {
    renderToString: (tex: string) => `<span class="katex">${tex}</span>`,
  },
}))

vi.mock('katex/dist/katex.min.css', () => ({}))

// Import slides after mocks are set up
import { slides } from '@talks/demo/slides'
import * as TitleSlide from '@talks/demo/slides/01-title'
import * as CodeSlide from '@talks/demo/slides/04-code'
import * as CustomTransitionSlide from '@talks/demo/slides/12-custom-transition'

describe('Demo slide rendering', () => {
  it('has 12 slides in the demo deck', () => {
    expect(slides).toHaveLength(12)
  })

  slides.forEach((slide, index) => {
    it(`slide ${index + 1} renders without throwing`, () => {
      const SlideComponent = slide.default
      expect(() => render(<SlideComponent />)).not.toThrow()
    })
  })

  it('slide 01-title exports string notes', () => {
    expect(TitleSlide.notes).toBeDefined()
    expect(typeof TitleSlide.notes).toBe('string')
    expect(TitleSlide.notes!.length).toBeGreaterThan(0)
  })

  it('slide 04-code exports string notes', () => {
    expect(CodeSlide.notes).toBeDefined()
    expect(typeof CodeSlide.notes).toBe('string')
    expect(CodeSlide.notes!.length).toBeGreaterThan(0)
  })

  it('slide 12 exports a transition object with enter/center/exit properties', () => {
    expect(CustomTransitionSlide.transition).toBeDefined()
    expect(CustomTransitionSlide.transition).toHaveProperty('enter')
    expect(CustomTransitionSlide.transition).toHaveProperty('center')
    expect(CustomTransitionSlide.transition).toHaveProperty('exit')
  })

  it('slide 12 transition has config with duration and ease', () => {
    expect(CustomTransitionSlide.transition.config).toBeDefined()
    expect(CustomTransitionSlide.transition.config!.duration).toBe(0.5)
    expect(CustomTransitionSlide.transition.config!.ease).toBe('easeOut')
  })
})
