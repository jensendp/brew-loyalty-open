import type { Session } from '@brew-loyalty/types'
import { useEffect, useState } from 'react'
import { useAuth } from '../lib/providers'

/**
 * Returns the current auth session and a loading flag.
 * Subscribes to auth state changes for the lifetime of the component.
 */
export function useSession(): { session: Session | null; loading: boolean } {
  const auth = useAuth()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChange((s) => {
      setSession(s)
      setLoading(false)
    })
    return unsubscribe
  }, [auth])

  return { session, loading }
}
