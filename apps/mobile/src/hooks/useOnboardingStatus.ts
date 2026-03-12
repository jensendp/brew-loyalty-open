import type { MemberEnrollmentWithTier, MemberProfile } from '@brew-loyalty/types'
import { useEffect, useState } from 'react'
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
}

/**
 * Determines where the user is in the onboarding funnel.
 * Used by the root layout to route to the correct screen.
 *
 * Flow: unauthenticated → needs-profile → needs-enrollment → ready
 */
export function useOnboardingStatus(): OnboardingState {
  const { session, loading: sessionLoading } = useSession()
  const { members, enrollments } = useServices()

  const [profile, setProfile] = useState<MemberProfile | null>(null)
  const [enrollment, setEnrollment] = useState<MemberEnrollmentWithTier | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

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
  }, [session?.userId, sessionLoading])

  const loading = sessionLoading || dataLoading

  if (loading) return { status: 'loading', profile: null, enrollment: null }
  if (!session) return { status: 'unauthenticated', profile: null, enrollment: null }
  if (!profile) return { status: 'needs-profile', profile: null, enrollment: null }
  if (!enrollment) return { status: 'needs-enrollment', profile, enrollment: null }
  return { status: 'ready', profile, enrollment }
}
