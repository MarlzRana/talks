import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { codeToHtml } from 'shiki'
import { Wireframe } from '@/components/paper'
import styles from './04-with-ptc.module.css'

export const fullbleed = true
export const substeps = 9

const CODE = `from mcp.bank import get_transactions
txns = get_transactions("last_month")
txns_starbucks = [t for t in txns if t.merchant == "Starbucks"]
total = {sum(t.amount for t in txns_starbucks)}
print("Total: £" + total)`

const CODE_LINES = [
  'from mcp.bank import get_transactions',
  'txns = get_transactions("last_month")',
  'txns_starbucks = [t for t in txns if t.merchant == "Starbucks"]',
  'total = {sum(t.amount for t in txns_starbucks)}',
  'print("Total: £" + total)',
]

export default function WithPtcSlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  const [codeHtml, setCodeHtml] = useState('')

  useEffect(() => {
    let mounted = true
    codeToHtml(CODE, { lang: 'python', theme: 'github-dark' }).then((result) => {
      if (mounted) setCodeHtml(result)
    })
    return () => { mounted = false }
  }, [])
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

            {/* Substep 1: Model predict call */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>MODEL PREDICT</span>
              {activeSubstep >= 1 && (
                <motion.div
                  className={styles.thinkingText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.35 }}
                >
                  Thinking: The get_transactions tool only has a time filter, but I also need to filter by merchant. Let me write some code to filter again by merchant.
                </motion.div>
              )}
            </motion.div>

            {/* Substep 2: Write + response */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 2 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 2 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>Write("/tmp/get_txns_starbucks_transactions_last_month.py", ...)</span>
              <div className={styles.codeBlock}>
                {codeHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: codeHtml }} />
                ) : (
                  CODE_LINES.map((line, i) => (
                    <div key={i} className={styles.codeLine}>{line}</div>
                  ))
                )}
              </div>
            </motion.div>

            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 2 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />

            {/* Write tool response */}
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 2 ? 1 : 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
            >
              <span className={styles.stepLabel}>Write Tool Response</span>
              <div className={styles.resultCompact} style={{ opacity: 0.5, fontStyle: 'italic' }}>Success</div>
            </motion.div>

            {/* Substep 3: Model predict call */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 3 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 3 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>MODEL PREDICT</span>
              {activeSubstep >= 3 && (
                <motion.div
                  className={styles.thinkingText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.35 }}
                >
                  Thinking: Code written, let me now execute it!
                </motion.div>
              )}
            </motion.div>

            {/* Substep 4: Bash tool call + result */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 4 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 4 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>Bash("python3 /tmp/get_txns_starbucks_transactions_last_month.py")</span>
              {activeSubstep >= 4 && (
                <motion.div
                  className={styles.executesOutside}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.35 }}
                >
                  BASH TOOL EXECUTES CODE
                  <br />
                  STDOUT IS PIPED TO TOOL RESPONSE
                </motion.div>
              )}
            </motion.div>
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 5 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 5 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>Bash Tool Response</span>
              <div className={styles.resultCompact}>Total: £47.50</div>
            </motion.div>

            {/* Substep 6: Model predict call */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 6 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 6 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>MODEL PREDICT</span>
            </motion.div>

            {/* Substep 7: Model response */}
            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 7 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 7 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>MODEL RESPONSE</span>
              <div className={styles.messageBubble}>
                "You spent £47.50 on Starbucks over the last month"
              </div>
            </motion.div>
          </div>

          {/* Right: Context window */}
          <div className={styles.contextColumn}>
            <span className={styles.columnHeader}>CONTEXT WINDOW</span>
            <Wireframe
              accent={activeSubstep >= 7 ? 'forest' : undefined}
              className={styles.contextWindow}
            >
              {/* 1. User query */}
              <div className={styles.contextEntry}>
                <span className={styles.contextRole}>User</span>
                <span className={styles.contextText}>How much did I spend at Starbucks over the past month?</span>
              </div>

              {/* 2. Write tool call - appears at substep 2 */}
              <motion.div
                className={styles.contextEntry}
                animate={{
                  opacity: activeSubstep >= 2 ? 1 : 0,
                  y: activeSubstep >= 2 ? 0 : 8,
                }}
                transition={{ duration: 0.35 }}
              >
                <span className={styles.contextRole}>Write Tool Call</span>
                <div className={styles.contextCodeBlock}>
                  {codeHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: codeHtml }} />
                  ) : (
                    CODE_LINES.map((line, i) => (
                      <div key={i} className={styles.contextCodeLine}>{line}</div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* 3. Write tool response */}
              <motion.div
                className={styles.contextEntry}
                animate={{
                  opacity: activeSubstep >= 2 ? 1 : 0,
                  y: activeSubstep >= 2 ? 0 : 8,
                }}
                transition={{ delay: 0.1, duration: 0.35 }}
              >
                <span className={styles.contextRole}>Write Tool Response</span>
                <span className={styles.contextDimText}>Success</span>
              </motion.div>

              {/* 4. Bash tool call - appears at substep 4 */}
              <motion.div
                className={styles.contextEntry}
                animate={{
                  opacity: activeSubstep >= 4 ? 1 : 0,
                  y: activeSubstep >= 4 ? 0 : 8,
                }}
                transition={{ duration: 0.35 }}
              >
                <span className={styles.contextRole}>Bash Tool Call</span>
                <span className={styles.contextText}>python3 /tmp/get_txns_starbucks_transactions_last_month.py</span>
              </motion.div>

              {/* 5. Bash tool response - appears at substep 5 */}
              <motion.div
                className={styles.contextEntry}
                animate={{
                  opacity: activeSubstep >= 5 ? 1 : 0,
                  y: activeSubstep >= 5 ? 0 : 8,
                }}
                transition={{ duration: 0.35 }}
              >
                <span className={styles.contextRole}>Bash Tool Response</span>
                <span className={styles.contextResultText}>Total: £47.50</span>
              </motion.div>

              {/* 6. Assistant response - appears at substep 7 */}
              <motion.div
                className={styles.contextEntry}
                animate={{
                  opacity: activeSubstep >= 7 ? 1 : 0,
                  y: activeSubstep >= 7 ? 0 : 8,
                }}
                transition={{ duration: 0.35 }}
              >
                <span className={styles.contextRole}>Assistant</span>
                <span className={styles.contextText}>You spent £47.50 on Starbucks over the last month</span>
              </motion.div>

              {/* Large empty space - visually represents how clean context is */}
              <div className={styles.contextEmpty}>
                {activeSubstep >= 7 && (
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
                      width: activeSubstep >= 7 ? '8%' : '5%',
                    }}
                    style={{
                      backgroundColor:
                        activeSubstep >= 7 ? 'var(--accent-forest)' : 'var(--ink-4)',
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </Wireframe>

            {/* Token cost */}
            <motion.div
              className={styles.tokenCost}
              animate={{ opacity: activeSubstep >= 7 ? 1 : 0 }}
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
          animate={{ opacity: activeSubstep >= 8 ? 1 : 0, y: activeSubstep >= 8 ? 0 : 20 }}
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
