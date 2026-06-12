import { useCallback, useEffect, useRef, useState } from 'react'
import type { BannerTone } from '@/components/ui'

type StatusMessage = {
  tone: BannerTone
  text: string
}

/**
 * Petit gestionnaire de message d'état transitoire (succès / erreur / info)
 * qui s'efface tout seul. Remplace le `useState('')` + `setMessage(...)`
 * dupliqué dans plusieurs pages.
 */
export function useStatusMessage(autoDismissMs = 4000) {
  const [message, setMessage] = useState<StatusMessage | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const notify = useCallback(
    (tone: BannerTone, text: string) => {
      clearTimer()
      setMessage({ tone, text })
      if (autoDismissMs > 0) {
        timer.current = setTimeout(() => setMessage(null), autoDismissMs)
      }
    },
    [autoDismissMs, clearTimer],
  )

  useEffect(() => clearTimer, [clearTimer])

  return { message, notify }
}
