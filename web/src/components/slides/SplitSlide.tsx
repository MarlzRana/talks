import type { ReactNode } from 'react'
import { Wireframe } from '@/components/paper'
import styles from './SplitSlide.module.css'

type Ratio = '40/60' | '50/50' | '60/40'

interface SplitSlideProps {
  title?: string
  ratio?: Ratio
  children: ReactNode
}

function Text({ children }: { children: ReactNode }) {
  return <div className={styles.text}>{children}</div>
}

function Visual({ children }: { children: ReactNode }) {
  return <div className={styles.visual}>{children}</div>
}

function SplitSlideBase({ title, ratio = '50/50', children }: SplitSlideProps) {
  return (
    <div className={styles.slide}>
      {title && (
        <Wireframe className={styles.titleZone}>
          <h2 className={styles.title}>{title}</h2>
        </Wireframe>
      )}
      <Wireframe className={title ? styles.columnsZone : styles.columnsZoneFull}>
        <div className={styles.columns} data-ratio={ratio}>
          {children}
        </div>
      </Wireframe>
    </div>
  )
}

const SplitSlide = Object.assign(SplitSlideBase, { Text, Visual })
export default SplitSlide
