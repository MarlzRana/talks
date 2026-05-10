import type { SlideModule } from '@/types'
import * as TitleSlide from './slides/01-title'
import * as HistorySlide from './slides/02-history'
import * as WithoutPtcSlide from './slides/03-without-ptc'
import * as WithPtcSlide from './slides/04-with-ptc'
import * as InterfaceHistorySlide from './slides/05-interface-history'
import * as LongTermMemorySlide from './slides/06-long-term-memory'
import * as MemoryConsolidationSlide from './slides/07-memory-consolidation'

export const slides: SlideModule[] = [
  TitleSlide,
  HistorySlide,
  WithoutPtcSlide,
  WithPtcSlide,
  InterfaceHistorySlide,
  LongTermMemorySlide,
  MemoryConsolidationSlide,
]
