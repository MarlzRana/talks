import type { SlideModule } from '@/types'
import * as TitleSlide from './slides/01-title'
import * as HistorySlide from './slides/02-history'
import * as WhatIsAModelSlide from './slides/03-what-is-a-model'
import * as WithoutPtcSlide from './slides/03-without-ptc'
import * as WithPtcSlide from './slides/04-with-ptc'
import * as InterfaceHistorySlide from './slides/05-interface-history'
import * as McpLifecycleSlide from './slides/06-mcp-lifecycle'
import * as ApiNotAgentFriendlySlide from './slides/07-api-not-agent-friendly'
import * as DesignForAgentStoriesSlide from './slides/08-design-for-agent-stories'
import * as McpCapabilitiesSlide from './slides/09-mcp-capabilities'
import * as LongTermMemorySlide from './slides/10-long-term-memory'
import * as MemoryConsolidationSlide from './slides/11-memory-consolidation'

export const slides: SlideModule[] = [
  TitleSlide,
  HistorySlide,
  WhatIsAModelSlide,
  WithoutPtcSlide,
  WithPtcSlide,
  InterfaceHistorySlide,
  McpLifecycleSlide,
  ApiNotAgentFriendlySlide,
  DesignForAgentStoriesSlide,
  McpCapabilitiesSlide,
  LongTermMemorySlide,
  MemoryConsolidationSlide,
]
