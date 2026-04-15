import ContentSlide from '@/components/slides/ContentSlide'
import type { SlideTransition } from '@/types'

export default function DemoCustomTransitionSlide() {
  return (
    <ContentSlide title="Custom transition">
      <p>This slide uses a scale + fade transition instead of the default horizontal slide.</p>
      <p>
        Any slide can export a <code>transition</code> object to override the player default. Slides that don't
        export one get the standard directional transition automatically.
      </p>
    </ContentSlide>
  )
}

export const transition: SlideTransition = {
  enter: { opacity: 0, scale: 0.96 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.04 },
  config: { duration: 0.5, ease: 'easeOut' },
}
