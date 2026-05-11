import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import styles from './xml-block.module.css'

interface XmlBlockProps {
  tag: string
  children: React.ReactNode
  expandedContent?: string
  visible?: boolean
  accent?: 'crimson' | 'forest' | 'violet' | 'cyan'
}

export function XmlBlock({ tag, children, expandedContent, visible = true, accent = 'crimson' }: XmlBlockProps) {
  const [expanded, setExpanded] = useState(false)
  const isExpandable = !!expandedContent

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`${styles.xmlBlock} ${styles[accent]}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35 }}
        >
          <span
            className={styles.xmlTag}
            onClick={isExpandable ? () => setExpanded(!expanded) : undefined}
            onKeyDown={isExpandable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(!expanded) } } : undefined}
            role={isExpandable ? 'button' : undefined}
            tabIndex={isExpandable ? 0 : undefined}
            aria-expanded={isExpandable ? expanded : undefined}
            style={{ cursor: isExpandable ? 'pointer' : 'default' }}
          >
            &lt;{tag}&gt;
          </span>
          {expanded && expandedContent ? (
            <pre className={styles.xmlExpandedContent}>{expandedContent}</pre>
          ) : (
            <span className={styles.xmlPreview}>{children}</span>
          )}
          <span className={styles.xmlTag}>&lt;/{tag}&gt;</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
