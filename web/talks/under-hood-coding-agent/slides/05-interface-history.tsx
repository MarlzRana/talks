import { useRef, useEffect, useState } from 'react'
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

function TimelineCard({ item, highlighted }: { item: TimelineItem; highlighted?: boolean }) {
  return (
    <motion.div
      className={`${styles.card} ${highlighted ? styles.cardHighlighted : ''}`}
      animate={highlighted ? { borderColor: 'var(--accent-cyan)' } : {}}
      transition={{ duration: 0.5 }}
    >
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
    </motion.div>
  )
}

// Get position for a substep index (0 = left edge, 1-4 = item positions)
function getPosition(substep: number): number {
  if (substep <= 0) return 0
  if (substep > items.length) return items[items.length - 1].position
  return items[substep - 1].position
}

export default function InterfaceHistorySlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  const prevSubstepRef = useRef(activeSubstep)
  const [pulse, setPulse] = useState<{ from: number; to: number; key: number } | null>(null)
  const pulseKeyRef = useRef(0)

  useEffect(() => {
    if (activeSubstep !== prevSubstepRef.current) {
      const prev = prevSubstepRef.current
      const fromPos = getPosition(prev)
      const toPos = getPosition(activeSubstep)
      pulseKeyRef.current += 1
      setPulse({ from: fromPos, to: toPos, key: pulseKeyRef.current })
      prevSubstepRef.current = activeSubstep
    }
  }, [activeSubstep])

  const isFinalStep = activeSubstep >= items.length

  return (
    <Wireframe className={styles.outer} accent="cyan">
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

        {/* Timeline pulse — single element that travels between positions */}
        {pulse && (
          <motion.div
            key={pulse.key}
            className={styles.pulse}
            initial={{ left: `${pulse.from}%`, opacity: 0 }}
            animate={{ left: `${pulse.to}%`, opacity: [0, 1, 0] }}
            transition={{
              left: { duration: 0.7, ease: 'easeOut' },
              opacity: { duration: 1.0, times: [0, 0.3, 1] },
            }}
          />
        )}

        {/* Timeline items */}
        {items.map((item, i) => {
          const isRevealed = activeSubstep >= i + 1
          const isMcp = i === items.length - 1
          const dimmed = isFinalStep && !isMcp

          return (
            <motion.div
              key={i}
              className={`${styles.item} ${item.row === 'top' ? styles.itemTop : styles.itemBottom}`}
              style={{ left: `${item.position}%` }}
              animate={{ opacity: dimmed ? 0.35 : isRevealed ? 1 : 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              {item.row === 'top' ? (
                <>
                  <TimelineCard
                    item={item}
                    highlighted={isFinalStep && isMcp}
                  />
                  <motion.div
                    className={`${styles.connector} ${styles.connectorDown}`}
                    animate={{ scaleY: isRevealed ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    style={{ transformOrigin: 'top' }}
                  />
                </>
              ) : (
                <>
                  <motion.div
                    className={`${styles.connector} ${styles.connectorUp}`}
                    animate={{ scaleY: isRevealed ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    style={{ transformOrigin: 'bottom' }}
                  />
                  <TimelineCard
                    item={item}
                    highlighted={isFinalStep && isMcp}
                  />
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
