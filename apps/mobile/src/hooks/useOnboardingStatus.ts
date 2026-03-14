import type { MemberEnrollmentWithTier, MemberProfile } from '@brew-loyalty/types'
import { useCallback, useEffect, useState } from 'react'
import { useServices } from '../lib/providers'
import { useSession } from './useSession'

export type OnboardingStatus =
  | 'loading'
  | 'unauthenticated'
  | 'needs-profile'
  | 'needs-enrollment'
  | 'ready'

interface OnboardingState {
  status: OnboardingStatus
  profile: MemberProfile | null
  enrollment: MemberEnrollmentWithTier | null
  /** Call after profile creation or enrollment to re-check the funnel state. */
  refresh: () => void
}

/**
 * Determines where the user is in the onboarding funnel.
 * Used by the root layout to route to the correct screen.
 *
 * Flow: unauthenticated → needs-profile → needs-enrollment → ready
 *
 * Call refresh() after any onboarding step completes to re-check state
 * and prevent routing races between the screen's explicit navigation and
 * the root layout's status-driven routing.
 */
export function useOnboardingStatus(): OnboardingState {
  const { session, loading: sessionLoading } = useSession()
  const { members, enrollments } = useServices()

  const [profile, setProfile] = useState<MemberProfile | null>(null)
  const [enrollment, setEnrollment] = useState<MemberEnrollmentWithTier | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = useCallback(() => setRefreshKey(k => k + 1), [])

  useEffect(() => {
    if (sessionLoading) return

    if (!session) {
      setProfile(null)
      setEnrollment(null)
      setDataLoading(false)
      return
    }

    let cancelled = false
    setDataLoading(true)

    async function check() {
      try {
        const memberProfile = await members.getMemberProfile(session!.userId)
        if (cancelled) return
        setProfile(memberProfile)

        if (memberProfile) {
          const all = await enrollments.getMemberEnrollments(memberProfile.id)
          if (!cancelled) setEnrollment(all[0] ?? null)
        } else {
          if (!cancelled) setEnrollment(null)
        }
      } finally {
        if (!cancelled) setDataLoading(false)
      }
    }

    check()
    return () => { cancelled = true }
  }, [session?.userId, sessionLoading, refreshKey])

  const loading = sessionLoading || dataLoading

  if (loading) return { status: 'loading', profile: null, enrollment: null, refresh }
  if (!session) return { status: 'unauthenticated', profile: null, enrollment: null, refresh }
  if (!profile) return { status: 'needs-profile', profile: null, enrollment: null, refresh }
  if (!enrollment) return { status: 'needs-enrollment', profile, enrollment: null, refresh }
  return { status: 'ready', profile, enrollment, refresh }
}
