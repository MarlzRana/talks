import { TimelineSlide, TimelineCard } from '../components'
import styles from './05-interface-history.module.css'

export const fullbleed = true
export const substeps = 5

// Timeline spans Jan 1971 → Nov 2024 = 646 months
const TOTAL_MONTHS = 646
const RANGE_START = 15
const RANGE = 56
const pos = (months: number) => RANGE_START + (months / TOTAL_MONTHS) * RANGE

interface Item {
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

const items: Item[] = [
  {
    name: 'CLI',
    date: '1971',
    anchor: 'Thompson Shell',
    description: 'Type a command, get output',
    interaction: 'Human ↔ Computer',
    image: '/assets/unix_shell_creation.jpg',
    row: 'top',
    position: pos(0),
  },
  {
    name: 'GUI',
    date: 'March 1973',
    anchor: 'Xerox Alto',
    description: 'Windows, mouse, icons',
    interaction: 'Human ↔ Computer',
    image: '/assets/gui_xero.webp',
    row: 'bottom',
    position: pos(26),
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
    position: pos(349),
  },
  {
    name: 'MCP',
    date: 'November 2024',
    anchor: 'Anthropic',
    description: 'USB-C for AI agents',
    interaction: 'Agent ↔ Computer',
    image: '/assets/mcp_dsp.webp',
    row: 'bottom',
    position: pos(646),
  },
]

function getItemOpacity(index: number, activeSubstep: number): number {
  const isRevealed = activeSubstep >= index + 1
  const isFinalStep = activeSubstep >= items.length
  const isMcp = index === items.length - 1
  if (!isRevealed) return 0
  if (isFinalStep && !isMcp) return 0.35
  return 1
}

export default function InterfaceHistorySlide({ activeSubstep = 0 }: { activeSubstep?: number }) {
  const isFinalStep = activeSubstep >= items.length

  return (
    <TimelineSlide
      title="Evolution of Computer Interfaces"
      accent="var(--accent-cyan)"
      wireframeAccent="cyan"
      items={items}
      activeSubstep={activeSubstep}
      getItemOpacity={getItemOpacity}
      renderCard={(item, i) => (
        <TimelineCard
          highlighted={isFinalStep && i === items.length - 1}
          className={styles.card}
        >
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
        </TimelineCard>
      )}
    />
  )
}

export const notes = `Four interfaces, four eras. CLI in '71 and GUI in '73 are both human-facing — keyboard or mouse, but a person is on the other end. APIs in 2000 changed the audience: now it's another computer. MCP in 2024 changes it again: now it's an agent. The rest of this talk is about that last shift — why agents need a different kind of interface than computers do.`
