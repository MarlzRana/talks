import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { codeToHtml } from 'shiki'
import styles from './write-block.module.css'

interface WriteBlockProps {
  filename?: string
  content?: string
  language?: string
  tooltip?: string
  visible?: boolean
  response?: string
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

  if (!html) return <pre className={styles.writeContentFallback}>{code}</pre>
  return <div className={styles.highlightedContent} dangerouslySetInnerHTML={{ __html: html }} />
}

export function WriteBlock({ filename, content, language = 'markdown', tooltip, visible = true, response, explainer }: WriteBlockProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.writeBlock}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35 }}
        >
          {explainer && <span className={styles.writeExplainer}>{explainer}</span>}
          <span className={styles.writeLabel}>Write</span>
          {filename && <span className={styles.writeFilename} data-tooltip={tooltip}>{filename}</span>}
          {content && <HighlightedCode code={content} language={language} />}
          <AnimatePresence>
            {response && (
              <motion.div
                className={styles.writeResponseWrapper}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className={styles.writeDivider} />
                <span className={styles.writeResponse}>{response}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
