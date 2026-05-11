import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { codeToHtml } from 'shiki'
import styles from './read-block.module.css'

interface SystemReminderInfo {
  label: string  // e.g. "java-test.md injected (glob match: **/*Test.java)"
  content: string // full content shown on expand
}

interface ReadBlockProps {
  filename: string
  content?: string
  language?: string
  visible?: boolean
  explainer?: string
  systemReminder?: SystemReminderInfo
  showSystemReminder?: boolean
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

export function ReadBlock({ filename, content, language = 'markdown', visible = true, explainer, systemReminder, showSystemReminder = false }: ReadBlockProps) {
  const [reminderExpanded, setReminderExpanded] = useState(false)

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

          {/* System reminder injected as secondary result */}
          <AnimatePresence>
            {systemReminder && showSystemReminder && (
              <motion.div
                className={styles.systemReminder}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <div className={styles.reminderDivider} />
                <div
                  className={styles.reminderHeader}
                  onClick={() => setReminderExpanded(!reminderExpanded)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setReminderExpanded(!reminderExpanded) } }}
                >
                  <span className={styles.reminderTag}>&lt;system-reminder&gt;</span>
                  <span className={styles.reminderLabel}>{systemReminder.label}</span>
                  <span className={styles.reminderToggle}>{reminderExpanded ? '▼' : '▶'}</span>
                </div>
                {reminderExpanded && (
                  <motion.pre
                    className={styles.reminderContent}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {systemReminder.content}
                  </motion.pre>
                )}
                <span className={styles.reminderTag}>&lt;/system-reminder&gt;</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
