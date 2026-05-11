import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'

// Decoder layers (top to bottom in visual: output end first)
const LAYERS = [
  'Softmax',
  'Linear',
  'Add & Norm',
  'Feed Forward',
  'Add & Norm',
  'Masked Self-Attention',
  'Positional Encoding',
  'Embedding',
] as const

// Layout constants
const LAYER_HEIGHT = 30
const LAYER_GAP = 4
const BLOCK_HEIGHT = LAYERS.length * (LAYER_HEIGHT + LAYER_GAP) - LAYER_GAP
const TOKEN_BOX_W = 80
const TOKEN_BOX_H = 22

const TOKEN_SEQUENCE = [
  { input: '<start>', output: '[SYS_PROMPT]' },
  { input: '[SYS_PROMPT]', output: '[USER_QUERY]' },
  { input: '[USER_QUERY]', output: 'The' },
  { input: 'The', output: 'capital' },
  { input: 'capital', output: 'of' },
  { input: 'of', output: 'France...' },
]

const SVG_WIDTH = 900
const SVG_HEIGHT = 440
const BLOCK_LEFT = 60
const BLOCK_WIDTH = SVG_WIDTH - 120
const BLOCK_TOP = 90
const BLOCK_BOTTOM = BLOCK_TOP + BLOCK_HEIGHT
const INPUT_Y = BLOCK_BOTTOM + 28
const OUTPUT_Y = BLOCK_TOP - 28

// FIXED positions — token i is always at the same x
const MAX_TOKENS = TOKEN_SEQUENCE.length
function tokenX(i: number): number {
  const usableWidth = BLOCK_WIDTH - 40
  const spacing = usableWidth / MAX_TOKENS
  return BLOCK_LEFT + 20 + i * spacing + spacing / 2
}

// === Substep mapping ===
// Phase 1 substeps (explicit feedback animation):
//   0: Decoder block appears (no tokens)
//   1: <start> input appears, pulse through, [SYS] output appears
//   2: [SYS] output animates down to become input at position 1 (feedback)
//   3: [SYS] input pulses through, [USR] output appears
//   4: [USR] feedback → input position 2
//   5: [USR] input pulses, "The" output
//   6: "The" feedback → input position 3
//   7: "The" pulses, "capital" output
//   8: "capital" feedback → input position 4
//   9: "capital" pulses, "of" output
//   10: "of" feedback → input position 5
//   11: "of" pulses, "France..." output
//   12: Label "AUTOREGRESSIVE GENERATION" appears, hold

// Phase 2: 13-16 (collapse)
// Phase 3: 17-18 (reposition)
// Phase 4: 19-24 (chat)

type TokenState = {
  inputVisible: boolean
  outputVisible: boolean
  feedbackAnimating: boolean // output is animating down to next input
  pulsing: boolean
  dimmed: boolean
}

function getTokenStates(substep: number): TokenState[] {
  const states: TokenState[] = TOKEN_SEQUENCE.map(() => ({
    inputVisible: false,
    outputVisible: false,
    feedbackAnimating: false,
    pulsing: false,
    dimmed: false,
  }))

  if (substep <= 0) return states

  // Walk through the substep logic
  // Token 0: input+output at substep 1, feedback at substep 2
  // Token i (i>0): input at substep i*2 (feedback step of prev), output at substep i*2+1, feedback at substep i*2+2
  //
  // Flow per cycle:
  //   Step A (odd): input pulses through → output appears
  //   Step B (even): feedback arrow drawn + next input appears (not yet processed)
  for (let i = 0; i < MAX_TOKENS; i++) {
    const inputStep = i === 0 ? 1 : i * 2
    const outputStep = i * 2 + 1
    const feedbackStep = i * 2 + 2

    if (substep >= inputStep) {
      states[i]!.inputVisible = true
    }
    if (substep >= outputStep) {
      states[i]!.outputVisible = true
      states[i]!.pulsing = substep === outputStep
    }
    if (substep === feedbackStep) {
      states[i]!.feedbackAnimating = true
    }
    // Dim past tokens once we've moved beyond their feedback
    if (substep > feedbackStep) {
      states[i]!.dimmed = true
    }
    // At final hold (substep >= 12), undim everything
    if (substep >= 12) {
      states[i]!.dimmed = false
      states[i]!.pulsing = false
      states[i]!.feedbackAnimating = false
    }
  }

  return states
}

