import { motion } from 'motion/react'
import { Wireframe } from '@/components/paper'
import styles from './02-history.module.css'

export const fullbleed = true
export const substeps = 9

const TOTAL_MONTHS = 51 // June 2021 → Sep 2025
const RANGE_START = 8
const RANGE = 84 // 92 - 8
const pos = (months: number) => RANGE_START + (months / TOTAL_MONTHS) * RANGE

interface TimelineItem {
  date: string
  lines: string[]
  logo: string
  row: 'top' | 'bottom'
  position: number
}

const items: TimelineItem[] = [
  {
    date: 'June 2021',
    lines: ['Inline Copilot Suggestion', 'Powered by Codex'],
    logo: '/assets/github_copilot.svg',
    row: 'bottom',
    position: pos(0),
  },
  {
    date: 'November 2022',
    lines: ['ChatGPT release,', 'the advent of Generative AI'],
    logo: '/assets/openai.svg',
    row: 'top',
    position: pos(17),
  },
  {
    date: 'March 2023',
    lines: ['Cursor and', 'the Agentic IDEs'],
    logo: '/assets/cursor.svg',
    row: 'bottom',
    position: pos(21),
  },
  {
    date: 'December 2023',
    lines: ['Copilot Chat'],
    logo: '/assets/github_copilot.svg',
    row: 'top',
    position: pos(30),
  },
  {
    date: 'February 2025',
    lines: ['Copilot Agent Mode'],
    logo: '/assets/github_copilot.svg',
    row: 'bottom',
    position: pos(44),
  },
  {
    date: 'February 2025',
    lines: ['Claude Code'],
    logo: '/assets/claude_code.svg',
    row: 'top',
    position: pos(44),
  },
  {
    date: 'September 2025',
    lines: ['Sonnet 4.5 Release'],
    logo: '/assets/claude.svg',
    row: 'bottom',
    position: pos(51),
  },
]

export default function HistorySlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  const isDimming = activeSubstep >= 1 && activeSubstep <= 7

  return (
    <Wireframe className={styles.outer}>
      <div className={styles.container}>
        {/* Title box with extending lines via ::before/::after */}
        <motion.div
          className={styles.titleBox}
          animate={{ opacity: isDimming ? 0.2 : 1 }}
          transition={{ duration: 0.35 }}
        >
          <span className={styles.mark} data-pos="tl" />
          <span className={styles.mark} data-pos="tr" />
          <span className={styles.mark} data-pos="bl" />
          <span className={styles.mark} data-pos="br" />
          <span className={styles.titleText}>History of Agentic Coding</span>
        </motion.div>

        {/* Single timeline line */}
        <motion.div
          className={styles.timelineLine}
          animate={{ opacity: isDimming ? 0.3 : 1 }}
          transition={{ duration: 0.35 }}
        />

        {/* Timeline items */}
        {items.map((item, i) => {
          const isRevealed = activeSubstep >= i + 1
          const opacity = isDimming ? (isRevealed ? 1 : 0.15) : 1

          return (
            <motion.div
              key={i}
              className={`${styles.item} ${item.row === 'top' ? styles.itemTop : styles.itemBottom}`}
              style={{ left: `${item.position}%` }}
              animate={{ opacity }}
              transition={{ duration: 0.35 }}
            >
              {item.row === 'top' ? (
                <>
                  <img src={item.logo} alt="" className={styles.logo} />
                  <div className={styles.date}>{item.date}</div>
                  <div className={styles.description}>
                    {item.lines.map((line, j) => (
                      <div key={j}>{line}</div>
                    ))}
                  </div>
                  <div className={styles.connector} />
                </>
              ) : (
                <>
                  <div className={styles.connector} />
                  <div className={styles.date}>{item.date}</div>
                  <div className={styles.description}>
                    {item.lines.map((line, j) => (
                      <div key={j}>{line}</div>
                    ))}
                  </div>
                  <img src={item.logo} alt="" className={styles.logo} />
                </>
              )}
            </motion.div>
          )
        })}
      </div>
    </Wireframe>
  )
}

export const notes = 'Walk through the history of agentic coding — from Codex inline suggestions to modern coding agents like Claude Code.'
