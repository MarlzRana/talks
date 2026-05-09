import { motion } from 'motion/react'
import { styles } from './AgentFlowLayout'

interface ContextEntryProps {
  role: string
  visible?: boolean
  delay?: number
  children: React.ReactNode
  variant?: 'default' | 'dim' | 'result'
}

export function ContextEntry({ role, visible = true, delay = 0, children, variant = 'default' }: ContextEntryProps) {
  const textClass = variant === 'dim' ? styles.contextDimText : variant === 'result' ? styles.contextResultText : styles.contextText
  return (
    <motion.div
      className={styles.contextEntry}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
      transition={{ delay, duration: 0.35 }}
    >
      <span className={styles.contextRole}>{role}</span>
      <span className={textClass}>{children}</span>
    </motion.div>
  )
}
