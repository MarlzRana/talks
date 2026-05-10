import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import styles from './TimelineCard.module.css'

interface TimelineCardProps {
  highlighted?: boolean
  className?: string
  children: ReactNode
}

export function TimelineCard({ highlighted, className, children }: TimelineCardProps) {
  return (
    <motion.div
      className={`${styles.card} ${highlighted ? styles.cardHighlighted : ''} ${className ?? ''}`}
      animate={highlighted ? { borderColor: 'var(--timeline-accent)' } : {}}
      transition={{ duration: 0.5 }}
    >
      <span className={styles.mark} data-pos="tl" />
      <span className={styles.mark} data-pos="tr" />
      <span className={styles.mark} data-pos="bl" />
      <span className={styles.mark} data-pos="br" />
      {children}
    </motion.div>
  )
}
