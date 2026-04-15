import styles from './SlideProgress.module.css'

interface SlideProgressProps {
  current: number
  total: number
}

export default function SlideProgress({ current, total }: SlideProgressProps) {
  return (
    <div className={styles.container}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`${styles.dot}${i === current ? ` ${styles.active}` : ''}`}
        />
      ))}
    </div>
  )
}
