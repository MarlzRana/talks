import { useState, useEffect } from 'react'
import { codeToHtml } from 'shiki'
import styles from './CodeSlide.module.css'

interface CodeSlideProps {
  title?: string
  description?: string
  language: string
  code: string
  filename?: string
  theme?: string
}

export default function CodeSlide({ title, description, language, code, filename, theme = 'github-dark' }: CodeSlideProps) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    let mounted = true
    codeToHtml(code, { lang: language, theme }).then((result) => {
      if (mounted) setHtml(result)
    })
    return () => {
      mounted = false
    }
  }, [code, language, theme])

  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {description && <p className={styles.description}>{description}</p>}
      {html ? (
        <div className={styles.codeWrapper}>
          {filename && <div className={styles.filename}>{filename}</div>}
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      ) : (
        <div className={styles.loading}>Loading…</div>
      )}
    </div>
  )
}
