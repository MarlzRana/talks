import type { TalkConfig } from '@/types'
import { slides } from './slides'

const underHoodCodingAgent: TalkConfig = {
  slug: 'under-hood-coding-agent',
  title: 'Under the Hood of a Coding Agent',
  description:
    'A deep dive into the internals of coding agents — how they work, think, and write code.',
  author: 'Marlz Rana',
  date: '2026-04-26',
  tags: ['ai', 'agents', 'coding'],
  theme: 'dark',
  paper: 'paper-dark',
  slides,
}

export default underHoodCodingAgent
