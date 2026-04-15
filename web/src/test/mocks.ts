import type { SlideModule, TalkConfig } from '@/types'

// --- BroadcastChannel mock ---

type MessageHandler = ((event: MessageEvent) => void) | null

const channels: MockBroadcastChannel[] = []

export class MockBroadcastChannel {
  name: string
  onmessage: MessageHandler = null
  closed = false

  constructor(name: string) {
    this.name = name
    channels.push(this)
  }

  postMessage(data: unknown) {
    if (this.closed) return
    // Deliver to all OTHER channels with the same name (same as real BroadcastChannel)
    for (const ch of channels) {
      if (ch !== this && ch.name === this.name && !ch.closed && ch.onmessage) {
        ch.onmessage(new MessageEvent('message', { data }))
      }
    }
  }

  close() {
    this.closed = true
    const idx = channels.indexOf(this)
    if (idx !== -1) channels.splice(idx, 1)
  }

  static reset() {
    channels.length = 0
  }

  static getChannels() {
    return channels
  }
}

// --- SlideModule factory ---

export function createSlideModule(overrides?: Partial<SlideModule>): SlideModule {
  return {
    default: () => null,
    ...overrides,
  }
}

export function createSlideModuleWithContent(text: string): SlideModule {
  return {
    default: function TestSlide() {
      return text as unknown as React.JSX.Element
    },
  }
}

// --- TalkConfig factory ---

export function createTalkConfig(overrides?: Partial<TalkConfig>): TalkConfig {
  return {
    slug: 'test-talk',
    title: 'Test Talk',
    description: 'A test talk',
    slides: [createSlideModule(), createSlideModule(), createSlideModule()],
    ...overrides,
  }
}
