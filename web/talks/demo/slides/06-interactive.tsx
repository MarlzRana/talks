import { useState } from 'react'
import ContentSlide from '@/components/slides/ContentSlide'

export default function DemoInteractiveSlide() {
  const [value, setValue] = useState(50)

  return (
    <ContentSlide title="Interactive controls">
      <p>Slides are React components — state works normally.</p>
      <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{ width: '100%', maxWidth: 400, accentColor: 'var(--color-accent)' }}
        />
        <div
          style={{
            fontSize: '4rem',
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--color-accent)',
          }}
        >
          {value}
        </div>
        <div
          style={{
            height: 24,
            maxWidth: 400,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--color-border)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${value}%`,
              background: 'var(--color-accent)',
              borderRadius: 'var(--radius-sm)',
              transition: 'width 0.1s ease',
            }}
          />
        </div>
      </div>
    </ContentSlide>
  )
}
