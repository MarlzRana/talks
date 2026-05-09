import { motion, AnimatePresence } from 'motion/react'
import styles from './model-block.module.css'

interface ModelBlockProps {
  children: React.ReactNode
  visible?: boolean
  label?: string
}

export function ModelBlock({ children, visible = true, label = 'Model' }: ModelBlockProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.modelBlock}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35 }}
        >
          <span className={styles.modelLabel}>{label}</span>
          <span className={styles.modelText}>{children}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
