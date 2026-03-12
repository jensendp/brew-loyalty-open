/**
 * useOnboardingStatus — unit tests
 * Mocks useSession and useServices to verify status derivation logic.
 */
import { renderHook, waitFor } from '@testing-library/react-native'
import { useOnboardingStatus } from '../useOnboardingStatus'
import { useSession } from '../useSession'
import { useServices } from '../../lib/providers'
import type { MemberEnrollmentWithTier, MemberProfile } from '@brew-loyalty/types'

jest.mock('../useSession')
jest.mock('../../lib/providers')

const mockUseSession = useSession as jest.Mock
const mockUseServices = useServices as jest.Mock

const mockProfile: MemberProfile = {
  id: 'user-1',
  displayName: 'Alex',
  phone: null,
  birthday: null,
  avatarUrl: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

const mockEnrollment: MemberEnrollmentWithTier = {
  id: 'enroll-1',
  memberId: 'user-1',
  programId: 'prog-1',
  currentTierId: 'tier-1',
  tierExpiresAt: null,
  enrolledAt: '2026-01-01T00:00:00Z',
  currentTier: null,
}

function setupMocks(overrides: {
  session?: { userId: string; email: string } | null
  sessionLoading?: boolean
  profile?: MemberProfile | null
  enrollments?: MemberEnrollmentWithTier[]
}) {
  const {
    session = { userId: 'user-1', email: 'test@example.com' },
    sessionLoading = false,
    profile = mockProfile,
    enrollments = [mockEnrollment],
  } = overrides

  mockUseSession.mockReturnValue({ session, loading: sessionLoading })
  mockUseServices.mockReturnValue({
    members: {
      getMemberProfile: jest.fn().mockResolvedValue(profile),
    },
    enrollments: {
      getMemberEnrollments: jest.fn().mockResolvedValue(enrollments),
    },
  })
}

describe('useOnboardingStatus', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns loading while session is loading', () => {
    setupMocks({ sessionLoading: true })
    const { result } = renderHook(() => useOnboardingStatus())
    expect(result.current.status).toBe('loading')
  })

  it('returns unauthenticated when no session', async () => {
    setupMocks({ session: null })
    const { result } = renderHook(() => useOnboardingStatus())
    await waitFor(() => expect(result.current.status).toBe('unauthenticated'))
  })

  it('returns needs-profile when profile is null', async () => {
    setupMocks({ profile: null })
    const { result } = renderHook(() => useOnboardingStatus())
    await waitFor(() => expect(result.current.status).toBe('needs-profile'))
  })

  it('returns needs-enrollment when profile exists but no enrollments', async () => {
    setupMocks({ enrollments: [] })
    const { result } = renderHook(() => useOnboardingStatus())
    await waitFor(() => expect(result.current.status).toBe('needs-enrollment'))
    expect(result.current.profile).toEqual(mockProfile)
  })

  it('returns ready when profile and enrollment exist', async () => {
    setupMocks({})
    const { result } = renderHook(() => useOnboardingStatus())
    await waitFor(() => expect(result.current.status).toBe('ready'))
    expect(result.current.profile).toEqual(mockProfile)
    expect(result.current.enrollment).toEqual(mockEnrollment)
  })
})
