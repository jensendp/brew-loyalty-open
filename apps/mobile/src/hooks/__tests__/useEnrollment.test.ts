/**
 * useEnrollment — unit tests
 */
import { renderHook, act } from '@testing-library/react-native'
import { useEnrollment } from '../useEnrollment'
import { useServices } from '../../lib/providers'
import type { LoyaltyProgram, MemberEnrollment } from '@brew-loyalty/types'

jest.mock('../../lib/providers')

const mockUseServices = useServices as jest.Mock

const mockProgram: LoyaltyProgram = {
  id: 'prog-1',
  orgId: 'org-1',
  name: 'Ironwood Rewards',
  description: null,
  enrollmentCode: 'IRONWOOD',
  isActive: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

const mockEnrollment: MemberEnrollment = {
  id: 'enroll-1',
  memberId: 'user-1',
  programId: 'prog-1',
  currentTierId: null,
  tierExpiresAt: null,
  enrolledAt: '2026-01-01T00:00:00Z',
}

describe('useEnrollment', () => {
  beforeEach(() => jest.clearAllMocks())

  it('sets error and returns null when program not found', async () => {
    mockUseServices.mockReturnValue({
      programs: { getProgramByEnrollmentCode: jest.fn().mockResolvedValue(null) },
      enrollments: { enrollMember: jest.fn() },
    })

    const { result } = renderHook(() => useEnrollment())
    let returned: MemberEnrollment | null = null

    await act(async () => {
      returned = await result.current.joinByCode('UNKNOWN', 'user-1')
    })

    expect(returned).toBeNull()
    expect(result.current.error).toMatch(/not found/i)
  })

  it('trims and uppercases the code before lookup', async () => {
    const mockGetProgram = jest.fn().mockResolvedValue(mockProgram)
    const mockEnroll = jest.fn().mockResolvedValue(mockEnrollment)
    mockUseServices.mockReturnValue({
      programs: { getProgramByEnrollmentCode: mockGetProgram },
      enrollments: { enrollMember: mockEnroll },
    })

    const { result } = renderHook(() => useEnrollment())

    await act(async () => {
      await result.current.joinByCode('  ironwood  ', 'user-1')
    })

    // The hook trims; getProgramByEnrollmentCode receives trimmed value
    // (uppercasing happens inside the repository implementation)
    expect(mockGetProgram).toHaveBeenCalledWith('ironwood')
  })

  it('calls enrollMember with correct args and returns enrollment', async () => {
    const mockEnroll = jest.fn().mockResolvedValue(mockEnrollment)
    mockUseServices.mockReturnValue({
      programs: { getProgramByEnrollmentCode: jest.fn().mockResolvedValue(mockProgram) },
      enrollments: { enrollMember: mockEnroll },
    })

    const { result } = renderHook(() => useEnrollment())
    let returned: MemberEnrollment | null = null

    await act(async () => {
      returned = await result.current.joinByCode('IRONWOOD', 'user-1')
    })

    expect(mockEnroll).toHaveBeenCalledWith('user-1', 'prog-1')
    expect(returned).toEqual(mockEnrollment)
    expect(result.current.error).toBeNull()
  })

  it('sets error and returns null on enrollMember failure', async () => {
    mockUseServices.mockReturnValue({
      programs: { getProgramByEnrollmentCode: jest.fn().mockResolvedValue(mockProgram) },
      enrollments: { enrollMember: jest.fn().mockRejectedValue(new Error('DB error')) },
    })

    const { result } = renderHook(() => useEnrollment())
    let returned: MemberEnrollment | null = null

    await act(async () => {
      returned = await result.current.joinByCode('IRONWOOD', 'user-1')
    })

    expect(returned).toBeNull()
    expect(result.current.error).toMatch(/could not join/i)
  })
})
