import { useState } from 'react'
import ContentSlide from '@/components/slides/ContentSlide'

export default function DemoInteractiveSlide() {
  const [value, setValue] = useState(50)

  return (
    <ContentSlide title="Interactive controls">
      <p>Slides are React components — state works normally.</p>
      <div style={{ marginTop: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{ width: '100%', maxWidth: 400, accentColor: 'var(--accent-violet)' }}
        />
        <div
          style={{
            fontSize: '4rem',
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--accent-violet)',
            fontFamily: 'var(--font-display)',
          }}
        >
          {value}
        </div>
        <div
          style={{
            height: 24,
            maxWidth: 400,
            background: 'var(--ink-4)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${value}%`,
              background: 'var(--accent-violet)',
              transition: 'width 0.1s ease',
            }}
          />
        </div>
      </div>
    </ContentSlide>
  )
}
