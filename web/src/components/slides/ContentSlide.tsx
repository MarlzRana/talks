import type { ReactNode } from 'react'
import { Wireframe } from '@/components/paper'
import styles from './ContentSlide.module.css'

interface ContentSlideProps {
  title: string
  children: ReactNode
}

export default function ContentSlide({ title, children }: ContentSlideProps) {
  return (
    <div className={styles.slide}>
      <Wireframe className={styles.titleZone}>
        <h2 className={styles.title}>{title}</h2>
      </Wireframe>
      <Wireframe className={styles.bodyZone}>
        <div className={styles.body}>{children}</div>
      </Wireframe>
    </div>
  )
}
