import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBroadcast } from '../useBroadcast'
import { MockBroadcastChannel } from '@/test/mocks'

describe('useBroadcast', () => {
  beforeEach(() => {
    MockBroadcastChannel.reset()
  })

  it('creates a BroadcastChannel named "deck-sync" on mount', () => {
    renderHook(() => useBroadcast('demo', vi.fn()))
    const channels = MockBroadcastChannel.getChannels()
    expect(channels.length).toBeGreaterThanOrEqual(1)
    expect(channels.some((ch) => ch.name === 'deck-sync')).toBe(true)
  })

  it('closes channel on unmount', () => {
    const { unmount } = renderHook(() => useBroadcast('demo', vi.fn()))
    const channels = MockBroadcastChannel.getChannels()
    const channel = channels.find((ch) => ch.name === 'deck-sync')!

    unmount()
    expect(channel.closed).toBe(true)
  })

  it('send() posts slide-change message with correct slug and index', () => {
    // Create a listener channel first so we can capture messages
    const listener = new MockBroadcastChannel('deck-sync')
    const received: any[] = []
    listener.onmessage = (e: MessageEvent) => received.push(e.data)

    const { result } = renderHook(() => useBroadcast('demo', vi.fn()))

    act(() => result.current.send(5))

    const slideChanges = received.filter((m) => m.type === 'slide-change' && m.index === 5)
    expect(slideChanges.length).toBeGreaterThanOrEqual(1)
    expect(slideChanges[0]).toEqual({ type: 'slide-change', index: 5, slug: 'demo' })

    listener.close()
  })

  it('incoming slide-change with matching slug calls onSlideChange', () => {
    const onSlideChange = vi.fn()
    renderHook(() => useBroadcast('demo', onSlideChange))

    // Create an external channel to send messages
    const sender = new MockBroadcastChannel('deck-sync')
    sender.postMessage({ type: 'slide-change', index: 7, slug: 'demo' })

    expect(onSlideChange).toHaveBeenCalledWith(7)

    sender.close()
  })

  it('incoming slide-change with different slug is ignored', () => {
    const onSlideChange = vi.fn()
    renderHook(() => useBroadcast('demo', onSlideChange))

    const sender = new MockBroadcastChannel('deck-sync')
    sender.postMessage({ type: 'slide-change', index: 3, slug: 'other-talk' })

    expect(onSlideChange).not.toHaveBeenCalled()

    sender.close()
  })

  it('responds to sync-request with last sent index', () => {
    const { result } = renderHook(() => useBroadcast('demo', vi.fn()))

    // Send a slide index so lastSentRef is set
    act(() => result.current.send(4))

    // Create a new channel that sends sync-request and captures the response
    const receiver = new MockBroadcastChannel('deck-sync')
    const received: any[] = []
    receiver.onmessage = (e: MessageEvent) => received.push(e.data)

    // Another channel sends sync-request
    const requester = new MockBroadcastChannel('deck-sync')
    requester.postMessage({ type: 'sync-request', slug: 'demo' })

    const slideChanges = received.filter((m) => m.type === 'slide-change')
    expect(slideChanges).toContainEqual({ type: 'slide-change', index: 4, slug: 'demo' })

    receiver.close()
    requester.close()
  })

  it('does not respond to sync-request when nothing has been sent', () => {
    // Render the hook (it will fire its own sync-request on mount)
    renderHook(() => useBroadcast('demo', vi.fn()))

    // Set up a listener to capture any responses
    const receiver = new MockBroadcastChannel('deck-sync')
    const received: any[] = []
    receiver.onmessage = (e: MessageEvent) => received.push(e.data)

    // Send a sync-request from an external channel
    const requester = new MockBroadcastChannel('deck-sync')
    requester.postMessage({ type: 'sync-request', slug: 'demo' })

    // The hook never called send(), so lastSentRef is null -> no slide-change response
    const slideChanges = received.filter((m) => m.type === 'slide-change')
    expect(slideChanges).toHaveLength(0)

    receiver.close()
    requester.close()
  })

  it('sends sync-request on mount', () => {
    // Set up a listener first to capture the sync-request
    const listener = new MockBroadcastChannel('deck-sync')
    const received: any[] = []
    listener.onmessage = (e: MessageEvent) => received.push(e.data)

    renderHook(() => useBroadcast('demo', vi.fn()))

    const syncRequests = received.filter((m) => m.type === 'sync-request')
    expect(syncRequests).toContainEqual({ type: 'sync-request', slug: 'demo' })

    listener.close()
  })

  it('bidirectional: two hook instances with same slug sync', () => {
    const onChangeA = vi.fn()
    const onChangeB = vi.fn()

    const { result: a } = renderHook(() => useBroadcast('demo', onChangeA))
    const { result: b } = renderHook(() => useBroadcast('demo', onChangeB))

    // A sends to B
    act(() => a.current.send(3))
    expect(onChangeB).toHaveBeenCalledWith(3)

    // B sends to A
    act(() => b.current.send(8))
    expect(onChangeA).toHaveBeenCalledWith(8)
  })
})
