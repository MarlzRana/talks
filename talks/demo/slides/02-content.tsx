import ContentSlide from '@/components/slides/ContentSlide'

export default function DemoContentSlide() {
  return (
    <ContentSlide title="Content layout">
      <p>
        This template places a title at the top and renders freeform content below. Use it for text-heavy explanatory
        slides where the message is in the prose.
      </p>
      <p>
        Multiple paragraphs are spaced automatically. The content area grows to fill available space, and the text
        maxes out at a comfortable reading width.
      </p>
      <p>
        Slides are full React components — anything that works in JSX works here. State, effects, third-party
        libraries — no limitations.
      </p>
    </ContentSlide>
  )
}
