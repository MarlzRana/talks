import { motion, AnimatePresence } from 'motion/react'
import { Wireframe } from '@/components/paper'
import styles from './05-jit-context.module.css'

export const fullbleed = true
export const substeps = 6

const TOOLS = [
  {
    name: 'Skills',
    desc: 'Task-specific procedures loaded when relevant.',
    example: '"How to edit PDFs"\n"How to run evals"\n"How to use the deploy system"',
  },
  {
    name: 'Rules',
    desc: 'Stable behavioural constraints.',
    example: '"Never commit secrets"\n"Run tests before finalising"',
  },
  {
    name: 'AGENTS.md',
    desc: 'Repo-level operating manual.',
    example: 'build commands\ncode style\ntest conventions',
  },
  {
    name: 'Descendant AGENTS.md',
    desc: 'Local instructions scoped to a subdirectory — loaded only when the agent touches that part of the tree.',
    example:
      '/AGENTS.md            global\n/frontend/AGENTS.md   UI conventions\n/backend/AGENTS.md    API conventions\n/backend/payments/    payment safety',
  },
]

export default function JitContextSlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  // 0  Title + lede
  // 1  Bad / better patterns
  // 2-5 Tool cards reveal in order (Skills, Rules, AGENTS.md, descendant)
  // 6  Takeaway
  const showPatterns = activeSubstep >= 1
  const visibleTools = Math.max(0, activeSubstep - 1)
  const showTakeaway = activeSubstep >= 6

  return (
    <Wireframe className={styles.outer} accent="forest">
      <div className={styles.container}>
        <div className={styles.titleBar}>
          <span className={styles.eyebrow}>Context Engineering · 3 / 3</span>
          <h2 className={styles.title}>Just-in-time context</h2>
          <p className={styles.lede}>
            Context is finite — so don't load everything up front. Assemble the
            right working set at the right moment.
          </p>
        </div>

        <div className={styles.body}>
          {/* Bad / Better pattern */}
          <AnimatePresence>
            {showPatterns && (
              <motion.div
                key="patterns"
                className={styles.patternRow}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className={`${styles.patternBox} ${styles.patternBad}`}>
                  <span className={`${styles.patternLabel} ${styles.patternBadLabel}`}>
                    Bad pattern
                  </span>
                  <span className={styles.patternTitle}>
                    Load entire repo + all docs + all rules + full transcript
                  </span>
                  <ul className={styles.patternList}>
                    <li>high cost</li>
                    <li>noisy context</li>
                    <li>context rot</li>
                  </ul>
                </div>
                <div className={`${styles.patternBox} ${styles.patternGood}`}>
                  <span className={`${styles.patternLabel} ${styles.patternGoodLabel}`}>
                    Better pattern
                  </span>
                  <span className={styles.patternTitle}>
                    Load only the relevant instructions, files, skills, and state
                  </span>
                  <ul className={styles.patternList}>
                    <li>cleaner context</li>
                    <li>better task focus</li>
                    <li>more headroom</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tools */}
          <AnimatePresence>
            {visibleTools > 0 && (
              <motion.div
                key="tools-header"
                className={styles.toolsHeader}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                Tools for assembling context
              </motion.div>
            )}
          </AnimatePresence>

          <div className={styles.toolsGrid}>
            {TOOLS.map((t, i) => (
              <AnimatePresence key={t.name}>
                {visibleTools > i && (
                  <motion.div
                    className={styles.toolCard}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className={styles.toolName}>{t.name}</span>
                    <span className={styles.toolDesc}>{t.desc}</span>
                    <pre className={styles.toolExample}>{t.example}</pre>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>

          {/* Takeaway */}
          <AnimatePresence>
            {showTakeaway && (
              <motion.div
                key="takeaway"
                className={styles.takeaway}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <strong>Don't maximise context.</strong> Assemble it just in time:
                global rules <em>plus</em> the local rules for the part of the
                repo the agent is touching.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Wireframe>
  )
}

export const notes = `Just-in-time context.

Core idea: context is finite, so don't load everything upfront. Assemble the right working set at the right moment.

Bad pattern: load entire repo + all docs + all rules + full transcript. High cost, noisy context, context rot — straight back to the previous slide's problem.

Better pattern: load only what's relevant for this task — instructions, files, skills, state.

Tools we have:
- Skills: task-specific procedures, loaded when the agent recognises them as relevant. e.g. "How to edit PDFs", "How to run evals".
- Rules: stable behavioural constraints. e.g. "Never commit secrets", "Run tests before finalising".
- AGENTS.md: repo-level operating manual. Build commands, code style, test conventions, architecture.
- Descendant AGENTS.md: the key one for monorepos. Local instructions scoped to a subdirectory. /AGENTS.md is the global rules, /frontend/AGENTS.md has UI conventions, /backend/AGENTS.md has API conventions, /backend/payments/AGENTS.md has payment-specific safety rules. The agent only loads the local ones for the area it's working in.

Why descendant AGENTS.md matters: a monorepo doesn't have one context. Different areas need different rules. The agent should load global + local for the path it's touching, not everything.

Takeaway: don't maximise context. Assemble it just in time.`
