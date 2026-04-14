import { useEffect, useRef, useCallback } from 'react'

type BroadcastMessage =
  | { type: 'slide-change'; index: number; slug: string }
  | { type: 'sync-request'; slug: string }

export function useBroadcast(slug: string, onSlideChange: (index: number) => void) {
  const channelRef = useRef<BroadcastChannel | null>(null)
  const onSlideChangeRef = useRef(onSlideChange)
  onSlideChangeRef.current = onSlideChange
  // Guard against echo: track the last index we broadcast so we don't re-apply our own change
  const lastSentRef = useRef<number | null>(null)

  const send = useCallback(
    (index: number) => {
      lastSentRef.current = index
      channelRef.current?.postMessage({ type: 'slide-change', index, slug } satisfies BroadcastMessage)
    },
    [slug],
  )

  useEffect(() => {
    const channel = new BroadcastChannel('deck-sync')
    channelRef.current = channel

    channel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
      if (event.data.slug !== slug) return
      if (event.data.type === 'slide-change') {
        onSlideChangeRef.current(event.data.index)
      } else if (event.data.type === 'sync-request') {
        // A new tab connected — respond with our current position
        // Use lastSentRef as a proxy for our current index
        if (lastSentRef.current !== null) {
          channelRef.current?.postMessage({
            type: 'slide-change',
            index: lastSentRef.current,
            slug,
          } satisfies BroadcastMessage)
        }
      }
    }

    // Request sync from any existing tab
    channel.postMessage({ type: 'sync-request', slug } satisfies BroadcastMessage)

    return () => {
      channel.close()
      channelRef.current = null
    }
  }, [slug, send])

  return { send }
}
