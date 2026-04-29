import { motion } from 'motion/react'
import { Wireframe } from '@/components/paper'
import styles from './04-with-ptc.module.css'

export const fullbleed = true
export const substeps = 5

const CODE_LINES = [
  'txns = get_transactions("last_month")',
  'starbucks = [t for t in txns if t.merchant == "Starbucks"]',
  'total = sum(t.amount for t in starbucks)',
]

export default function WithPtcSlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  return (
    <Wireframe className={styles.outer} accent="forest">
      <div className={styles.container}>
        {/* Title bar */}
        <div className={styles.titleBar}>
          <span className={styles.eyebrow}>PTC Flow</span>
          <h2 className={styles.title}>With Programmatic Tool Calling</h2>
        </div>

        {/* Two-column layout */}
        <div className={styles.columns}>
          {/* Left: Flow diagram */}
          <div className={styles.flowColumn}>
            <span className={styles.columnHeader}>AGENT RUNTIME</span>
            {/* Step 1: User question */}
            <div className={styles.flowStep}>
              <span className={styles.stepLabel}>USER</span>
              <div className={styles.messageBubble}>
                "How much did I spend at Starbucks over the past month?"
              </div>
            </div>

            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />

            {/* Step 2: Claude writes code */}
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>CLAUDE WRITES CODE TO FILE</span>
              <div className={styles.codeBlock}>
                {CODE_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    className={styles.codeLine}
                    animate={{
                      opacity: activeSubstep >= 1 ? 1 : 0,
                    }}
                    transition={{ delay: i * 0.12, duration: 0.35 }}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
              {activeSubstep >= 2 && (
                <motion.div
                  className={styles.executesOutside}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.35 }}
                >
                  BASH TOOL EXECUTES CODE (OUTSIDE CONTEXT)
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 3 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />

            {/* Step 3: Compact result */}
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 3 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>RESULT</span>
              <div className={styles.resultCompact}>£47.50 across 12 transactions</div>
            </motion.div>
          </div>

          {/* Right: Context window */}
          <div className={styles.contextColumn}>
            <span className={styles.columnHeader}>CONTEXT WINDOW</span>
            <Wireframe
              accent={activeSubstep >= 3 ? 'forest' : undefined}
              className={styles.contextWindow}
            >
              {/* User message */}
              <div className={styles.contextEntry}>
                <span className={styles.contextRole}>User</span>
                <span className={styles.contextText}>How much at Starbucks...?</span>
              </div>

              {/* Code entry - appears at substep 1+ */}
              <motion.div
                className={styles.contextEntry}
                animate={{
                  opacity: activeSubstep >= 1 ? 1 : 0,
                  y: activeSubstep >= 1 ? 0 : 8,
                }}
                transition={{ duration: 0.35 }}
              >
                <span className={styles.contextRole}>Code</span>
                <div className={styles.contextCodeBlock}>
                  {CODE_LINES.map((line, i) => (
                    <div key={i} className={styles.contextCodeLine}>
                      {line}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Result entry - only appears at substep 3+ */}
              <motion.div
                className={styles.contextEntry}
                animate={{
                  opacity: activeSubstep >= 3 ? 1 : 0,
                  y: activeSubstep >= 3 ? 0 : 8,
                }}
                transition={{ duration: 0.35 }}
              >
                <span className={styles.contextRole}>Result</span>
                <span className={styles.contextResultText}>£47.50 across 12 transactions</span>
              </motion.div>

              {/* Large empty space - visually represents how clean context is */}
              <div className={styles.contextEmpty}>
                {activeSubstep >= 3 && (
                  <motion.span
                    className={styles.contextCleanLabel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.5, duration: 0.35 }}
                  >
                    Context stays clean
                  </motion.span>
                )}
              </div>

              {/* Context usage progress bar */}
              <div className={styles.contextBarContainer}>
                <span className={styles.contextBarLabel}>CONTEXT USAGE</span>
                <div className={styles.contextBar}>
                  <motion.div
                    className={styles.contextBarFill}
                    initial={false}
                    animate={{
                      width: activeSubstep >= 3 ? '8%' : '5%',
                    }}
                    style={{
                      backgroundColor:
                        activeSubstep >= 3 ? 'var(--accent-forest)' : 'var(--ink-4)',
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </Wireframe>

            {/* Token cost */}
            <motion.div
              className={styles.tokenCost}
              animate={{ opacity: activeSubstep >= 4 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.tokenLabel}>TOKEN COST</span>
              <span className={styles.tokenValue}>Hundreds</span>
            </motion.div>
          </div>
        </div>

        {/* Bottom: Benefits row */}
        <motion.div
          className={styles.benefitsRow}
          animate={{ opacity: activeSubstep >= 4 ? 1 : 0, y: activeSubstep >= 4 ? 0 : 20 }}
          transition={{ duration: 0.35 }}
        >
          <Wireframe accent="forest" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>No Context Pollution</span>
            <span className={styles.benefitDesc}>Raw data never enters context</span>
          </Wireframe>
          <Wireframe accent="forest" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>Guaranteed Accurate Math</span>
            <span className={styles.benefitDesc}>Code computes, not the model</span>
          </Wireframe>
          <Wireframe accent="forest" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>Massive Token Savings</span>
            <span className={styles.benefitDesc}>Hundreds vs tens of thousands</span>
          </Wireframe>
        </motion.div>
      </div>
    </Wireframe>
  )
}

export const notes = `With PTC, Claude writes and executes code outside the context window. Only the compact result — "£47.50 across 12 transactions" — enters context. This preserves context, guarantees accurate arithmetic, and saves the vast majority of tokens.`
