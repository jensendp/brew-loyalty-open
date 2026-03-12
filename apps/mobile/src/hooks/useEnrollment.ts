import type { MemberEnrollment } from '@brew-loyalty/types'
import { useState } from 'react'
import { useServices } from '../lib/providers'

interface UseEnrollmentReturn {
  loading: boolean
  error: string | null
  joinByCode(code: string, memberId: string): Promise<MemberEnrollment | null>
}

/**
 * Handles program enrollment during onboarding.
 * Member enters an enrollment code (e.g. "IRONWOOD") to join a loyalty program.
 */
export function useEnrollment(): UseEnrollmentReturn {
  const { programs, enrollments } = useServices()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function joinByCode(
    code: string,
    memberId: string
  ): Promise<MemberEnrollment | null> {
    setLoading(true)
    setError(null)
    try {
      const program = await programs.getProgramByEnrollmentCode(code.trim())
      if (!program) {
        setError('Program not found. Check your enrollment code and try again.')
        return null
      }
      return await enrollments.enrollMember(memberId, program.id)
    } catch {
      setError('Could not join program. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, joinByCode }
}
