import type { SlideModule } from '@/types'
import * as TitleSlide from './slides/01-title'
import * as HistorySlide from './slides/02-history'
import * as ContextLimitSlide from './slides/03-context-limit'
import * as ContextRotCompactionSlide from './slides/04-context-rot-compaction'
import * as JitContextSlide from './slides/05-jit-context'
import * as WithoutPtcSlide from './slides/06-without-ptc'
import * as WithPtcSlide from './slides/07-with-ptc'
import * as LongTermMemorySlide from './slides/08-long-term-memory'
import * as MemoryConsolidationSlide from './slides/09-memory-consolidation'

export const slides: SlideModule[] = [
  TitleSlide,
  HistorySlide,
  ContextLimitSlide,
  ContextRotCompactionSlide,
  JitContextSlide,
  WithoutPtcSlide,
  WithPtcSlide,
  LongTermMemorySlide,
  MemoryConsolidationSlide,
]
