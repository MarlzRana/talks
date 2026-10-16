import type { TargetAndTransition, Easing } from 'motion/react'

export type Theme = 'light' | 'dark'

export type PaperVariant = 'paper' | 'paper-dark' | 'paper-blueprint' | 'brand'

export type AccentColor = 'violet' | 'ochre' | 'forest' | 'ink-blue' | 'cyan' | 'crimson' | 'rust' | 'brand'

export interface TalkPalette {
  /** Slide background color (used when paper is 'brand') */
  paper?: string
  /** Primary text color */
  ink?: string
  /** Secondary / muted text color */
  inkMuted?: string
  /** Primary accent color (wireframe borders, highlights) */
  accent?: string
}

export type SlideComponent = React.ComponentType<{ activeSubstep?: number }>

export interface SlideTransition {
  enter: TargetAndTransition
  center: TargetAndTransition
  exit: TargetAndTransition
  config?: { duration?: number; ease?: Easing }
}

export interface SlideModule {
  default: SlideComponent
  transition?: SlideTransition
  notes?: string
  paper?: PaperVariant | string
  fullbleed?: boolean
  substeps?: number
}

export interface TalkConfig {
  slug: string
  title: string
  description: string
  author?: string
  date?: string
  tags?: string[]
  theme?: Theme
  paper?: PaperVariant | string
  palette?: TalkPalette
  slides: SlideModule[]
  coverImage?: string
}
