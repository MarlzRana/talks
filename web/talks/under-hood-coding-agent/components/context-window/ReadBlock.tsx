import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { codeToHtml } from 'shiki'
import styles from './read-block.module.css'

interface ReadBlockProps {
  filename: string
  content?: string
  language?: string
  visible?: boolean
  explainer?: string
}

function HighlightedCode({ code, language = 'markdown' }: { code: string; language?: string }) {
  const [html, setHtml] = useState('')
  useEffect(() => {
    let mounted = true
    codeToHtml(code, { lang: language, theme: 'github-dark' }).then((result) => {
      if (mounted) setHtml(result)
    })
    return () => { mounted = false }
  }, [code, language])

  if (!html) return <pre className={styles.contentFallback}>{code}</pre>
  return <div className={styles.highlightedContent} dangerouslySetInnerHTML={{ __html: html }} />
}

export function ReadBlock({ filename, content, language = 'markdown', visible = true, explainer }: ReadBlockProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.readBlock}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35 }}
        >
          {explainer && <span className={styles.explainer}>{explainer}</span>}
          <span className={styles.label}>Read</span>
          <span className={styles.filename}>{filename}</span>
          {content && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <HighlightedCode code={content} language={language} />
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
