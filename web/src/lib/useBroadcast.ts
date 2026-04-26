import { useEffect, useRef, useCallback } from 'react'

type BroadcastMessage =
  | { type: 'slide-change'; index: number; substep: number; slug: string }
  | { type: 'sync-request'; slug: string }

export function useBroadcast(
  slug: string,
  onSync: (index: number, substep: number) => void,
) {
  const channelRef = useRef<BroadcastChannel | null>(null)
  const onSyncRef = useRef(onSync)
  onSyncRef.current = onSync
  // Guard against echo: track the last state we broadcast so we don't re-apply our own change
  const lastSentRef = useRef<{ index: number; substep: number } | null>(null)

  const send = useCallback(
    (index: number, substep: number) => {
      lastSentRef.current = { index, substep }
      channelRef.current?.postMessage({ type: 'slide-change', index, substep, slug } satisfies BroadcastMessage)
    },
    [slug],
  )

  useEffect(() => {
    const channel = new BroadcastChannel('deck-sync')
    channelRef.current = channel

    channel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
      if (event.data.slug !== slug) return
      if (event.data.type === 'slide-change') {
        onSyncRef.current(event.data.index, event.data.substep)
      } else if (event.data.type === 'sync-request') {
        // A new tab connected — respond with our current position
        if (lastSentRef.current !== null) {
          channelRef.current?.postMessage({
            type: 'slide-change',
            index: lastSentRef.current.index,
            substep: lastSentRef.current.substep,
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
