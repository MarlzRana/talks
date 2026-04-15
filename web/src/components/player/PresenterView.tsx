import { useState, useEffect } from 'react'
import type { SlideModule } from '@/types'
import DeckPlayer from './DeckPlayer'
import styles from './PresenterView.module.css'

interface PresenterViewProps {
  slides: SlideModule[]
  currentIndex: number
  direction: number
  onNext: () => void
  onPrev: () => void
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function useElapsed() {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return formatTime(elapsed)
}

export default function PresenterView({ slides, currentIndex, direction, onNext, onPrev }: PresenterViewProps) {
  const clock = useClock()
  const elapsed = useElapsed()
  const currentSlide = slides[currentIndex]
  const nextSlide = slides[currentIndex + 1]
  const NextComponent = nextSlide?.default

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <DeckPlayer slides={slides} currentIndex={currentIndex} direction={direction} onNext={onNext} onPrev={onPrev} />
      </div>
      <div className={styles.sidebar}>
        <div className={styles.sidebarLabel}>Next slide</div>
        <div className={styles.nextPreview}>
          {NextComponent ? (
            <div className={styles.nextPreviewInner}>
              <NextComponent />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
              End of deck
            </div>
          )}
        </div>
        <div className={styles.sidebarLabel}>Speaker notes</div>
        <div className={styles.notes}>
          {currentSlide?.notes || 'No notes for this slide.'}
        </div>
        <div className={styles.meta}>
          <span className={styles.slideCount}>
            {currentIndex + 1} / {slides.length}
          </span>
          <span>{elapsed}</span>
          <span>{clock}</span>
        </div>
      </div>
    </div>
  )
}
