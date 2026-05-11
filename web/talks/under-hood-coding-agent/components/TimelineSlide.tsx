import { useRef, useEffect, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Wireframe } from '@/components/paper'
import type { AccentColor } from '@/types'
import styles from './TimelineSlide.module.css'

export interface TimelineItemBase {
  position: number
  row: 'top' | 'bottom'
}

interface TimelineSlideProps<T extends TimelineItemBase> {
  title: string
  accent: string // CSS value e.g. 'var(--accent-ochre)'
  wireframeAccent?: AccentColor
  items: T[]
  activeSubstep: number
  renderCard: (item: T, index: number) => ReactNode
  getItemOpacity: (index: number, activeSubstep: number) => number
  /** Minimum opacity at which the connector is shown. Default 0 (any visible item shows connector). */
  connectorThreshold?: number
}

function getPosition(items: TimelineItemBase[], substep: number): number {
  if (substep <= 0 || items.length === 0) return 0
  if (substep > items.length) {
    const last = items[items.length - 1]
    return last ? last.position : 0
  }
  const item = items[substep - 1]
  return item ? item.position : 0
}

export function TimelineSlide<T extends TimelineItemBase>({
  title,
  accent,
  wireframeAccent,
  items,
  activeSubstep,
  renderCard,
  getItemOpacity,
  connectorThreshold = 0,
}: TimelineSlideProps<T>) {
  const prevSubstepRef = useRef(activeSubstep)
  const [pulse, setPulse] = useState<{ from: number; to: number; key: number } | null>(null)
  const pulseKeyRef = useRef(0)

  useEffect(() => {
    if (activeSubstep !== prevSubstepRef.current) {
      const prev = prevSubstepRef.current
      const fromPos = getPosition(items, prev)
      const toPos = getPosition(items, activeSubstep)
      // Only pulse when positions differ (i.e. an actual item transition)
      if (fromPos !== toPos) {
        pulseKeyRef.current += 1
        setPulse({ from: fromPos, to: toPos, key: pulseKeyRef.current })
      }
      prevSubstepRef.current = activeSubstep
    }
  }, [activeSubstep, items])

  return (
    <Wireframe className={styles.outer} accent={wireframeAccent}>
      <div
        className={styles.container}
        style={{ '--timeline-accent': accent } as React.CSSProperties}
      >
        {/* Title box with extending rails */}
        <div className={styles.titleBox}>
          <span className={styles.mark} data-pos="tl" />
          <span className={styles.mark} data-pos="tr" />
          <span className={styles.mark} data-pos="bl" />
          <span className={styles.mark} data-pos="br" />
          <span className={styles.titleText}>{title}</span>
        </div>

        {/* Timeline line */}
        <div className={styles.timelineLine} />

        {/* Timeline pulse */}
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
          const opacity = getItemOpacity(i, activeSubstep)
          const connectorVisible = opacity > connectorThreshold

          return (
            <motion.div
              key={i}
              className={`${styles.item} ${item.row === 'top' ? styles.itemTop : styles.itemBottom}`}
              style={{ left: `${item.position}%` }}
              animate={{ opacity }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              {item.row === 'top' ? (
                <>
                  {renderCard(item, i)}
                  <motion.div
                    className={`${styles.connector} ${styles.connectorDown}`}
                    animate={{ scaleY: connectorVisible ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    style={{ transformOrigin: 'top' }}
                  />
                </>
              ) : (
                <>
                  <motion.div
                    className={`${styles.connector} ${styles.connectorUp}`}
                    animate={{ scaleY: connectorVisible ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    style={{ transformOrigin: 'bottom' }}
                  />
                  {renderCard(item, i)}
                </>
              )}
            </motion.div>
          )
        })}
      </div>
    </Wireframe>
  )
}
