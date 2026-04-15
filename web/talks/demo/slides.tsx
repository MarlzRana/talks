import type { SlideModule } from '@/types'
import * as TitleSlide from './slides/01-title'
import * as ContentSlide from './slides/02-content'
import * as SplitSlide from './slides/03-split'
import * as CodeSlide from './slides/04-code'
import * as MathSlide from './slides/05-math'
import * as InteractiveSlide from './slides/06-interactive'
import * as ChartSlide from './slides/07-d3-chart'
import * as DiagramSlide from './slides/08-svg-diagram'
import * as Scene3DSlide from './slides/09-3d-scene'
import * as ScrollySlide from './slides/10-scrolly'
import * as FullscreenSlide from './slides/11-fullscreen'
import * as CustomTransitionSlide from './slides/12-custom-transition'

export const slides: SlideModule[] = [
  TitleSlide,
  ContentSlide,
  SplitSlide,
  CodeSlide,
  MathSlide,
  InteractiveSlide,
  ChartSlide,
  DiagramSlide,
  Scene3DSlide,
  ScrollySlide,
  FullscreenSlide,
  CustomTransitionSlide,
]
