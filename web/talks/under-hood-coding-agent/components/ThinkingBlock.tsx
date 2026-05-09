import { motion } from 'motion/react'
import { styles } from './AgentFlowLayout'

interface ThinkingBlockProps {
  visible?: boolean
  children: React.ReactNode
}

export function ThinkingBlock({ visible = true, children }: ThinkingBlockProps) {
  if (!visible) return null
  return (
    <motion.div
      className={styles.thinkingText}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.35 }}
    >
      {children}
    </motion.div>
  )
}
