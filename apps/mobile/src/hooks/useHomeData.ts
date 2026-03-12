import type { MemberEnrollmentWithTier, MemberProfile, Transaction } from '@brew-loyalty/types'
import { useEffect, useState } from 'react'
import { useServices } from '../lib/providers'
import { useSession } from './useSession'

interface HomeData {
  loading: boolean
  profile: MemberProfile | null
  enrollment: MemberEnrollmentWithTier | null
  balance: number
  recentTransactions: Transaction[]
}

/**
 * Fetches everything the home screen needs in a single coordinated load.
 * Returns profile, current enrollment + tier, points balance, and recent activity.
 */
export function useHomeData(): HomeData {
  const { session } = useSession()
  const { members, enrollments, points } = useServices()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<MemberProfile | null>(null)
  const [enrollment, setEnrollment] = useState<MemberEnrollmentWithTier | null>(null)
  const [balance, setBalance] = useState(0)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (!session) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      try {
        const memberProfile = await members.getMemberProfile(session!.userId)
        if (cancelled) return
        setProfile(memberProfile)

        if (!memberProfile) { setLoading(false); return }

        const allEnrollments = await enrollments.getMemberEnrollments(memberProfile.id)
        const currentEnrollment = allEnrollments[0] ?? null
        if (cancelled) return
        setEnrollment(currentEnrollment)

        if (currentEnrollment) {
          const [bal, txns] = await Promise.all([
            points.getPointBalance(currentEnrollment.id),
            points.getTransactions(currentEnrollment.id, { limit: 5 }),
          ])
          if (!cancelled) {
            setBalance(bal)
            setRecentTransactions(txns)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [session?.userId])

  return { loading, profile, enrollment, balance, recentTransactions }
}
