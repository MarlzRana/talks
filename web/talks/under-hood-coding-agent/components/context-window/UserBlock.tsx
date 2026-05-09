import { motion, AnimatePresence } from 'motion/react'
import styles from './user-block.module.css'

interface UserBlockProps {
  children: React.ReactNode
  visible?: boolean
}

export function UserBlock({ children, visible = true }: UserBlockProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.userBlock}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35 }}
        >
          <span className={styles.userLabel}>User</span>
          <span className={styles.userText}>{children}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