// === Pulse animation — highlights the actual layer bars ===

function usePulse(active: boolean): number {
  const [layerIdx, setLayerIdx] = useState(-1)

  useEffect(() => {
    if (active) {
      setLayerIdx(0)
      const interval = setInterval(() => {
        setLayerIdx((prev) => {
          if (prev >= LAYERS.length - 1) {
            clearInterval(interval)
            return LAYERS.length
          }
          return prev + 1
        })
      }, 55)
      return () => clearInterval(interval)
    } else {
      setLayerIdx(-1)
    }
  }, [active])

  return layerIdx
}

// === Feedback Arrow (curves from right of output to left of next input) ===

function FeedbackArrow({
  fromX,
  toX,
  accent,
  animating,
}: {
  fromX: number
  toX: number
  accent: string
  animating: boolean
}) {
  const GAP = 8
  const STEM = 18 // flat horizontal segment length before the token
  const ARROW_SIZE = 7

  // Start: right side of output token + gap
  const startX = fromX + TOKEN_BOX_W / 2 + GAP
  const startY = OUTPUT_Y
  // Stem start: where the curve ends and the flat bit begins
  const stemStartX = toX - TOKEN_BOX_W / 2 - GAP - STEM
  const stemEndX = toX - TOKEN_BOX_W / 2 - GAP
  const endY = INPUT_Y

  // Curve: departs horizontally from output, arrives at stem start
  const cp1x = startX + 50
  const cp1y = startY       // horizontal departure
  const cp2x = stemStartX - 30
  const cp2y = endY          // approach from left, matching endY

  // Path: curve to stem start, then straight horizontal stem
  const d = `M ${startX} ${startY}
             C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${stemStartX} ${endY}
             L ${stemEndX - ARROW_SIZE} ${endY}`

  // Arrowhead at the end of the stem, pointing right
  const arrowPoints = `${stemEndX},${endY} ${stemEndX - ARROW_SIZE},${endY - ARROW_SIZE / 2} ${stemEndX - ARROW_SIZE},${endY + ARROW_SIZE / 2}`

  return (
    <>
      <motion.path
        d={d}
        fill="none"
        stroke={accent}
        strokeWidth={animating ? 1.5 : 1}
        strokeDasharray={animating ? undefined : '5,4'}
        opacity={animating ? 0.8 : 0.4}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: animating ? 0.4 : 0.01, ease: 'easeOut' }}
      />
      <motion.polygon
        points={arrowPoints}
        fill={accent}
        opacity={animating ? 0.8 : 0.4}
        initial={{ opacity: 0 }}
        animate={{ opacity: animating ? 0.8 : 0.4 }}
        transition={{ delay: animating ? 0.35 : 0, duration: 0.1 }}
      />
    </>
  )
}

// === Token Box ===

function TokenBox({
  x,
  y,
  label,
  accent,
  dimmed,
}: {
  x: number
  y: number
  label: string
  accent: string
  dimmed?: boolean
}) {
  const isMeta = label.startsWith('[') || label.startsWith('<')

  return (
    <motion.g
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: dimmed ? 0.35 : 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <rect
        x={x - TOKEN_BOX_W / 2}
        y={y - TOKEN_BOX_H / 2}
        width={TOKEN_BOX_W}
        height={TOKEN_BOX_H}
        rx={3}
        fill={isMeta ? `${accent}22` : 'var(--paper-deep)'}
        stroke={accent}
        strokeWidth={0.75}
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fill={isMeta ? accent : 'var(--ink-on-dark-1)'}
        fontSize={9}
        fontFamily="var(--font-mono)"
        fontWeight={isMeta ? 600 : 500}
      >
        {label}
      </text>
    </motion.g>
  )
}

// === Collapsed Model Block (Phase 2+) ===

