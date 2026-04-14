import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDeck } from '@/lib/useDeck'
import { useBroadcast } from '@/lib/useBroadcast'
import { MockBroadcastChannel } from '@/test/mocks'

function useTestSync(slug: string, totalSlides: number) {
  const deck = useDeck(slug, totalSlides)
  const { send } = useBroadcast(slug, deck.goTo)
  return { ...deck, send }
}

describe('Presenter sync integration', () => {
  beforeEach(() => {
    MockBroadcastChannel.reset()
    localStorage.clear()
  })

  it('Instance A sends index 3 -> Instance B receives and updates', () => {
    const { result: instanceA } = renderHook(() => useTestSync('sync-talk', 5))
    const { result: instanceB } = renderHook(() => useTestSync('sync-talk', 5))

    // Both start at index 0
    expect(instanceA.current.index).toBe(0)
    expect(instanceB.current.index).toBe(0)

    // Instance A navigates to index 3 and broadcasts
    act(() => {
      instanceA.current.goTo(3)
    })
    act(() => {
      instanceA.current.send(3)
    })

    // Instance B should now be at index 3
    expect(instanceB.current.index).toBe(3)
  })

  it('Instance B sends index 1 -> Instance A receives and updates', () => {
    const { result: instanceA } = renderHook(() => useTestSync('sync-talk', 5))
    const { result: instanceB } = renderHook(() => useTestSync('sync-talk', 5))

    // Instance B navigates to index 1 and broadcasts
    act(() => {
      instanceB.current.goTo(1)
    })
    act(() => {
      instanceB.current.send(1)
    })

    // Instance A should now be at index 1
    expect(instanceA.current.index).toBe(1)
  })

  it('new instance joins and receives sync via sync-request', () => {
    const { result: instanceA } = renderHook(() => useTestSync('sync-talk', 5))

    // Instance A navigates to index 3 and broadcasts (so lastSentRef is set)
    act(() => {
      instanceA.current.goTo(3)
    })
    act(() => {
      instanceA.current.send(3)
    })

    // New instance joins — on mount it sends a sync-request, instance A replies
    const { result: instanceC } = renderHook(() => useTestSync('sync-talk', 5))

    // Instance C should receive the sync response and be at index 3
    expect(instanceC.current.index).toBe(3)
  })

  it('messages with a different slug are ignored', () => {
    const { result: instanceA } = renderHook(() => useTestSync('talk-alpha', 5))
    const { result: instanceB } = renderHook(() => useTestSync('talk-beta', 5))

    // Instance A broadcasts on a different slug
    act(() => {
      instanceA.current.goTo(4)
    })
    act(() => {
      instanceA.current.send(4)
    })

    // Instance B should still be at 0 because it listens to a different slug
    expect(instanceB.current.index).toBe(0)
  })

  it('bidirectional sync works across multiple messages', () => {
    const { result: instanceA } = renderHook(() => useTestSync('sync-talk', 5))
    const { result: instanceB } = renderHook(() => useTestSync('sync-talk', 5))

    // A -> B: go to 2
    act(() => {
      instanceA.current.goTo(2)
    })
    act(() => {
      instanceA.current.send(2)
    })
    expect(instanceB.current.index).toBe(2)

    // B -> A: go to 4
    act(() => {
      instanceB.current.goTo(4)
    })
    act(() => {
      instanceB.current.send(4)
    })
    expect(instanceA.current.index).toBe(4)
  })
})
