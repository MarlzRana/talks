import { motion, AnimatePresence } from 'motion/react'
import styles from './thinking-block-context.module.css'

interface ThinkingBlockContextProps {
  children: React.ReactNode
  visible?: boolean
  delay?: number
  label?: string | null
}

export function ThinkingBlockContext({ children, visible = true, delay = 0, label = 'Thinking' }: ThinkingBlockContextProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.thinkingBlock}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ delay, duration: 0.35 }}
        >
          {label && <span className={styles.thinkingLabel}>{label}</span>}
          <span className={styles.thinkingText}>{children}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
