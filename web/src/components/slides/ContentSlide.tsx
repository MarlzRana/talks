import type { ReactNode } from 'react'
import styles from './ContentSlide.module.css'

interface ContentSlideProps {
  title: string
  children: ReactNode
}

export default function ContentSlide({ title, children }: ContentSlideProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.body}>{children}</div>
    </div>
  )
}
