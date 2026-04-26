import { useState, useEffect, useRef, useCallback } from 'react'
import type { SlideModule } from '@/types'
import DeckPlayer from './DeckPlayer'
import styles from './PresenterView.module.css'

interface PresenterViewProps {
  slides: SlideModule[]
  currentIndex: number
  direction: number
  onNext: () => void
  onPrev: () => void
  defaultPaper?: string
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

function usePreviewScale() {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.2)

  const measure = useCallback(() => {
    if (ref.current) {
      setScale(ref.current.offsetWidth / window.innerWidth)
    }
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  return { ref, scale }
}

export default function PresenterView({ slides, currentIndex, direction, onNext, onPrev, defaultPaper }: PresenterViewProps) {
  const clock = useClock()
  const elapsed = useElapsed()
  const { ref: previewRef, scale: previewScale } = usePreviewScale()
  const currentSlide = slides[currentIndex]
  const nextSlide = slides[currentIndex + 1]
  const NextComponent = nextSlide?.default

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <DeckPlayer slides={slides} currentIndex={currentIndex} direction={direction} onNext={onNext} onPrev={onPrev} defaultPaper={defaultPaper} />
      </div>
      <div className={styles.sidebar}>
        <div className={styles.sidebarLabel}>Next slide</div>
        <div className={styles.nextPreview} ref={previewRef}>
          {NextComponent ? (
            nextSlide?.fullbleed ? (
              <div className={styles.nextPreviewDirect} data-paper={nextSlide?.paper ?? defaultPaper}>
                <NextComponent />
              </div>
            ) : (
              <div
                className={styles.nextPreviewInner}
                data-paper={nextSlide?.paper ?? defaultPaper}
                style={{ width: '100vw', height: '100vh', zoom: previewScale }}
              >
                <div className={`${styles.previewFrame} ${(nextSlide?.paper ?? defaultPaper) ? styles.previewFrameWireframe : ''}`}>
                  <NextComponent />
                </div>
              </div>
            )
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
