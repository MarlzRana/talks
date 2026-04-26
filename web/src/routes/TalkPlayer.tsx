import { useCallback, useEffect } from 'react'
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

  const { index, direction, next, prev, goTo, substep, nextSubstep, prevSubstep } = useDeck(slug ?? '', talk?.slides ?? [])
  const { toggle: toggleFullscreen } = useFullscreen()
  const { isPresenter, togglePresenter } = usePresenter()

  const onSync = useCallback((i: number, sub: number) => goTo(i, sub), [goTo])
  const { send } = useBroadcast(slug ?? '', onSync)

  // Broadcast every slide/substep change to all other tabs
  useEffect(() => {
    send(index, substep)
  }, [index, substep, send])

  useKeyNav({
    next,
    prev,
    nextSubstep,
    prevSubstep,
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
          activeSubstep={substep}
          onNext={next}
          onPrev={prev}
          defaultPaper={talk.paper}
        />
      </div>
    )
  }

  return (
    <div className={styles.container} data-theme={talk.theme ?? 'dark'}>
      <DeckPlayer slides={talk.slides} currentIndex={index} direction={direction} activeSubstep={substep} onNext={next} onPrev={prev} defaultPaper={talk.paper} />
      <SlideProgress current={index} total={talk.slides.length} paper={talk.slides[index]?.paper ?? talk.paper} />
      <SlideControls onPrev={prev} onNext={next} />
    </div>
  )
}
