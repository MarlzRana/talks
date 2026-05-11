import { motion } from 'motion/react'
import { Wireframe } from '@/components/paper'
import styles from './intro.module.css'

export const fullbleed = true
export const substeps = 2

const AGENT_ITEMS = ['Model', 'Tools', 'Environment', 'ReACT Loop']

const CONCEPTS = [
  {
    name: 'Context Management',
    desc: 'Why is it important?',
  },
  {
    name: 'Progressive Disclosure',
    desc: 'Skills and rules',
  },
  {
    name: 'Programmatic Tool Execution',
    desc: 'An effective means to manage the context window',
  },
  {
    name: 'Model Context Protocol',
    desc: 'Give the agent visibility into external context',
  },
  {
    name: 'Long Term Memory',
    desc: 'Persist learnings across sessions',
  },
]

export default function RecapSlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  return (
    <Wireframe className={styles.outer} accent="violet">
      <div className={styles.container}>
        <div className={styles.columns}>
          {/* Left: What is a coding agent */}
          <div className={styles.section}>
            <Wireframe className={styles.sectionBox}>
              <span className={styles.sectionEyebrow}>Part 1</span>
              <h2 className={styles.sectionTitle}>
                What is a Coding Agent Under the Hood?
              </h2>
              <ul className={styles.itemList}>
                {AGENT_ITEMS.map((item) => (
                  <li key={item} className={styles.item}>
                    <span className={styles.itemName}>{item}</span>
                  </li>
                ))}
              </ul>
            </Wireframe>
          </div>

          {/* Right: Fundamental concepts */}
          <motion.div
            className={styles.section}
            initial={false}
            animate={{ opacity: activeSubstep >= 1 ? 1 : 0 }}
            transition={{ duration: 0.35 }}
          >
            <Wireframe accent="violet" className={styles.sectionBox}>
              <span className={styles.sectionEyebrow}>Part 2</span>
              <h2 className={styles.sectionTitle}>Fundamental Concepts</h2>
              <ul className={styles.itemList}>
                {CONCEPTS.map((concept) => (
                  <li key={concept.name} className={styles.item}>
                    <span className={styles.itemName}>{concept.name}</span>
                    <span className={styles.itemDesc}>{concept.desc}</span>
                  </li>
                ))}
              </ul>
            </Wireframe>
          </motion.div>
        </div>
      </div>
    </Wireframe>
  )
}

export const notes = `Recap slide. Mirrors the intro — revisit the two parts covered: what a coding agent is (model, tools, environment, ReACT loop) and the five fundamental context engineering concepts.`