function CollapsedModelBlock({
  orientation,
  accent,
  contextLabel,
  outputLabel,
  showExample,
}: {
  orientation: 'horizontal' | 'vertical'
  accent: string
  contextLabel?: string
  outputLabel?: string
  showExample: boolean
}) {
  if (orientation === 'horizontal') {
    const blockW = 160
    const blockH = 90
    const bx = (SVG_WIDTH - blockW) / 2
    const by = (SVG_HEIGHT - blockH) / 2 - 20

    return (
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <rect
          x={bx}
          y={by}
          width={blockW}
          height={blockH}
          rx={6}
          fill={`${accent}12`}
          stroke={accent}
          strokeWidth={1.5}
        />
        <text
          x={bx + blockW / 2}
          y={by + blockH / 2 + 5}
          textAnchor="middle"
          fill="var(--ink-on-dark-1)"
          fontSize={18}
          fontFamily="var(--font-mono)"
          fontWeight={600}
        >
          Model
        </text>

        {/* Input arrow */}
        <line
          x1={bx - 70}
          y1={by + blockH / 2}
          x2={bx - 12}
          y2={by + blockH / 2}
          stroke="var(--ink-on-dark-2)"
          strokeWidth={1.5}
          markerEnd="url(#arrowRight)"
        />
        <text
          x={bx - 75}
          y={by + blockH / 2 + 4}
          fill="var(--ink-on-dark-2)"
          fontSize={11}
          fontFamily="var(--font-mono)"
          textAnchor="end"
        >
          Context
        </text>

        {/* Output arrow */}
        <line
          x1={bx + blockW + 4}
          y1={by + blockH / 2}
          x2={bx + blockW + 60}
          y2={by + blockH / 2}
          stroke="var(--ink-on-dark-2)"
          strokeWidth={1.5}
          markerEnd="url(#arrowRight)"
        />
        <text
          x={bx + blockW + 76}
          y={by + blockH / 2 + 4}
          fill="var(--ink-on-dark-2)"
          fontSize={11}
          fontFamily="var(--font-mono)"
        >
          Predicted Next Tokens
        </text>

        {/* Example */}
        {showExample && contextLabel && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <text
              x={bx - 75}
              y={by + blockH / 2 + 22}
              fill={accent}
              fontSize={10.5}
              fontFamily="var(--font-mono)"
              textAnchor="end"
            >
              {contextLabel}
            </text>
          </motion.g>
        )}
        {showExample && outputLabel && (
          <motion.text
            x={bx + blockW + 76}
            y={by + blockH / 2 + 22}
            fill={accent}
            fontSize={11}
            fontFamily="var(--font-mono)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {outputLabel}
          </motion.text>
        )}
      </motion.g>
    )
  }

  // Vertical orientation (Phase 3+4) — uses a narrow viewBox
  const vbW = 250
  const vbH = 480
  const blockW = 140
  const blockH = 180
  const bx = (vbW - blockW) / 2
  const by = (vbH - blockH) / 2 + 20

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <rect
        x={bx}
        y={by}
        width={blockW}
        height={blockH}
        rx={6}
        fill={`${accent}12`}
        stroke={accent}
        strokeWidth={1.5}
      />

      {/* Context input (top) */}
      <line
        x1={bx + blockW / 2}
        y1={by - 30}
        x2={bx + blockW / 2}
        y2={by - 10}
        stroke="var(--ink-on-dark-2)"
        strokeWidth={1.5}
        markerEnd="url(#arrowDown)"
      />
      <text
        x={bx + blockW / 2}
        y={by - 38}
        textAnchor="middle"
        fill="var(--ink-on-dark-2)"
        fontSize={10}
        fontFamily="var(--font-mono)"
      >
        Context
      </text>

      {/* Output (bottom) */}
      <line
        x1={bx + blockW / 2}
        y1={by + blockH + 4}
        x2={bx + blockW / 2}
        y2={by + blockH + 34}
        stroke="var(--ink-on-dark-2)"
        strokeWidth={1.5}
        markerEnd="url(#arrowDown)"
      />
      <text
        x={bx + blockW / 2}
        y={by + blockH + 56}
        textAnchor="middle"
        fill="var(--ink-on-dark-2)"
        fontSize={10}
        fontFamily="var(--font-mono)"
      >
        Response
      </text>

      {/* Response output value */}
      {outputLabel && (
        <motion.text
          x={bx + blockW / 2}
          y={by + blockH + 72}
          textAnchor="middle"
          fill={accent}
          fontSize={9}
          fontFamily="var(--font-mono)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={outputLabel}
        >
          {outputLabel}
        </motion.text>
      )}

      {/* Context content label (multiline via tspans) */}
      {contextLabel && (
        <motion.text
          x={bx + blockW / 2}
          textAnchor="middle"
          fill={accent}
          fontSize={9}
          fontFamily="var(--font-mono)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={contextLabel}
        >
          {contextLabel.split('\n').map((line, i) => (
            <tspan key={i} x={bx + blockW / 2} y={by - 52 - (contextLabel.split('\n').length - 1 - i) * 13}>
              {line}
            </tspan>
          ))}
        </motion.text>
      )}

      {/* Context fill bar */}
      {contextLabel && (
        <motion.rect
          x={bx + 4}
          y={by + 4}
          width={blockW - 8}
          rx={3}
          fill={`${accent}20`}
          initial={{ height: 0 }}
          animate={{
            height: Math.min(
              blockH - 8,
              (blockH - 8) * (contextLabel.split('\n').length / 6)
            ),
          }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Model label (rendered last so it's on top of fill bar) */}
      <text
        x={bx + blockW / 2}
        y={by + blockH / 2 + 5}
        textAnchor="middle"
        fill="var(--ink-on-dark-1)"
        fontSize={16}
        fontFamily="var(--font-mono)"
        fontWeight={600}
      >
        Model
      </text>
    </motion.g>
  )
}

// === Main Component ===

interface DecoderDiagramProps {
  activeSubstep: number
  accent?: string
}

export default function DecoderDiagram({ activeSubstep, accent = '#2A8A8A' }: DecoderDiagramProps) {
  const showPhase1 = activeSubstep >= 0 && activeSubstep <= 12
  const showCollapsed = activeSubstep >= 13 && activeSubstep <= 16
  const showVertical = activeSubstep >= 17

  const tokenStates = getTokenStates(activeSubstep)
  const anyPulsing = tokenStates.some((s) => s.pulsing)
  const pulseLayerIdx = usePulse(anyPulsing)

  const viewBox = showVertical ? '0 0 250 480' : `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`

  return (
    <motion.svg
      viewBox={viewBox}
      width="100%"
      height="100%"
      style={{ maxHeight: '100%', overflow: 'visible' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker id="arrowUp" markerWidth="6" markerHeight="5" refX="0" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill={accent} />
        </marker>
        <marker id="arrowDown" markerWidth="6" markerHeight="5" refX="0" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill={accent} />
        </marker>
        <marker id="arrowRight" markerWidth="6" markerHeight="5" refX="0" refY="2.5" orient="auto">
          <polygon points="0 0, 6 2.5, 0 5" fill={accent} />
        </marker>
      </defs>

      {/* Phase 1: Wide decoder block with tokens */}
      <AnimatePresence>
        {showPhase1 && (
          <motion.g exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {/* Wide decoder layer stack */}
            {LAYERS.map((label, i) => {
              const y = BLOCK_TOP + i * (LAYER_HEIGHT + LAYER_GAP)
              // Pulse goes bottom-to-top: layer index in visual is reversed
              const isPulsed = anyPulsing && pulseLayerIdx === (LAYERS.length - 1 - i)
              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                >
                  <rect
                    x={BLOCK_LEFT}
                    y={y}
                    width={BLOCK_WIDTH}
                    height={LAYER_HEIGHT}
                    rx={3}
                    fill={isPulsed ? `${accent}20` : 'var(--paper-deep)'}
                    stroke={isPulsed ? accent : 'var(--ink-on-dark-2)'}
                    strokeWidth={isPulsed ? 1.5 : 0.75}
                    strokeDasharray={isPulsed ? undefined : '4,3'}
                    filter={isPulsed ? `drop-shadow(0 0 6px ${accent})` : undefined}
                  />
                  <text
                    x={BLOCK_LEFT + 14}
                    y={y + LAYER_HEIGHT / 2 + 4}
                    fill={isPulsed ? accent : 'var(--ink-on-dark-2)'}
                    fontSize={9}
                    fontFamily="var(--font-mono)"
                    fontWeight={isPulsed ? 600 : 400}
                  >
                    {label}
                  </text>
                </motion.g>
              )
            })}

            {/* Tokens */}
            {TOKEN_SEQUENCE.map((seq, i) => {
              const state = tokenStates[i]!
              const x = tokenX(i)

              if (!state.inputVisible) return null

              return (
                <g key={i}>
                  {/* Input token */}
                  <TokenBox
                    x={x}
                    y={INPUT_Y}
                    label={seq.input}
                    accent={accent}
                    dimmed={state.dimmed}
                  />

                  {/* Short dash: input token → block bottom */}
                  <line
                    x1={x}
                    y1={INPUT_Y - TOKEN_BOX_H / 2}
                    x2={x}
                    y2={BLOCK_BOTTOM}
                    stroke={accent}
                    strokeWidth={0.75}
                    strokeDasharray="3,3"
                    opacity={state.dimmed ? 0.2 : 0.5}
                  />

                  {/* Output token */}
                  {state.outputVisible && (
                    <>
                      {/* Short dash: block top → output token */}
                      <line
                        x1={x}
                        y1={BLOCK_TOP}
                        x2={x}
                        y2={OUTPUT_Y + TOKEN_BOX_H / 2}
                        stroke={accent}
                        strokeWidth={0.75}
                        strokeDasharray="3,3"
                        opacity={state.dimmed ? 0.2 : 0.5}
                      />
                      <TokenBox
                        x={x}
                        y={OUTPUT_Y}
                        label={seq.output}
                        accent={accent}
                        dimmed={state.dimmed}
                      />
                    </>
                  )}
                </g>
              )
            })}

            {/* Feedback arrows */}
            {TOKEN_SEQUENCE.slice(0, -1).map((_, i) => {
              const state = tokenStates[i]!
              // Show feedback arrow once the feedback step has been reached or passed
              const feedbackStep = i * 2 + 2
              if (activeSubstep < feedbackStep) return null

              const fromX = tokenX(i)
              const toX = tokenX(i + 1)
              const isAnimating = state.feedbackAnimating

              return (
                <FeedbackArrow
                  key={`fb-${i}`}
                  fromX={fromX}
                  toX={toX}
                  accent={accent}
                  animating={isAnimating}
                />
              )
            })}

          </motion.g>
        )}
      </AnimatePresence>

      {/* Phase 2: Collapsed model block */}
      <AnimatePresence>
        {showCollapsed && (
          <CollapsedModelBlock
            orientation="horizontal"
            accent={accent}
            showExample={activeSubstep >= 14}
            contextLabel={activeSubstep >= 14 ? '[SYS_PROMPT] + [PRIOR_CONTEXT] + [USER_QUERY]' : undefined}
            outputLabel={activeSubstep >= 15 ? 'The capital of France is Paris' : undefined}
          />
        )}
      </AnimatePresence>

      {/* Phase 3+4: Vertical model block */}
      <AnimatePresence>
        {showVertical && (
          <CollapsedModelBlock
            orientation="vertical"
            accent={accent}
            showExample={false}
            contextLabel={
              activeSubstep >= 24
                ? '[SYS]\nQ1+A1\nQ2+A2\nQ3'
                : activeSubstep >= 22
                  ? '[SYS]\nQ1+A1\nQ2'
                  : activeSubstep >= 20
                    ? '[SYS]\nQ1'
                    : activeSubstep >= 19
                      ? '[SYS]'
                      : undefined
            }
            outputLabel={
              activeSubstep === 25
                ? 'Eiffel Tower, Louvre, Notre-Dame...'
                : activeSubstep === 23
                  ? 'Croissants, coq au vin, crème brûlée...'
                  : activeSubstep === 21
                    ? 'The capital of France is Paris.'
                    : undefined
            }
          />
        )}
      </AnimatePresence>
    </motion.svg>
  )
}
