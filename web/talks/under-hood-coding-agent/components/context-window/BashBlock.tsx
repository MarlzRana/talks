import { motion, AnimatePresence } from 'motion/react'
import styles from './bash-block.module.css'

interface BashBlockProps {
  command: string
  visible?: boolean
  response?: string | React.ReactNode
  responseVariant?: 'success' | 'fail'
}

export function BashBlock({ command, visible = true, response, responseVariant = 'success' }: BashBlockProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.bashBlock}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35 }}
        >
          <span className={styles.bashLabel}>Bash</span>
          <span className={styles.bashCommand}>{command}</span>
          {response && (
            <>
              <div className={styles.bashDivider} />
              {typeof response === 'string' ? (
                <span className={responseVariant === 'fail' ? styles.bashResponseFail : styles.bashResponseSuccess}>{response}</span>
              ) : (
                response
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
