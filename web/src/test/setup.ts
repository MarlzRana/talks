import '@testing-library/jest-dom/vitest'
import { vi, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { MockBroadcastChannel } from './mocks'

// Clean up after each test
beforeEach(() => {
  cleanup()
  localStorage.clear()
  vi.restoreAllMocks()
  MockBroadcastChannel.reset()
})

// BroadcastChannel is not available in jsdom
vi.stubGlobal('BroadcastChannel', MockBroadcastChannel)

// Fullscreen API stubs
Object.defineProperty(document, 'fullscreenElement', {
  writable: true,
  value: null,
})
document.documentElement.requestFullscreen = vi.fn().mockResolvedValue(undefined)
document.exitFullscreen = vi.fn().mockResolvedValue(undefined)
