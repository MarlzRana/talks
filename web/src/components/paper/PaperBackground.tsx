import type { ReactNode } from 'react'
import type { PaperVariant } from '@/types'
import styles from './PaperBackground.module.css'

interface PaperBackgroundProps {
  paper?: PaperVariant | string
  className?: string
  children: ReactNode
}

export default function PaperBackground({ paper = 'paper', className, children }: PaperBackgroundProps) {
  return (
    <div className={`${styles.paper} ${className ?? ''}`} data-paper={paper}>
      {children}
    </div>
  )
}
