/**
 * mockServices.tsx
 *
 * Test utilities: mock implementations of all service interfaces.
 *
 * Usage in tests:
 *   import { renderWithServices } from '../testing/mockServices'
 *
 *   it('shows the point balance', async () => {
 *     const { getByText } = renderWithServices(<HomeScreen />, {
 *       points: { getPointBalance: jest.fn().mockResolvedValue(250) }
 *     })
 *     await waitFor(() => expect(getByText('250')).toBeTruthy())
 *   })
 */

import type {
  IAuthProvider,
  IBrewLoyaltyServices,
  IEnrollmentRepository,
  IEventBus,
  ILoyaltyProgramRepository,
  IMemberRepository,
  IOrganizationRepository,
  IPointsRepository,
  IRedemptionRepository,
  Session,
} from '@brew-loyalty/types'
import React from 'react'
import { ServicesContext } from '../providers'
import { EventBus } from '../EventBus'

// ─────────────────────────────────────────────────────────────
// MOCK AUTH PROVIDER
// ─────────────────────────────────────────────────────────────

export const mockSession: Session = {
  userId: 'test-user-id',
  email: 'test@example.com',
}

export function createMockAuthProvider(
  overrides: Partial<IAuthProvider> = {}
): IAuthProvider {
  return {
    signInWithMagicLink: jest.fn().mockResolvedValue(undefined),
    signOut: jest.fn().mockResolvedValue(undefined),
    getSession: jest.fn().mockResolvedValue(mockSession),
    onAuthStateChange: jest.fn().mockImplementation((cb) => {
      cb(mockSession)
      return () => {}
    }),
    ...overrides,
  }
}

// ─────────────────────────────────────────────────────────────
// MOCK REPOSITORIES
// ─────────────────────────────────────────────────────────────

export function createMockOrganizationRepository(
  overrides: Partial<IOrganizationRepository> = {}
): IOrganizationRepository {
  return {
    getOrganizationBySlug: jest.fn().mockResolvedValue(null),
    getOrganization: jest.fn().mockResolvedValue(null),
    ...overrides,
  }
}

export function createMockLoyaltyProgramRepository(
  overrides: Partial<ILoyaltyProgramRepository> = {}
): ILoyaltyProgramRepository {
  return {
    getLoyaltyProgram: jest.fn().mockResolvedValue(null),
    getPointRules: jest.fn().mockResolvedValue([]),
    getTiers: jest.fn().mockResolvedValue([]),
    getRewardCatalog: jest.fn().mockResolvedValue([]),
    ...overrides,
  }
}

export function createMockMemberRepository(
  overrides: Partial<IMemberRepository> = {}
): IMemberRepository {
  return {
    getMemberProfile: jest.fn().mockResolvedValue(null),
    createMemberProfile: jest.fn().mockResolvedValue(null),
    updateMemberProfile: jest.fn().mockResolvedValue(null),
    ...overrides,
  }
}

export function createMockEnrollmentRepository(
  overrides: Partial<IEnrollmentRepository> = {}
): IEnrollmentRepository {
  return {
    getEnrollment: jest.fn().mockResolvedValue(null),
    getMemberEnrollments: jest.fn().mockResolvedValue([]),
    enrollMember: jest.fn().mockResolvedValue(null),
    ...overrides,
  }
}

export function createMockPointsRepository(
  overrides: Partial<IPointsRepository> = {}
): IPointsRepository {
  return {
    getPointBalance: jest.fn().mockResolvedValue(0),
    getPointHistory: jest.fn().mockResolvedValue([]),
    getTransactions: jest.fn().mockResolvedValue([]),
    ...overrides,
  }
}

export function createMockRedemptionRepository(
  overrides: Partial<IRedemptionRepository> = {}
): IRedemptionRepository {
  return {
    getRedemptions: jest.fn().mockResolvedValue([]),
    redeemReward: jest.fn().mockResolvedValue(null),
    ...overrides,
  }
}

// ─────────────────────────────────────────────────────────────
// MOCK SERVICES BUNDLE
// ─────────────────────────────────────────────────────────────

export type MockServiceOverrides = {
  auth?: Partial<IAuthProvider>
  organizations?: Partial<IOrganizationRepository>
  programs?: Partial<ILoyaltyProgramRepository>
  members?: Partial<IMemberRepository>
  enrollments?: Partial<IEnrollmentRepository>
  points?: Partial<IPointsRepository>
  redemptions?: Partial<IRedemptionRepository>
}

export function createMockServices(overrides: MockServiceOverrides = {}): {
  auth: IAuthProvider
  loyalty: IBrewLoyaltyServices
  events: IEventBus
} {
  return {
    auth: createMockAuthProvider(overrides.auth),
    loyalty: {
      organizations: createMockOrganizationRepository(overrides.organizations),
      programs: createMockLoyaltyProgramRepository(overrides.programs),
      members: createMockMemberRepository(overrides.members),
      enrollments: createMockEnrollmentRepository(overrides.enrollments),
      points: createMockPointsRepository(overrides.points),
      redemptions: createMockRedemptionRepository(overrides.redemptions),
    },
    events: new EventBus(),
  }
}

// ─────────────────────────────────────────────────────────────
// RENDER HELPER
// ─────────────────────────────────────────────────────────────

import { render } from '@testing-library/react-native'
import type { RenderOptions } from '@testing-library/react-native'

export function renderWithServices(
  ui: React.ReactElement,
  serviceOverrides: MockServiceOverrides = {},
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const services = createMockServices(serviceOverrides)

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ServicesContext.Provider value={services}>
        {children}
      </ServicesContext.Provider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...options })
}
