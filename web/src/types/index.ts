import type { TargetAndTransition, Easing } from 'motion/react'

export type Theme = 'light' | 'dark'

export type PaperVariant = 'paper' | 'paper-dark' | 'paper-blueprint'

export type AccentColor = 'violet' | 'ochre' | 'forest' | 'ink-blue' | 'crimson' | 'rust'

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
  slides: SlideModule[]
  coverImage?: string
}
