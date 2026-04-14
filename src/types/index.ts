import type { TargetAndTransition, Easing } from 'motion/react'

export type Theme = 'light' | 'dark'

export type SlideComponent = React.ComponentType

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
}

export interface TalkConfig {
  slug: string
  title: string
  description: string
  author?: string
  date?: string
  tags?: string[]
  theme?: Theme
  slides: SlideModule[]
  coverImage?: string
}
