import type { MemberProfile } from '@brew-loyalty/types'
import { useState } from 'react'
import { useServices } from '../lib/providers'
import { useSession } from './useSession'

interface CreateProfileArgs {
  displayName: string
  birthday?: string  // YYYY-MM-DD, optional
}

interface UseProfileReturn {
  loading: boolean
  error: string | null
  createProfile(args: CreateProfileArgs): Promise<MemberProfile | null>
}

/**
 * Provides profile creation during onboarding.
 * The profile id matches the authenticated user's id.
 */
export function useProfile(): UseProfileReturn {
  const { session } = useSession()
  const { members } = useServices()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createProfile(args: CreateProfileArgs): Promise<MemberProfile | null> {
    if (!session) return null
    setLoading(true)
    setError(null)
    try {
      return await members.createMemberProfile({
        id: session.userId,
        displayName: args.displayName,
        phone: null,
        birthday: args.birthday ?? null,
      })
    } catch {
      setError('Could not save your profile. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, createProfile }
}
