import { useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { talks } from '@/lib/talks'
import { useDeck } from '@/lib/useDeck'
import { useKeyNav } from '@/lib/useKeyNav'
import { useFullscreen } from '@/lib/useFullscreen'
import { usePresenter } from '@/lib/usePresenter'
import { useBroadcast } from '@/lib/useBroadcast'
import DeckPlayer from '@/components/player/DeckPlayer'
import SlideProgress from '@/components/player/SlideProgress'
import SlideControls from '@/components/player/SlideControls'
import PresenterView from '@/components/player/PresenterView'
import styles from './TalkPlayer.module.css'

export default function TalkPlayer() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const talk = talks.find((t) => t.slug === slug)

  const { index, direction, next, prev, goTo } = useDeck(slug ?? '', talk?.slides.length ?? 0)
  const { toggle: toggleFullscreen } = useFullscreen()
  const { isPresenter, togglePresenter } = usePresenter()

  const { send } = useBroadcast(slug ?? '', goTo)

  // Broadcast every slide change to all other tabs
  useEffect(() => {
    send(index)
  }, [index, send])

  useKeyNav({
    next,
    prev,
    escape: () => navigate('/talks'),
    toggleFullscreen,
    togglePresenter,
  })

  if (!talk) return <Navigate to="/talks" replace />

  if (isPresenter) {
    return (
      <div className={styles.container} data-theme={talk.theme ?? 'dark'}>
        <PresenterView
          slides={talk.slides}
          currentIndex={index}
          direction={direction}
          onNext={next}
          onPrev={prev}
        />
      </div>
    )
  }

  return (
    <div className={styles.container} data-theme={talk.theme ?? 'dark'}>
      <DeckPlayer slides={talk.slides} currentIndex={index} direction={direction} onNext={next} onPrev={prev} />
      <SlideProgress current={index} total={talk.slides.length} />
      <SlideControls onPrev={prev} onNext={next} />
    </div>
  )
}
