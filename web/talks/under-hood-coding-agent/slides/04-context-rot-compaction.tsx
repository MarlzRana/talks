import { motion, AnimatePresence } from 'motion/react'
import { Wireframe } from '@/components/paper'
import {
  UserBlock,
  ModelBlock,
  ThinkingBlockContext,
  BashBlock,
  ContextBar,
} from '../components/context-window'
import styles from './04-context-rot-compaction.module.css'

export const fullbleed = true
export const substeps = 5

export default function ContextRotCompactionSlide({
  activeSubstep = 0,
}: {
  activeSubstep?: number
}) {
  // Left column: a context window that fills up and rots.
  // Right column: the same task after compaction.
  const showFiller = activeSubstep >= 1
  const showRot = activeSubstep >= 2
  const showCompacted = activeSubstep >= 3
  const showTakeaway = activeSubstep >= 4

  // Left bar fills as turns accumulate.
  const leftFill = activeSubstep === 0 ? '15%' : activeSubstep === 1 ? '60%' : '92%'
  // Right column appears compacted, smaller fill.
  const rightFill = '38%'

  return (
    <Wireframe className={styles.outer} accent="rust">
      <div className={styles.container}>
        <div className={styles.titleBar}>
          <span className={styles.eyebrow}>Context Engineering · 2 / 2</span>
          <h2 className={styles.title}>Context rot &amp; compaction</h2>
        </div>

        <div className={styles.columns}>
          {/* LEFT: rotting context window */}
          <div className={styles.column}>
            <span className={styles.columnHeader}>
              Δ Without compaction
            </span>
            <Wireframe accent={showRot ? 'rust' : undefined} className={styles.contextWindow}>
              <UserBlock>Add retry logic to the auth client.</UserBlock>

              <ThinkingBlockContext label="AGENTS.md">
                Always wrap network calls in <code>withRetry()</code> from <code>@/lib/retry</code>.
              </ThinkingBlockContext>

              <BashBlock
                visible={showFiller}
                command="rg -l 'fetch(' src/auth"
                response={'src/auth/client.ts\nsrc/auth/session.ts\nsrc/auth/refresh.ts'}
              />

              <BashBlock
                visible={showFiller}
                command="cat src/auth/client.ts"
                response={'(420 lines of source…)'}
              />

              <BashBlock
                visible={showFiller}
                command="pnpm test auth"
                responseVariant="fail"
                response={'FAIL  client.test.ts — retries: 0 expected'}
              />

              <ThinkingBlockContext label="AGENT NOTE" visible={showFiller}>
                Re-reading <code>refresh.ts</code> to spot the call site… let me try
                a hand-rolled <code>setTimeout</code> backoff.
              </ThinkingBlockContext>

              <ModelBlock visible={showRot}>
                Patched with a custom retry loop. Tests pass.
              </ModelBlock>

              <ContextBar fill={leftFill} active={showFiller} />
            </Wireframe>

            <AnimatePresence>
              {showRot && (
                <motion.div
                  className={styles.callout}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  CONTEXT ROT — the AGENTS.md rule for <code>withRetry()</code> got
                  buried under file reads &amp; tool output. The agent solved it the wrong way.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: compacted */}
          <div className={styles.column}>
            <span className={styles.columnHeader}>
              Δ After compaction
            </span>
            <AnimatePresence>
              {showCompacted && (
                <motion.div
                  key="compacted"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
                >
                  <Wireframe accent="forest" className={styles.contextWindow}>
                    <UserBlock>Add retry logic to the auth client.</UserBlock>

                    <ThinkingBlockContext label="AGENTS.md">
                      Always wrap network calls in <code>withRetry()</code> from{' '}
                      <code>@/lib/retry</code>.
                    </ThinkingBlockContext>

                    <div className={styles.summaryBlock}>
                      <span className={styles.summaryLabel}>Summary (compacted)</span>
                      <span className={styles.summaryText}>
                        Searched <code>src/auth/*</code>, identified 3 call sites in{' '}
                        <code>client.ts</code>, <code>session.ts</code>,{' '}
                        <code>refresh.ts</code>. First test run failed (no retries).
                      </span>
                    </div>

                    <ThinkingBlockContext label="AGENT NOTE">
                      AGENTS.md says use <code>withRetry()</code> — wrapping the three
                      call sites instead of writing a custom loop.
                    </ThinkingBlockContext>

                    <ModelBlock>
                      Wrapped each <code>fetch</code> with{' '}
                      <code>withRetry()</code>. Tests pass.
                    </ModelBlock>

                    <ContextBar fill={rightFill} active accent="var(--accent-forest)" />
                  </Wireframe>

                  <div className={`${styles.callout} ${styles.calloutGood}`}>
                    COMPACTION — old turns collapse into a summary. Headroom restored,
                    and durable instructions stay salient (whether they're kept in
                    place, pinned, or re-injected by the runtime).
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {showTakeaway && (
            <motion.div
              className={styles.takeaway}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <p>Compaction buys headroom, but loses fidelity.</p>
              <p>
                Durable state should outlive the conversation: plans, todos,
                AGENTS.md.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Wireframe>
  )
}

export const notes = `Context rot + compaction.

1. Pristine context: the user request and AGENTS.md (with the withRetry rule) sit at the top.
2. The agent does real work — searches files, reads source, runs tests, retries. The window fills (~90%).
3. Rot: the AGENTS.md rule is now buried. The agent forgets it and writes a custom retry loop instead — wrong solution, looks right.
4. Compaction kicks in (Claude Code does this automatically near the limit). Middle turns collapse into a single summary block; the durable instructions stay salient (some systems keep them in place, others pin or re-inject them separately from compaction); the bar drops back to ~40%.
5. Takeaway — compaction trades fidelity for headroom. That's why durable artefacts (files, todos, AGENTS.md) matter more than chat history.

(Caching is the third lever here, even though it's not on the slide: the stable prefix — system prompt, tool defs, AGENTS.md, skills — is cached server-side, so the cost of re-sending it on every turn is mostly skipped. It doesn't grow the window, just makes refilling cheaper. Mention briefly.)`
