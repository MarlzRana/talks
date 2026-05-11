import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { codeToHtml } from 'shiki'
import styles from './skill-block.module.css'

interface SkillBlockProps {
  skillName: string
  content?: string
  visible?: boolean
  explainer?: string
}

function HighlightedCode({ code }: { code: string }) {
  const [html, setHtml] = useState('')
  useEffect(() => {
    let mounted = true
    codeToHtml(code, { lang: 'markdown', theme: 'github-dark' }).then((result) => {
      if (mounted) setHtml(result)
    })
    return () => { mounted = false }
  }, [code])

  if (!html) return <pre className={styles.contentFallback}>{code}</pre>
  return <div className={styles.highlightedContent} dangerouslySetInnerHTML={{ __html: html }} />
}

export function SkillBlock({ skillName, content, visible = true, explainer }: SkillBlockProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.skillBlock}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.35 }}
        >
          {explainer && <span className={styles.explainer}>{explainer}</span>}
          <span className={styles.label}>Skill</span>
          <span className={styles.skillName}>{skillName}</span>
          {content && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <HighlightedCode code={content} />
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
