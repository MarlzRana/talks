import { motion, AnimatePresence } from 'motion/react'
import DecoderDiagram from '../components/DecoderDiagram'
import ChatWindow from '../components/ChatWindow'
import styles from './what-is-a-model.module.css'

export const fullbleed = true
export const substeps = 26

const CHAT_MESSAGES = [
  { role: 'user' as const, text: 'What is the capital of France?', annotation: 'Q1' },
  { role: 'assistant' as const, text: 'The capital of France is Paris.', annotation: 'A1' },
  { role: 'user' as const, text: 'What are famous foods from there?', annotation: 'Q2' },
  { role: 'assistant' as const, text: 'Croissants, coq au vin, and crème brûlée are iconic Parisian dishes.', annotation: 'A2' },
  { role: 'user' as const, text: 'What are good sights from there?', annotation: 'Q3' },
  { role: 'assistant' as const, text: 'The Eiffel Tower, the Louvre, and Notre-Dame are must-see landmarks.', annotation: 'A3' },
]

function getVisibleMessageCount(substep: number): number {
  // Phase 4 synced with model block:
  // 19: chat appears (empty), model shows [SYS]
  // 20: Q1 in chat, context [SYS]+Q1
  // 21: A1 in chat, response shows A1
  // 22: Q2 in chat, context [SYS]+Q1+A1+Q2, response clears
  // 23: A2 in chat, response shows A2
  // 24: Q3+A3 in chat, context [SYS]+Q1+A1+Q2+A2+Q3, response shows A3
  if (substep < 20) return 0
  if (substep === 20) return 1  // Q1
  if (substep === 21) return 2  // Q1, A1
  if (substep === 22) return 3  // Q1, A1, Q2
  if (substep === 23) return 4  // Q1, A1, Q2, A2
  if (substep === 24) return 5  // Q1, A1, Q2, A2, Q3
  return 6 // substep 25: Q1, A1, Q2, A2, Q3, A3
}

export default function WhatIsAModelSlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  const showChat = activeSubstep >= 19
  const isVerticalPhase = activeSubstep >= 17

  return (
    <div className={styles.container}>
      {/* Title box with wireframe rails — visible during Phase 1 only */}
      <AnimatePresence>
        {activeSubstep <= 12 && (
          <motion.div
            className={styles.titleBox}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className={styles.mark} data-pos="tl" />
            <span className={styles.mark} data-pos="tr" />
            <span className={styles.mark} data-pos="bl" />
            <span className={styles.mark} data-pos="br" />
            <h1 className={styles.titleText}>Generative Pre-Trained Transformer (GPT)</h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content area */}
      <div className={styles.content}>
        {/* Diagram area - full width in phases 1-2, left column in phases 3-4 */}
        <div className={`${styles.diagramArea} ${isVerticalPhase ? styles.diagramAreaLeft : ''}`}>
          <DecoderDiagram activeSubstep={activeSubstep} accent="#2A8A8A" />
        </div>

        {/* Chat area - appears in phase 4 */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              className={styles.chatArea}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <ChatWindow
                messages={CHAT_MESSAGES}
                visibleCount={getVisibleMessageCount(activeSubstep)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export const notes = `Phase 1: Show decoder-only transformer layers with autoregressive token generation.
Each token output feeds back as the next input — this IS the autoregressive loop.
[SYS] and [USR] are composite tokens representing the system prompt and user query.

Phase 2: Collapse all layers into a single "Model" block. Input = Context, Output = Predicted Next Token.
Show [USR] expanding to the actual query text.

Phase 3: Reposition model block to left, vertical orientation.

Phase 4: Chat window demonstrates context accumulation across turns.
[SYS] is always in the context. Each new turn adds to the growing context window.`
