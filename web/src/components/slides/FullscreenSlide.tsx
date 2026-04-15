import type { ReactNode } from 'react'
import styles from './FullscreenSlide.module.css'

interface FullscreenSlideProps {
  caption?: string
  children: ReactNode
}

export default function FullscreenSlide({ caption, children }: FullscreenSlideProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
      {caption && <div className={styles.caption}>{caption}</div>}
    </div>
  )
}
