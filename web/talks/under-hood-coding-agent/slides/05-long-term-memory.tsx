import { motion } from 'motion/react'
import { Wireframe } from '@/components/paper'
import styles from './05-long-term-memory.module.css'

export const fullbleed = true
export const substeps = 8

export default function LongTermMemorySlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  return (
    <Wireframe className={styles.outer} accent="violet">
      <div className={styles.container}>
        {/* Title bar */}
        <div className={styles.titleBar}>
          <span className={styles.eyebrow}>Context Engineering</span>
          <h2 className={styles.title}>Long Term Memory</h2>
        </div>

        <div className={styles.subtitle}>
          Each session starts with a fresh context window
        </div>

        {/* Two session panels */}
        <div className={styles.sessions}>
          {/* Session 1: Memory Save */}
          <motion.div
            className={styles.sessionPanel}
            animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
            transition={{ duration: 0.35 }}
          >
            <Wireframe className={styles.sessionWindow}>
              <span className={styles.sessionHeader}>SESSION 1</span>

              {/* User message */}
              <div className={styles.contextEntry}>
                <span className={styles.contextRole}>User</span>
                <span className={styles.contextText}>Install the requests library</span>
              </div>

              {/* Agent tries pip - fails */}
              <motion.div
                className={styles.contextEntry}
                animate={{ opacity: activeSubstep >= 2 ? 1 : 0 }}
                transition={{ duration: 0.35 }}
              >
                <span className={styles.contextRole}>Agent</span>
                <div className={styles.commandBlock}>
                  <code>pip install requests</code>
                </div>
                <span className={styles.statusFail}>command not found: pip</span>
              </motion.div>

              {/* Agent tries uv - succeeds */}
              <motion.div
                className={styles.contextEntry}
                animate={{ opacity: activeSubstep >= 3 ? 1 : 0 }}
                transition={{ duration: 0.35 }}
              >
                <span className={styles.contextRole}>Agent</span>
                <div className={styles.commandBlock}>
                  <code>uv pip install requests</code>
                </div>
                <span className={styles.statusSuccess}>Successfully installed requests</span>
              </motion.div>

              {/* User: remember */}
              <motion.div
                className={styles.contextEntry}
                animate={{ opacity: activeSubstep >= 4 ? 1 : 0 }}
                transition={{ duration: 0.35 }}
              >
                <span className={styles.contextRole}>User</span>
                <span className={styles.contextText}>Remember to always use uv, not pip</span>
              </motion.div>

              {/* Memory saved */}
              {activeSubstep >= 4 && (
                <motion.div
                  className={styles.memorySaveBlock}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.35 }}
                >
                  <span className={styles.memoryLabel}>MEMORY SAVED</span>

                  <div className={styles.memoryFileBlock}>
                    <span className={styles.memoryFileName}>Written to MEMORY.md:</span>
                    <span className={styles.memoryFileEntry}>
                      - <span className={styles.memoryFileLink}>[Package manager]</span>(feedback_uv.md) — This project uses uv, not pip
                    </span>
                  </div>

                  <span className={styles.memoryNote}>
                    auto-memory must be enabled (on by default) — one MEMORY.md per project
                  </span>
                </motion.div>
              )}
            </Wireframe>
          </motion.div>

          {/* Session 2: Memory Retrieve */}
          <motion.div
            className={styles.sessionPanel}
            animate={{ opacity: activeSubstep >= 5 ? 1 : 0 }}
            transition={{ duration: 0.35 }}
          >
            <Wireframe accent="violet" className={styles.sessionWindow}>
              <span className={styles.sessionHeader}>SESSION 2</span>

              {/* Memory at top of context */}
              <div className={styles.memoryRetrieveBlock}>
                <span className={styles.memoryLabel}>MEMORY LOADED</span>
                <span className={styles.memoryText}>This project uses uv, not pip</span>
              </div>

              {/* User message */}
              <motion.div
                className={styles.contextEntry}
                animate={{ opacity: activeSubstep >= 6 ? 1 : 0 }}
                transition={{ duration: 0.35 }}
              >
                <span className={styles.contextRole}>User</span>
                <span className={styles.contextText}>Install pandas</span>
              </motion.div>

              {/* Agent uses uv directly */}
              <motion.div
                className={styles.contextEntry}
                animate={{ opacity: activeSubstep >= 6 ? 1 : 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
              >
                <span className={styles.contextRole}>Agent</span>
                <div className={styles.commandBlock}>
                  <code>uv pip install pandas</code>
                </div>
                <span className={styles.statusSuccess}>Successfully installed pandas</span>
              </motion.div>

              {/* Clean context indicator */}
              <div className={styles.contextEmpty}>
                {activeSubstep >= 6 && (
                  <motion.span
                    className={styles.noFailureLabel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.5, duration: 0.35 }}
                  >
                    No failed attempts
                  </motion.span>
                )}
              </div>
            </Wireframe>
          </motion.div>
        </div>

        {/* Bottom: Benefits row */}
        <motion.div
          className={styles.benefitsRow}
          animate={{ opacity: activeSubstep >= 7 ? 1 : 0, y: activeSubstep >= 7 ? 0 : 20 }}
          transition={{ duration: 0.35 }}
        >
          <Wireframe accent="violet" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>Persists Across Sessions</span>
            <span className={styles.benefitDesc}>Knowledge survives context resets</span>
          </Wireframe>
          <Wireframe accent="violet" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>Learns From Mistakes</span>
            <span className={styles.benefitDesc}>Failures become future guidance</span>
          </Wireframe>
          <Wireframe accent="violet" className={styles.benefitCard}>
            <span className={styles.benefitTitle}>Reduces Context Waste</span>
            <span className={styles.benefitDesc}>No tokens spent on known-bad approaches</span>
          </Wireframe>
        </motion.div>
      </div>
    </Wireframe>
  )
}

export const notes = `Long-term memory allows coding agents to persist knowledge across sessions. Each new session starts with a blank context, but saved memories are loaded at the top. The agent learns from past mistakes — like discovering a project uses uv instead of pip — and applies that knowledge immediately in future sessions, avoiding repeated failures.`
