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
            background: 'linear-gradient(135deg, var(--color-accent), #4a3f9f)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: 600,
          }}
        >
          Visual area
        </div>
      </SplitSlide.Visual>
    </SplitSlide>
  )
}
