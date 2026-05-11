import { motion } from 'motion/react'

const ACCENT = '#4A5FC1'
const VB_W = 200
const VB_H = 440

const BLOCKS = [
  { label: 'Model', y: 30 },
  { label: 'Agent', y: 140 },
  { label: 'Tools', y: 250 },
  { label: 'Environment', y: 360 },
]

const BLOCK_W = 120
const BLOCK_H = 55
const BLOCK_X = (VB_W - BLOCK_W) / 2

// Directional arrows that can be individually highlighted
// 'agent-to-model' = up arrow from Agent to Model
// 'model-to-agent' = down arrow from Model to Agent
// 'agent-to-tools' = down arrow from Agent to Tools
// 'tools-to-agent' = up arrow from Tools to Agent
// 'tools-to-env'   = down arrow from Tools to Environment
// 'env-to-tools'   = up arrow from Environment to Tools
export type ArrowDirection =
  | 'agent-to-model'
  | 'model-to-agent'
  | 'agent-to-tools'
  | 'tools-to-agent'
  | 'tools-to-env'
  | 'env-to-tools'
  | null

interface AgentStackDiagramProps {
  activeArrow?: ArrowDirection
}

function DirectionalArrow({
  fromY,
  toY,
  direction,
  active,
}: {
  fromY: number
  toY: number
  direction: 'down' | 'up'
  active: boolean
}) {
  const x = BLOCK_X + BLOCK_W / 2
  const offset = direction === 'down' ? -10 : 10

  let startY: number, endY: number
  if (direction === 'down') {
    startY = fromY + BLOCK_H + 4
    endY = toY - 10
  } else {
    startY = toY - 4
    endY = fromY + BLOCK_H + 10
  }

  const strokeColor = active ? ACCENT : 'var(--ink-on-dark-2)'
  const strokeWidth = active ? 2 : 1
  const opacity = active ? 1 : 0.4
  const filter = active ? `drop-shadow(0 0 4px ${ACCENT})` : undefined

  return (
    <motion.line
      x1={x + offset}
      y1={startY}
      x2={x + offset}
      y2={endY}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      opacity={opacity}
      markerEnd="url(#stackArrow)"
      animate={{ stroke: strokeColor, opacity, strokeWidth }}
      transition={{ duration: 0.25 }}
      filter={filter}
    />
  )
}

export default function AgentStackDiagram({ activeArrow = null }: AgentStackDiagramProps) {
  return (
    <motion.svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width="100%"
      height="100%"
      style={{ maxHeight: '100%' }}
      preserveAspectRatio="xMidYMid meet"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <defs>
        <marker id="stackArrow" markerWidth="6" markerHeight="5" refX="0" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill={ACCENT} />
        </marker>
      </defs>

      {/* Blocks */}
      {BLOCKS.map((block) => (
        <g key={block.label}>
          <rect
            x={BLOCK_X}
            y={block.y}
            width={BLOCK_W}
            height={BLOCK_H}
            rx={4}
            fill={`${ACCENT}12`}
            stroke={ACCENT}
            strokeWidth={1.2}
          />
          <text
            x={BLOCK_X + BLOCK_W / 2}
            y={block.y + BLOCK_H / 2 + 5}
            textAnchor="middle"
            fill="var(--ink-on-dark-1)"
            fontSize={12}
            fontFamily="var(--font-mono)"
            fontWeight={600}
          >
            {block.label}
          </text>
        </g>
      ))}

      {/* Model ↔ Agent arrows */}
      <DirectionalArrow
        fromY={BLOCKS[0]!.y}
        toY={BLOCKS[1]!.y}
        direction="down"
        active={activeArrow === 'model-to-agent'}
      />
      <DirectionalArrow
        fromY={BLOCKS[0]!.y}
        toY={BLOCKS[1]!.y}
        direction="up"
        active={activeArrow === 'agent-to-model'}
      />

      {/* Agent ↔ Tools arrows */}
      <DirectionalArrow
        fromY={BLOCKS[1]!.y}
        toY={BLOCKS[2]!.y}
        direction="down"
        active={activeArrow === 'agent-to-tools'}
      />
      <DirectionalArrow
        fromY={BLOCKS[1]!.y}
        toY={BLOCKS[2]!.y}
        direction="up"
        active={activeArrow === 'tools-to-agent'}
      />

      {/* Tools ↔ Environment arrows */}
      <DirectionalArrow
        fromY={BLOCKS[2]!.y}
        toY={BLOCKS[3]!.y}
        direction="down"
        active={activeArrow === 'tools-to-env'}
      />
      <DirectionalArrow
        fromY={BLOCKS[2]!.y}
        toY={BLOCKS[3]!.y}
        direction="up"
        active={activeArrow === 'env-to-tools'}
      />
    </motion.svg>
  )
}
