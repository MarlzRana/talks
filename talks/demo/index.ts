import type { TalkConfig } from '@/types'
import { slides } from './slides'

const demo: TalkConfig = {
  slug: 'demo',
  title: 'Capability Demo',
  description:
    'A showcase of every feature in the presentation system — layouts, code highlighting, math, interactivity, D3 charts, 3D scenes, and scrollytelling.',
  author: 'Marlz Rana',
  date: '2026-04-14',
  tags: ['demo', 'showcase'],
  theme: 'dark',
  slides,
}

export default demo
