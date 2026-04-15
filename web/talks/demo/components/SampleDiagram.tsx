import { useState } from 'react'
import { motion } from 'motion/react'

const FULL_VIEW = '0 0 600 400'
const ZOOMED_VIEW = '150 80 300 200'

function Box({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={120} height={50} rx={8} fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth={2} />
      <text x={x + 60} y={y + 30} textAnchor="middle" fill="var(--color-text-primary)" fontSize={13} fontWeight={500}>
        {label}
      </text>
    </g>
  )
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-text-secondary)" strokeWidth={1.5} markerEnd="url(#arrowhead)" />
}

export default function SampleDiagram() {
  const [zoomed, setZoomed] = useState(false)

  return (
    <motion.svg
      viewBox={FULL_VIEW}
      animate={{ viewBox: zoomed ? ZOOMED_VIEW : FULL_VIEW }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      width="100%"
      height="100%"
      style={{ cursor: 'pointer', maxHeight: '100%' }}
      onClick={() => setZoomed((z) => !z)}
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-text-secondary)" />
        </marker>
      </defs>
      <Box x={240} y={20} label="Input" />
      <Arrow x1={300} y1={70} x2={300} y2={110} />
      <Box x={240} y={110} label="Attention" />
      <Arrow x1={300} y1={160} x2={300} y2={200} />
      <Box x={240} y={200} label="FFN" />
      <Arrow x1={300} y1={250} x2={300} y2={290} />
      <Box x={240} y={290} label="Output" />
      <text x={300} y={380} textAnchor="middle" fill="var(--color-text-secondary)" fontSize={11}>
        Click to {zoomed ? 'zoom out' : 'zoom in'}
      </text>
    </motion.svg>
  )
}
