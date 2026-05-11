import { TimelineSlide, TimelineCard } from '../components'
import styles from './history.module.css'

export const fullbleed = true
export const substeps = 9

const TOTAL_MONTHS = 51 // June 2021 → Sep 2025
const RANGE_START = 8
const RANGE = 84
const pos = (months: number) => RANGE_START + (months / TOTAL_MONTHS) * RANGE

interface Item {
  name: string
  date: string
  lines: string[]
  logo: string
  row: 'top' | 'bottom'
  position: number
}

const items: Item[] = [
  {
    name: 'GitHub Copilot',
    date: 'June 2021',
    lines: ['Inline Copilot Suggestion', 'Powered by Codex'],
    logo: '/assets/github_copilot.svg',
    row: 'bottom',
    position: pos(0),
  },
  {
    name: 'ChatGPT',
    date: 'November 2022',
    lines: ['ChatGPT release,', 'the advent of Generative AI'],
    logo: '/assets/openai.svg',
    row: 'top',
    position: pos(17),
  },
  {
    name: 'Cursor',
    date: 'March 2023',
    lines: ['Cursor and', 'the Agentic IDEs'],
    logo: '/assets/cursor.svg',
    row: 'bottom',
    position: pos(21),
  },
  {
    name: 'Copilot Chat',
    date: 'December 2023',
    lines: ['Copilot Chat'],
    logo: '/assets/github_copilot.svg',
    row: 'top',
    position: pos(30),
  },
  {
    name: 'Copilot Agent',
    date: 'February 2025',
    lines: ['Copilot Agent Mode'],
    logo: '/assets/github_copilot.svg',
    row: 'bottom',
    position: pos(44),
  },
  {
    name: 'Claude Code',
    date: 'February 2025',
    lines: ['Claude Code'],
    logo: '/assets/claude_code.svg',
    row: 'top',
    position: pos(44),
  },
  {
    name: 'Sonnet 4.5',
    date: 'September 2025',
    lines: ['Sonnet 4.5 Release'],
    logo: '/assets/claude.svg',
    row: 'bottom',
    position: pos(51),
  },
]

function getItemOpacity(index: number, activeSubstep: number): number {
  const isDimming = activeSubstep >= 1 && activeSubstep <= items.length
  const isRevealed = activeSubstep >= index + 1

  if (!isDimming) return 1 // substep 0 or beyond last reveal: all visible
  if (isRevealed) return 1
  return 0.15
}

export default function HistorySlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  return (
    <TimelineSlide
      title="History of Agentic Coding"
      accent="var(--accent-ochre)"
      wireframeAccent="ochre"
      items={items}
      activeSubstep={activeSubstep}
      getItemOpacity={getItemOpacity}
      connectorThreshold={0.99}
      renderCard={(item) => (
        <TimelineCard className={styles.card}>
          <div className={styles.logoArea}>
            <img src={item.logo} alt="" className={styles.logo} />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.name}>{item.name}</div>
            <div className={styles.date}>{item.date}</div>
            <div className={styles.description}>
              {item.lines.map((line, j) => (
                <div key={j}>{line}</div>
              ))}
            </div>
          </div>
        </TimelineCard>
      )}
    />
  )
}

export const notes = 'Walk through the history of agentic coding — from Codex inline suggestions to modern coding agents like Claude Code.'
