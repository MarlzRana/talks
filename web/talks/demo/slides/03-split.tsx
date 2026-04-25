import SplitSlide from '@/components/slides/SplitSlide'

export default function DemoSplitSlide() {
  return (
    <SplitSlide title="Split layout" ratio="40/60">
      <SplitSlide.Text>
        <p>The left column holds explanatory text. The right column holds a visual — a chart, diagram, or 3D scene.</p>
        <p>This slide uses a 40/60 split. The ratio prop also accepts 50/50 and 60/40.</p>
      </SplitSlide.Text>
      <SplitSlide.Visual>
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'var(--accent-violet)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ink-on-dark-1)',
            fontSize: '1.5rem',
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
          }}
        >
          Visual area
        </div>
      </SplitSlide.Visual>
    </SplitSlide>
  )
}
