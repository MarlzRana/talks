import { motion, AnimatePresence } from 'motion/react'

const ACCENT = '#4A5FC1'
const SVG_WIDTH = 900
const SVG_HEIGHT = 400

// Box positions (horizontal layout)
const BOXES = [
  { label: 'Model', x: 60, y: 160, w: 130, h: 70 },
  { label: 'Agent Runner', x: 260, y: 160, w: 150, h: 70 },
  { label: 'Tools', x: 490, y: 160, w: 130, h: 70 },
  { label: 'Environment', x: 700, y: 160, w: 150, h: 70 },
]

interface ReactLoopDiagramProps {
  activeSubstep: number
}

function Box({ label, x, y, w, h }: { label: string; x: number; y: number; w: number; h: number }) {
  return (
    <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill={`${ACCENT}12`}
        stroke={ACCENT}
        strokeWidth={1.2}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 5}
        textAnchor="middle"
        fill="var(--ink-on-dark-1)"
        fontSize={13}
        fontFamily="var(--font-mono)"
        fontWeight={600}
      >
        {label}
      </text>
    </motion.g>
  )
}

function Arrow({
  d,
  label,
  labelX,
  labelY,
  visible,
  delay = 0,
  pulse = false,
}: {
  d: string
  label: string
  labelX: number
  labelY: number
  visible: boolean
  delay?: number
  pulse?: boolean
}) {
  if (!visible) return null

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay }}>
      <motion.path
        d={d}
        fill="none"
        stroke={ACCENT}
        strokeWidth={pulse ? 2.5 : 1.2}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1, strokeWidth: pulse ? 2.5 : 1.2 }}
        transition={{ duration: 0.4, delay, ease: 'easeOut' }}
        markerEnd="url(#reactArrow)"
        filter={pulse ? `drop-shadow(0 0 4px ${ACCENT})` : undefined}
      />
      <motion.text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        fill="var(--ink-on-dark-1)"
        fontSize={9}
        fontFamily="var(--font-mono)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={label}
      >
        {label}
      </motion.text>
    </motion.g>
  )
}

