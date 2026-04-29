import { motion } from 'motion/react'
import { Wireframe } from '@/components/paper'
import styles from './03-without-ptc.module.css'

export const fullbleed = true
export const substeps = 6

interface Transaction {
  merchant: string
  amount: string
  isStarbucks: boolean
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { merchant: 'Tesco', amount: '£32.10', isStarbucks: false },
  { merchant: 'Starbucks', amount: '£4.50', isStarbucks: true },
  { merchant: 'Amazon', amount: '£15.99', isStarbucks: false },
  { merchant: 'TfL', amount: '£2.80', isStarbucks: false },
  { merchant: 'Starbucks', amount: '£3.80', isStarbucks: true },
  { merchant: 'Starbucks', amount: '£3.95', isStarbucks: true },
  { merchant: 'Sainsburys', amount: '£23.60', isStarbucks: false },
  { merchant: 'Shell', amount: '£54.20', isStarbucks: false },
  { merchant: 'Starbucks', amount: '£5.20', isStarbucks: true },
  { merchant: 'Waitrose', amount: '£41.30', isStarbucks: false },
  { merchant: 'Deliveroo', amount: '£28.45', isStarbucks: false },
  { merchant: 'John Lewis', amount: '£89.00', isStarbucks: false },
  { merchant: 'Starbucks', amount: '£4.15', isStarbucks: true },
]

export default function WithoutPtcSlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  return (
    <Wireframe className={styles.outer} accent="crimson">
      <div className={styles.container}>
        {/* Title bar */}
        <div className={styles.titleBar}>
          <span className={styles.eyebrow}>Traditional Flow</span>
          <h2 className={styles.title}>Without Programmatic Tool Calling</h2>
        </div>

        {/* Two-column layout */}
        <div className={styles.columns}>
          {/* Left: Flow diagram */}
          <div className={styles.flowColumn}>
            <span className={styles.columnHeader}>AGENT RUNTIME</span>
            {/* Step 1: User question - always visible */}
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

            {/* Step 2: Tool call */}
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>TOOL CALL</span>
              <div className={styles.codeBlock}>
                <code>get_transactions(period='last_month')</code>
              </div>
            </motion.div>

            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 2 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />

            {/* Step 3: Returns flood */}
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 2 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>TOOL RESULT</span>
              <div className={styles.resultBlock}>150 transactions returned</div>
            </motion.div>

            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 3 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />

            {/* Step 4: Manual scan */}
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 3 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>MODEL SCANS</span>
              <div className={styles.scanBlock}>Searching for "Starbucks" among 150 rows...</div>
            </motion.div>

            <motion.div
              className={styles.connector}
              animate={{ opacity: activeSubstep >= 4 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />

            {/* Step 5: Manual sum */}
            <motion.div
              className={styles.flowStep}
              animate={{ opacity: activeSubstep >= 4 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.stepLabel}>MODEL SUMS</span>
              <div className={styles.sumBlock}>
                <code>4.50 + 3.80 + 5.20 + 3.95 + 4.15 + ...</code>
                <span className={styles.warningNote}>error-prone on long lists</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Context window */}
          <div className={styles.contextColumn}>
            <span className={styles.columnHeader}>CONTEXT WINDOW</span>
            <Wireframe
              accent={activeSubstep >= 2 ? 'crimson' : undefined}
              className={styles.contextWindow}
            >
              {/* User message entry */}
              <div className={styles.contextEntry}>
                <span className={styles.contextRole}>User</span>
                <span className={styles.contextText}>How much at Starbucks...?</span>
              </div>

              {/* Tool call entry */}
              <motion.div
                className={styles.contextEntry}
                animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
                transition={{ duration: 0.35 }}
              >
                <span className={styles.contextRole}>Tool Call</span>
                <span className={styles.contextCode}>get_transactions(...)</span>
              </motion.div>

              {/* Tool result label */}
              <motion.div
                className={styles.contextEntry}
                animate={{ opacity: activeSubstep >= 2 ? 1 : 0 }}
                transition={{ duration: 0.35 }}
              >
                <span className={styles.contextRole}>Tool Result</span>
              </motion.div>

              {/* Transaction flood - many rows */}
              <motion.div
                className={styles.transactionFlood}
                animate={{
                  opacity: activeSubstep >= 2 ? 1 : 0,
                }}
                transition={{ duration: 0.35 }}
              >
                {SAMPLE_TRANSACTIONS.map((txn, i) => (
                  <div
                    key={i}
                    className={`${styles.txnRow} ${
                      activeSubstep >= 3 && txn.isStarbucks ? styles.txnHighlight : ''
                    }`}
                  >
                    <span>{txn.merchant}</span>
                    <span>{txn.amount}</span>
                  </div>
                ))}
                <div className={styles.txnEllipsis}>... 137 more rows</div>
              </motion.div>

              {/* Context usage progress bar */}
              <div className={styles.contextBarContainer}>
                <span className={styles.contextBarLabel}>CONTEXT USAGE</span>
                <div className={styles.contextBar}>
                  <motion.div
                    className={styles.contextBarFill}
                    initial={false}
                    animate={{
                      width:
                        activeSubstep === 0
                          ? '5%'
                          : activeSubstep === 1
                            ? '10%'
                            : '85%',
                    }}
                    style={{
                      backgroundColor:
                        activeSubstep >= 2 ? 'var(--accent-crimson)' : 'var(--ink-4)',
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </Wireframe>

            {/* Token cost callout */}
            <motion.div
              className={styles.tokenCost}
              animate={{ opacity: activeSubstep >= 5 ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.tokenLabel}>TOKEN COST</span>
              <span className={styles.tokenValue}>Tens of thousands</span>
            </motion.div>
          </div>
        </div>

        {/* Bottom: Problems row */}
        <motion.div
          className={styles.problemsRow}
          animate={{ opacity: activeSubstep >= 5 ? 1 : 0, y: activeSubstep >= 5 ? 0 : 20 }}
          transition={{ duration: 0.35 }}
        >
          <Wireframe accent="crimson" className={styles.problemCard}>
            <span className={styles.problemTitle}>Context Pollution</span>
            <span className={styles.problemDesc}>150 raw transactions in context</span>
          </Wireframe>
          <Wireframe accent="crimson" className={styles.problemCard}>
            <span className={styles.problemTitle}>Unreliable Math</span>
            <span className={styles.problemDesc}>Model may miscalculate</span>
          </Wireframe>
          <Wireframe accent="crimson" className={styles.problemCard}>
            <span className={styles.problemTitle}>High Token Cost</span>
            <span className={styles.problemDesc}>Tens of thousands of tokens consumed</span>
          </Wireframe>
        </motion.div>
      </div>
    </Wireframe>
  )
}

export const notes = `This slide shows the traditional approach without PTC. All 150 transactions flood into the context window, consuming tens of thousands of tokens. The model must manually scan and sum — error-prone and expensive.`
