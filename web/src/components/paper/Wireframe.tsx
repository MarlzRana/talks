import type { ReactNode } from 'react'
import type { AccentColor } from '@/types'
import styles from './Wireframe.module.css'

interface WireframeProps {
  label?: string
  accent?: AccentColor
  className?: string
  children: ReactNode
}

export default function Wireframe({ label, accent, className, children }: WireframeProps) {
  return (
    <div className={`${styles.wireframe} ${className ?? ''}`} data-accent={accent}>
      <span className={styles.mark} data-pos="tl" />
      <span className={styles.mark} data-pos="tr" />
      <span className={styles.mark} data-pos="bl" />
      <span className={styles.mark} data-pos="br" />
      {label && <span className={styles.label}>{label}</span>}
      {children}
    </div>
  )
}
