import { motion, AnimatePresence } from 'motion/react'
import { Wireframe } from '@/components/paper'
import styles from './06-memory-consolidation.module.css'

export const fullbleed = true
export const substeps = 9

const FRAGMENTS = [
  { id: 1, text: 'Project uses uv', x: 8, y: 6 },
  { id: 2, text: 'Run tests using pytest', x: 62, y: 4 },
  { id: 3, text: 'API key in .env', x: 6, y: 65 },
  { id: 4, text: 'prefer uv over pip', x: 56, y: 44 },
  { id: 5, text: 'Project uses pip', x: 28, y: 78 },
  { id: 6, text: 'Project uses Python 3.13', x: 66, y: 76 },
]

export default function MemoryConsolidationSlide({
  activeSubstep = 0,
}: {
  activeSubstep?: number
}) {
  // Substep flow:
  // 0: title only
  // 1: fragments appear
  // 2: PRUNE label + fragment #5 highlighted
  // 3: PRUNE label STAYS + fragment #5 crossed out
  // 4: PRUNE gone + dim. MERGE label auto-appears (0.4s delay) + fragments #1 & #4 highlighted
  // 5: MERGE STAYS, merge applied (fragment #4 hidden, fragment #1 shows both texts)
  // 6: MERGE gone. REFRESH auto-appears (0.4s delay) + fragment #3 highlighted
  // 7: REFRESH STAYS + fragment #3 text changes
  // 8: REFRESH gone. Benefit cards auto-appear (0.5s delay)

  const pruneActive = activeSubstep === 2 || activeSubstep === 3
  const pruneApplied = activeSubstep >= 3
  const mergeActive = activeSubstep === 4 || activeSubstep === 5
  const mergeApplied = activeSubstep >= 5
  const refreshActive = activeSubstep === 6 || activeSubstep === 7
  const refreshApplied = activeSubstep >= 7

  return (
    <Wireframe className={styles.outer} accent="violet">
      <div className={styles.container}>
        {/* Title bar */}
        <div className={styles.titleBar}>
          <span className={styles.eyebrow}>Claude Code Feature</span>
          <h2 className={styles.title}>Memory Consolidation</h2>
        </div>

        <div className={styles.subtitle}>
          Auto Dream: like REM sleep for agent memory — toggleable via /memory
        </div>

        {/* Visual area with scattered fragments */}
        <div className={styles.visualArea}>
          <Wireframe className={styles.memorySpace}>
            {/* Scattered memory fragments */}
            {FRAGMENTS.map((fragment) => {
              // Fragment #5: PRUNE target
              const isPruneTarget = fragment.id === 5
              // Fragment #4: MERGE away
              const isMergeAway = fragment.id === 4
              // Fragment #1: MERGE highlight
              const isMergeKeep = fragment.id === 1
              // Fragment #3: REFRESH target
              const isRefreshTarget = fragment.id === 3

              const extraClasses = []
              // PRUNE: highlight at preview (substep 2), crimson when applied (substep 3+)
              if (isPruneTarget && pruneActive && !pruneApplied) extraClasses.push(styles.fragmentHighlight)
              if (isPruneTarget && pruneApplied) extraClasses.push(styles.fragmentPruned)
              // MERGE: highlight at preview (substep 5), merged when applied (substep 6+)
              if (isMergeAway && mergeActive && !mergeApplied) extraClasses.push(styles.fragmentMergeHighlight)
              if (isMergeKeep && mergeActive && !mergeApplied) extraClasses.push(styles.fragmentMergeHighlight)
              if (isMergeAway && mergeApplied) extraClasses.push(styles.fragmentMerged)
              // REFRESH: highlight at preview (substep 8), green when applied (substep 9+)
              if (isRefreshTarget && refreshActive && !refreshApplied) extraClasses.push(styles.fragmentHighlight)
              if (isRefreshTarget && refreshApplied) extraClasses.push(styles.fragmentRefreshed)

              let opacity = activeSubstep < 1 ? 0 : 1
              // PRUNE: dim only after label disappears (substep 4+)
              if (isPruneTarget && pruneApplied && !pruneActive) opacity = 0.2
              // MERGE: hide when merge applied (substep 6+)
              if (isMergeAway && mergeApplied) opacity = 0

              return (
                <motion.div
                  key={fragment.id}
                  className={`${styles.memoryFragment} ${extraClasses.join(' ')}`}
                  style={{ left: `${fragment.x}%`, top: `${fragment.y}%` }}
                  initial={false}
                  animate={{ opacity }}
                  transition={{ duration: 0.5 }}
                >
                  {/* REFRESH: show before/after together */}
                  {isRefreshTarget && refreshApplied ? (
                    <span className={styles.refreshContent}>
                      <span className={styles.strikethrough}>API key in .env</span>
                      <span className={styles.refreshNew}>API key in .env.local</span>
                    </span>
                  ) : isPruneTarget && pruneApplied ? (
                    <span className={styles.strikethrough}>Project uses pip</span>
                  ) : isMergeKeep && mergeApplied ? (
                    // After merge: show both texts in fragment #1
                    <span className={styles.mergeContent}>
                      <span>Project uses uv</span>
                      <span className={styles.strikethrough}>prefer uv over pip</span>
                    </span>
                  ) : (
                    <span>{fragment.text}</span>
                  )}
                </motion.div>
              )
            })}

            {/* PRUNE label — positioned near fragment #5 */}
            <AnimatePresence mode="wait">
              {pruneActive && (
                <motion.div
                  key="prune"
                  className={styles.operationLabel}
                  style={{ left: '28%', top: '56%' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35 }}
                >
                  <span className={styles.opName}>PRUNE</span>
                  <span className={styles.opDesc}>Remove outdated information</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MERGE label — substeps 4-5 */}
            <AnimatePresence mode="wait">
              {mergeActive && (
                <motion.div
                  key="merge"
                  className={styles.operationLabel}
                  style={{ left: '30%', top: '22%' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: activeSubstep === 4 ? 0.4 : 0, duration: 0.35 }}
                >
                  <span className={styles.opName}>MERGE</span>
                  <span className={styles.opDesc}>Combine duplicate entries</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* REFRESH label — positioned near fragment #3 */}
            <AnimatePresence mode="wait">
              {refreshActive && (
                <motion.div
                  key="refresh"
                  className={styles.operationLabel}
                  style={{ left: '6%', top: '45%' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: activeSubstep === 6 ? 0.4 : 0, duration: 0.35 }}
                >
                  <span className={styles.opName}>REFRESH</span>
                  <span className={styles.opDesc}>Update stale context</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Background label for substep 0 */}
            {activeSubstep === 0 && (
              <div className={styles.centerLabel}>Memories accumulate over time...</div>
            )}
          </Wireframe>
        </div>

        {/* Bottom: Benefits row — appears at substep 8 with delay */}
        <motion.div
          className={styles.benefitsRow}
          animate={{
            opacity: activeSubstep >= 8 ? 1 : 0,
            y: activeSubstep >= 8 ? 0 : 20,
          }}
          transition={{ delay: activeSubstep === 8 ? 0.5 : 0, duration: 0.35 }}
        >
          <Wireframe accent="violet" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>Prevents Memory Rot</span>
            <span className={styles.benefitDesc}>
              Removes contradictions and outdated information
            </span>
          </Wireframe>
          <Wireframe accent="violet" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>Saves Context Space</span>
            <span className={styles.benefitDesc}>
              Smaller memories free up the context window
            </span>
          </Wireframe>
          <Wireframe accent="violet" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>Improves Consistency</span>
            <span className={styles.benefitDesc}>
              Cleaner memory leads to more reliable behavior
            </span>
          </Wireframe>
        </motion.div>
      </div>
    </Wireframe>
  )
}

export const notes = `Auto Dream is Claude Code's background memory consolidation feature, toggleable via /memory. It runs automatically during idle periods and performs three core operations: PRUNE (remove outdated information), MERGE (combine duplicate entries), and REFRESH (update stale context). Like REM sleep consolidating the brain's memories, Auto Dream processes accumulated information offline to keep memory files accurate and lean. It's on by default, read-only on project files, and prevents "memory drift" where accumulated contradictions degrade agent understanding over time.`
