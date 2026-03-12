/**
 * useProfile — unit tests
 */
import { renderHook, act } from '@testing-library/react-native'
import { useProfile } from '../useProfile'
import { useSession } from '../useSession'
import { useServices } from '../../lib/providers'
import type { MemberProfile } from '@brew-loyalty/types'

jest.mock('../useSession')
jest.mock('../../lib/providers')

const mockUseSession = useSession as jest.Mock
const mockUseServices = useServices as jest.Mock

const createdProfile: MemberProfile = {
  id: 'user-1',
  displayName: 'Alex Brewer',
  phone: null,
  birthday: '1990-06-15',
  avatarUrl: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

describe('useProfile', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns null and sets no error when session is missing', async () => {
    mockUseSession.mockReturnValue({ session: null, loading: false })
    const mockCreate = jest.fn()
    mockUseServices.mockReturnValue({ members: { createMemberProfile: mockCreate } })

    const { result } = renderHook(() => useProfile())
    let returned: MemberProfile | null = null

    await act(async () => {
      returned = await result.current.createProfile({ displayName: 'Alex' })
    })

    expect(returned).toBeNull()
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('calls createMemberProfile with correct args and returns profile', async () => {
    mockUseSession.mockReturnValue({
      session: { userId: 'user-1', email: 'alex@test.com' },
      loading: false,
    })
    const mockCreate = jest.fn().mockResolvedValue(createdProfile)
    mockUseServices.mockReturnValue({ members: { createMemberProfile: mockCreate } })

    const { result } = renderHook(() => useProfile())
    let returned: MemberProfile | null = null

    await act(async () => {
      returned = await result.current.createProfile({
        displayName: 'Alex Brewer',
        birthday: '1990-06-15',
      })
    })

    expect(mockCreate).toHaveBeenCalledWith({
      id: 'user-1',
      displayName: 'Alex Brewer',
      phone: null,
      birthday: '1990-06-15',
    })
    expect(returned).toEqual(createdProfile)
    expect(result.current.error).toBeNull()
  })

  it('sets error and returns null on failure', async () => {
    mockUseSession.mockReturnValue({
      session: { userId: 'user-1', email: 'alex@test.com' },
      loading: false,
    })
    mockUseServices.mockReturnValue({
      members: { createMemberProfile: jest.fn().mockRejectedValue(new Error('DB error')) },
    })

    const { result } = renderHook(() => useProfile())
    let returned: MemberProfile | null = null

    await act(async () => {
      returned = await result.current.createProfile({ displayName: 'Alex' })
    })

    expect(returned).toBeNull()
    expect(result.current.error).toMatch(/could not save/i)
  })
})
