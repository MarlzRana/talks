import type { SlideModule } from '@/types'
import * as TitleSlide from './slides/title'
import * as HistorySlide from './slides/history'
import * as WhatIsAModelSlide from './slides/what-is-a-model'
import * as ReactLoopSlide from './slides/react-loop'
import * as ReactLoopExampleSlide from './slides/react-loop-example'
import * as ContextLimitSlide from './slides/context-limit'
import * as ContextRotCompactionSlide from './slides/context-rot-compaction'
import * as JitContextSlide from './slides/jit-context'
import * as SkillsUnderHoodSlide from './slides/skills-under-hood'
import * as RulesUnderHoodSlide from './slides/rules-under-hood'
import * as WithoutPtcSlide from './slides/without-ptc'
import * as WithPtcSlide from './slides/with-ptc'
import * as InterfaceHistorySlide from './slides/interface-history'
import * as McpLifecycleSlide from './slides/mcp-lifecycle'
import * as ApiNotAgentFriendlySlide from './slides/api-not-agent-friendly'
import * as DesignForAgentStoriesSlide from './slides/design-for-agent-stories'
import * as McpCapabilitiesSlide from './slides/mcp-capabilities'
import * as LongTermMemorySlide from './slides/long-term-memory'
import * as MemoryConsolidationSlide from './slides/memory-consolidation'

export const slides: SlideModule[] = [
  TitleSlide,
  HistorySlide,
  WhatIsAModelSlide,
  ReactLoopSlide,
  ReactLoopExampleSlide,
  ContextLimitSlide,
  ContextRotCompactionSlide,
  JitContextSlide,
  SkillsUnderHoodSlide,
  RulesUnderHoodSlide,
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
