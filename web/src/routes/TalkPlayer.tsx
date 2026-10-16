import { useCallback, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { talks } from '@/lib/talks'
import type { TalkConfig } from '@/types'
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

function buildPaletteVars(palette?: TalkConfig['palette']): CSSProperties {
  if (!palette) return {}
  const vars: Record<string, string> = {}
  if (palette.paper) vars['--talk-paper'] = palette.paper
  if (palette.ink) vars['--talk-ink'] = palette.ink
  if (palette.inkMuted) vars['--talk-ink-muted'] = palette.inkMuted
  if (palette.accent) vars['--talk-accent'] = palette.accent
  return vars as CSSProperties
}

export default function TalkPlayer() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const talk = talks.find((t) => t.slug === slug)

  const { index, direction, substep, advance, retreat, skipForward, skipBack, goTo } = useDeck(slug ?? '', talk?.slides ?? [])
  const { toggle: toggleFullscreen } = useFullscreen()
  const { isPresenter, togglePresenter } = usePresenter()

  const onSync = useCallback((i: number, sub: number) => goTo(i, sub), [goTo])
  const { send } = useBroadcast(slug ?? '', onSync)

  // Broadcast every slide/substep change to all other tabs
  useEffect(() => {
    send(index, substep)
  }, [index, substep, send])

  useKeyNav({
    advance,
    retreat,
    skipForward,
    skipBack,
    escape: () => navigate('/talks'),
    toggleFullscreen,
    togglePresenter,
  })

  if (!talk) return <Navigate to="/talks" replace />

  const paletteVars = buildPaletteVars(talk.palette)

  if (isPresenter) {
    return (
      <div className={styles.container} data-theme={talk.theme ?? 'dark'} style={paletteVars}>
        <PresenterView
          slides={talk.slides}
          currentIndex={index}
          direction={direction}
          activeSubstep={substep}
          onNext={advance}
          onPrev={retreat}
          defaultPaper={talk.paper}
        />
      </div>
    )
  }

  return (
    <div className={styles.container} data-theme={talk.theme ?? 'dark'} style={paletteVars}>
      <DeckPlayer slides={talk.slides} currentIndex={index} direction={direction} activeSubstep={substep} onNext={advance} onPrev={retreat} defaultPaper={talk.paper} />
      <SlideProgress current={index} total={talk.slides.length} paper={talk.slides[index]?.paper ?? talk.paper} />
      <SlideControls onPrev={retreat} onNext={advance} />
    </div>
  )
}
