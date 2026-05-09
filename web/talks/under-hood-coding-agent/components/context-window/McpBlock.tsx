import { motion, AnimatePresence } from 'motion/react'
import styles from './mcp-block.module.css'

interface McpBlockProps {
  command?: string
  visible?: boolean
  response?: string | React.ReactNode
  explainer?: string
}

export function McpBlock({ command, visible = true, response, explainer }: McpBlockProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.mcpBlock}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35 }}
        >
          {explainer && <span className={styles.mcpExplainer}>{explainer}</span>}
          <span className={styles.mcpLabel}>MCP</span>
          {command && <span className={styles.mcpCommand}>{command}</span>}
          <AnimatePresence>
            {response && (
              <motion.div
                className={styles.mcpResponseWrapper}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className={styles.mcpDivider} />
                {typeof response === 'string' ? (
                  <span className={styles.mcpResponse}>{response}</span>
                ) : (
                  response
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
