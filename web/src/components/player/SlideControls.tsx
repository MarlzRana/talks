import styles from './SlideControls.module.css'

interface SlideControlsProps {
  onPrev: () => void
  onNext: () => void
}

export default function SlideControls({ onPrev, onNext }: SlideControlsProps) {
  return (
    <div className={styles.container}>
      <button className={`${styles.button} ${styles.prev}`} onClick={onPrev} aria-label="Previous slide">
        &#8249;
      </button>
      <button className={`${styles.button} ${styles.next}`} onClick={onNext} aria-label="Next slide">
        &#8250;
      </button>
    </div>
  )
}
