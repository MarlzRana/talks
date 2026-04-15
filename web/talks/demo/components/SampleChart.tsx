import { useMemo } from 'react'
import * as d3 from 'd3'
import { motion } from 'motion/react'

const data = [
  { label: 'Attention', value: 92 },
  { label: 'FFN', value: 78 },
  { label: 'LayerNorm', value: 65 },
  { label: 'Embedding', value: 85 },
  { label: 'Softmax', value: 71 },
]

const WIDTH = 400
const HEIGHT = 280
const MARGIN = { top: 20, right: 20, bottom: 40, left: 60 }

export default function SampleChart() {
  const { x, y } = useMemo(() => {
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([MARGIN.left, WIDTH - MARGIN.right])
      .padding(0.3)

    const y = d3
      .scaleLinear()
      .domain([0, 100])
      .range([HEIGHT - MARGIN.bottom, MARGIN.top])

    return { x, y }
  }, [])

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" style={{ maxWidth: WIDTH }}>
      {data.map((d) => (
        <motion.rect
          key={d.label}
          x={x(d.label)}
          width={x.bandwidth()}
          y={y(d.value)}
          height={HEIGHT - MARGIN.bottom - y(d.value)}
          rx={4}
          fill="var(--color-accent)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: data.indexOf(d) * 0.1, ease: 'easeOut' }}
          style={{ originY: 1, transformBox: 'fill-box' }}
        />
      ))}
      {data.map((d) => (
        <text
          key={`label-${d.label}`}
          x={(x(d.label) ?? 0) + x.bandwidth() / 2}
          y={HEIGHT - MARGIN.bottom + 20}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize={11}
        >
          {d.label}
        </text>
      ))}
      {y.ticks(5).map((tick) => (
        <g key={tick}>
          <line
            x1={MARGIN.left}
            x2={WIDTH - MARGIN.right}
            y1={y(tick)}
            y2={y(tick)}
            stroke="var(--color-border)"
            strokeDasharray="2,4"
          />
          <text x={MARGIN.left - 8} y={y(tick) + 4} textAnchor="end" fill="var(--color-text-secondary)" fontSize={10}>
            {tick}
          </text>
        </g>
      ))}
    </svg>
  )
}
