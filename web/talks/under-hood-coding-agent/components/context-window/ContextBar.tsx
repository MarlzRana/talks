import { motion } from 'motion/react'
import { styles } from '../AgentFlowLayout'

interface ContextBarProps {
  fill: string
  active?: boolean
  accent?: string
}

export function ContextBar({ fill, active = false, accent }: ContextBarProps) {
  const color = accent ?? 'var(--slide-accent, var(--ink-4))'
  return (
    <div className={styles.contextBarContainer}>
      <span className={styles.contextBarLabel}>CONTEXT USAGE</span>
      <div className={styles.contextBar}>
        <motion.div
          className={styles.contextBarFill}
          initial={false}
          animate={{ width: fill }}
          style={{ backgroundColor: active ? color : 'var(--ink-4)' }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}