export default function ReactLoopDiagram({ activeSubstep }: ReactLoopDiagramProps) {
  const agentRunner = BOXES[1]!
  const model = BOXES[0]!
  const tools = BOXES[2]!
  const env = BOXES[3]!

  return (
    <motion.svg
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      width="100%"
      height="100%"
      style={{ maxHeight: '100%' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker id="reactArrow" markerWidth="6" markerHeight="5" refX="0" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill={ACCENT} />
        </marker>
      </defs>

      {/* Boxes */}
      {BOXES.map((box) => (
        <Box key={box.label} {...box} />
      ))}

      {/* (1) User query enters Agent Runner from below */}
      <Arrow
        visible={activeSubstep >= 1}
        d={`M ${agentRunner.x + agentRunner.w / 2} ${agentRunner.y + agentRunner.h + 50} L ${agentRunner.x + agentRunner.w / 2} ${agentRunner.y + agentRunner.h + 6}`}
        label="(1) User Query"
        labelX={agentRunner.x + agentRunner.w / 2}
        labelY={agentRunner.y + agentRunner.h + 66}
      />

      {/* (2) Agent Runner sends Prior Context + User Query to Model */}
      <Arrow
        visible={activeSubstep >= 2}
        d={`M ${agentRunner.x} ${agentRunner.y + 20} C ${agentRunner.x - 30} ${agentRunner.y + 20}, ${model.x + model.w + 30} ${model.y + 20}, ${model.x + model.w + 6} ${model.y + 20}`}
        label="(2) Prior Context + User Query"
        labelX={(model.x + model.w + agentRunner.x) / 2}
        labelY={agentRunner.y - 20}
        pulse={activeSubstep === 8}
      />

      {/* (8) label appears above step 2, same arrow pulses */}
      {activeSubstep >= 8 && (
        <motion.text
          x={(model.x + model.w + agentRunner.x) / 2}
          y={agentRunner.y - 35}
          textAnchor="middle"
          fill="var(--ink-on-dark-1)"
          fontSize={9}
          fontFamily="var(--font-mono)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          (8) Prior Context + Tool Response
        </motion.text>
      )}

      {/* (3)/(9) Model response returns to Agent Runner — pulses at step 9 */}
      <Arrow
        visible={activeSubstep >= 3}
        d={`M ${model.x + model.w} ${model.y + 50} C ${model.x + model.w + 30} ${model.y + 50}, ${agentRunner.x - 30} ${agentRunner.y + 50}, ${agentRunner.x - 6} ${agentRunner.y + 50}`}
        label="(3) Tool Call"
        labelX={(model.x + model.w + agentRunner.x) / 2}
        labelY={model.y + model.h + 20}
        pulse={activeSubstep === 9}
      />

      {/* (9) label appears below step 3 label */}
      {activeSubstep >= 9 && (
        <motion.text
          x={(model.x + model.w + agentRunner.x) / 2}
          y={model.y + model.h + 34}
          textAnchor="middle"
          fill="var(--ink-on-dark-1)"
          fontSize={9}
          fontFamily="var(--font-mono)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          (9) Model Response + END
        </motion.text>
      )}

      {/* (10) Agent Runner outputs model response upward (top of agent runner) */}
      <Arrow
        visible={activeSubstep >= 10}
        d={`M ${agentRunner.x + agentRunner.w / 2 + 30} ${agentRunner.y - 6} L ${agentRunner.x + agentRunner.w / 2 + 30} ${agentRunner.y - 50}`}
        label="(10) Model Response"
        labelX={agentRunner.x + agentRunner.w / 2 + 30}
        labelY={agentRunner.y - 72}
      />

      {/* (4) Agent Runner forwards tool call to Tools */}
      <Arrow
        visible={activeSubstep >= 4}
        d={`M ${agentRunner.x + agentRunner.w} ${agentRunner.y + 25} C ${agentRunner.x + agentRunner.w + 30} ${agentRunner.y + 25}, ${tools.x - 30} ${tools.y + 25}, ${tools.x - 6} ${tools.y + 25}`}
        label="(4) Tool Call"
        labelX={(agentRunner.x + agentRunner.w + tools.x) / 2}
        labelY={agentRunner.y - 20}
      />

      {/* (5) Tools execute on Environment */}
      <Arrow
        visible={activeSubstep >= 5}
        d={`M ${tools.x + tools.w} ${tools.y + 25} C ${tools.x + tools.w + 30} ${tools.y + 25}, ${env.x - 30} ${env.y + 25}, ${env.x - 6} ${env.y + 25}`}
        label="(5) Execute"
        labelX={(tools.x + tools.w + env.x) / 2}
        labelY={tools.y - 20}
      />

      {/* (6) Environment returns result to Tools */}
      <Arrow
        visible={activeSubstep >= 6}
        d={`M ${env.x} ${env.y + 50} C ${env.x - 30} ${env.y + 50}, ${tools.x + tools.w + 30} ${tools.y + 50}, ${tools.x + tools.w + 6} ${tools.y + 50}`}
        label="(6) Result"
        labelX={(tools.x + tools.w + env.x) / 2}
        labelY={env.y + env.h + 20}
      />

      {/* (7) Tool response flows back to Agent Runner */}
      <Arrow
        visible={activeSubstep >= 7}
        d={`M ${tools.x} ${tools.y + 50} C ${tools.x - 30} ${tools.y + 50}, ${agentRunner.x + agentRunner.w + 30} ${agentRunner.y + 50}, ${agentRunner.x + agentRunner.w + 6} ${agentRunner.y + 50}`}
        label="(7) Tool Response"
        labelX={(agentRunner.x + agentRunner.w + tools.x) / 2}
        labelY={tools.y + tools.h + 20}
      />


      {/* Exit condition label */}
      <AnimatePresence>
        {activeSubstep >= 11 && (
          <motion.text
            x={SVG_WIDTH / 2}
            y={SVG_HEIGHT - 30}
            textAnchor="middle"
            fill="var(--ink-on-dark-2)"
            fontSize={11}
            fontFamily="var(--font-mono)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Loop until model says [END]
          </motion.text>
        )}
      </AnimatePresence>
    </motion.svg>
  )
}
