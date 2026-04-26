import type { ReactNode } from 'react'
import { Wireframe } from '@/components/paper'
import styles from './FullscreenSlide.module.css'

interface FullscreenSlideProps {
  caption?: string
  children: ReactNode
}

export default function FullscreenSlide({ caption, children }: FullscreenSlideProps) {
  return (
    <div className={styles.slide}>
      <Wireframe className={caption ? styles.contentZone : styles.contentZoneFull}>
        <div className={styles.content}>{children}</div>
      </Wireframe>
      {caption && <div className={styles.caption}>{caption}</div>}
    </div>
  )
}
