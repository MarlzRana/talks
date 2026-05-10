import { motion } from 'motion/react'
import { Wireframe } from '@/components/paper'
import styles from './05-interface-history.module.css'

export const fullbleed = true
export const substeps = 5

// Timeline spans Jan 1971 → Nov 2024 = 646 months
// Items placed within the core center of the viewport
const TOTAL_MONTHS = 646
const RANGE_START = 15
const RANGE = 56
const pos = (months: number) => RANGE_START + (months / TOTAL_MONTHS) * RANGE

interface TimelineItem {
  name: string
  date: string
  anchor: string
  description: string
  interaction: string
  image: string
  imagePosition?: string
  row: 'top' | 'bottom'
  position: number
}

const items: TimelineItem[] = [
  {
    name: 'CLI',
    date: '1971',
    anchor: 'Thompson Shell',
    description: 'Type a command, get output',
    interaction: 'Human ↔ Computer',
    image: '/assets/unix_shell_creation.jpg',
    row: 'top',
    position: pos(0), // Jan 1971
  },
  {
    name: 'GUI',
    date: 'March 1973',
    anchor: 'Xerox Alto',
    description: 'Windows, mouse, icons',
    interaction: 'Human ↔ Computer',
    image: '/assets/gui_xero.webp',
    row: 'bottom',
    position: pos(26), // Mar 1973
  },
  {
    name: 'Web API',
    date: 'February 2000',
    anchor: 'Salesforce',
    description: 'XML over HTTP',
    interaction: 'Computer ↔ Computer',
    image: '/assets/marc_benioff.webp',
    imagePosition: 'top',
    row: 'top',
    position: pos(349), // Feb 2000
  },
  {
    name: 'MCP',
    date: 'November 2024',
    anchor: 'Anthropic',
    description: 'USB-C for AI agents',
    interaction: 'Agent ↔ Computer',
    image: '/assets/mcp_dsp.webp',
    row: 'bottom',
    position: pos(646), // Nov 2024
  },
]

function TimelineCard({ item }: { item: TimelineItem }) {
  return (
    <div className={styles.card}>
      <span className={styles.cardMark} data-pos="tl" />
      <span className={styles.cardMark} data-pos="tr" />
      <span className={styles.cardMark} data-pos="bl" />
      <span className={styles.cardMark} data-pos="br" />
      <img
        src={item.image}
        alt=""
        className={styles.thumbnail}
        style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
      />
      <div className={styles.cardBody}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.date}>{item.date}</div>
        <div className={styles.anchor}>{item.anchor}</div>
        <div className={styles.description}>{item.description}</div>
        <div className={styles.interaction}>{item.interaction}</div>
      </div>
    </div>
  )
}

export default function InterfaceHistorySlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  return (
    <Wireframe className={styles.outer}>
      <div className={styles.container}>
        {/* Title box with extending rails */}
        <div className={styles.titleBox}>
          <span className={styles.mark} data-pos="tl" />
          <span className={styles.mark} data-pos="tr" />
          <span className={styles.mark} data-pos="bl" />
          <span className={styles.mark} data-pos="br" />
          <span className={styles.titleText}>Evolution of Computer Interfaces</span>
        </div>

        {/* Timeline line */}
        <div className={styles.timelineLine} />

        {/* Timeline items */}
        {items.map((item, i) => {
          const isRevealed = activeSubstep >= i + 1

          return (
            <motion.div
              key={i}
              className={`${styles.item} ${item.row === 'top' ? styles.itemTop : styles.itemBottom}`}
              style={{ left: `${item.position}%` }}
              animate={{
                opacity: isRevealed ? 1 : 0,
                y: isRevealed ? 0 : item.row === 'top' ? 12 : -12,
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {item.row === 'top' ? (
                <>
                  <TimelineCard item={item} />
                  <div className={styles.connector} />
                </>
              ) : (
                <>
                  <div className={styles.connector} />
                  <TimelineCard item={item} />
                </>
              )}
            </motion.div>
          )
        })}
      </div>
    </Wireframe>
  )
}

export const notes = `Four interfaces, four eras. CLI in '71 and GUI in '73 are both human-facing — keyboard or mouse, but a person is on the other end. APIs in 2000 changed the audience: now it's another computer. MCP in 2024 changes it again: now it's an agent. The rest of this talk is about that last shift — why agents need a different kind of interface than computers do.`
