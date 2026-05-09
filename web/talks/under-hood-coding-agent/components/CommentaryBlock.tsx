import { motion } from 'motion/react'
import { styles } from './AgentFlowLayout'

interface CommentaryBlockProps {
  visible?: boolean
  children: React.ReactNode
}

export function CommentaryBlock({ visible = true, children }: CommentaryBlockProps) {
  if (!visible) return null
  return (
    <motion.div
      className={styles.commentaryBlock}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.35 }}
    >
      {children}
    </motion.div>
  )
}
