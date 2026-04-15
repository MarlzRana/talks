import { AnimatePresence, motion } from 'motion/react'
import type { SlideModule } from '@/types'
import { useSwipe } from '@/lib/useSwipe'
import styles from './DeckPlayer.module.css'

const defaultVariants = {
  enter: (dir: number) => ({ x: dir * 300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -300, opacity: 0 }),
}

const defaultTransition = { duration: 0.35, ease: 'easeInOut' as const }

interface DeckPlayerProps {
  slides: SlideModule[]
  currentIndex: number
  direction: number
  onNext?: () => void
  onPrev?: () => void
}

export default function DeckPlayer({ slides, currentIndex, direction, onNext, onPrev }: DeckPlayerProps) {
  const bind = useSwipe({ next: onNext ?? (() => {}), prev: onPrev ?? (() => {}) })
  const slide = slides[currentIndex]
  if (!slide) return null

  const SlideComponent = slide.default
  const custom = slide.transition ? undefined : direction

  return (
    <div className={styles.viewport} {...bind()} style={{ touchAction: 'pan-y' }}>
      <AnimatePresence initial={false} custom={custom} mode="wait">
        <motion.div
          key={currentIndex}
          className={styles.slide}
          custom={custom}
          variants={slide.transition ? undefined : defaultVariants}
          initial={slide.transition ? slide.transition.enter : 'enter'}
          animate={slide.transition ? slide.transition.center : 'center'}
          exit={slide.transition ? slide.transition.exit : 'exit'}
          transition={
            slide.transition?.config
              ? { duration: slide.transition.config.duration ?? 0.35, ease: slide.transition.config.ease ?? 'easeInOut' }
              : defaultTransition
          }
        >
          <SlideComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
