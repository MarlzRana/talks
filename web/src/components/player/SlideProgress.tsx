import styles from './SlideProgress.module.css'

interface SlideProgressProps {
  current: number
  total: number
  paper?: string
}

export default function SlideProgress({ current, total, paper }: SlideProgressProps) {
  return (
    <div className={styles.container} data-paper={paper}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`${styles.dot}${i === current ? ` ${styles.active}` : ''}`}
        />
      ))}
    </div>
  )
}
