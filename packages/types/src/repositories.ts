/**
 * @brew-loyalty/types — repositories.ts
 *
 * Data access interfaces. Implement these to plug in any backend
 * (Supabase, Firebase, custom REST API, etc.).
 *
 * The app code only depends on these interfaces — never on a
 * concrete implementation.
 */

import type {
  LoyaltyProgram,
  MemberEnrollment,
  MemberEnrollmentWithTier,
  MemberProfile,
  Organization,
  PointLedgerEntry,
  PointRule,
  ProgramTierWithPerks,
  Redemption,
  RedemptionWithReward,
  Reward,
  Transaction,
} from './models'

// ─────────────────────────────────────────────────────────────
// ORGANIZATION & PROGRAM
// ─────────────────────────────────────────────────────────────

export interface IOrganizationRepository {
  /** Look up an org by its URL-friendly slug (used for enrollment QR codes). */
  getOrganizationBySlug(slug: string): Promise<Organization>

  /** Get an org by its ID. */
  getOrganization(id: string): Promise<Organization>
}

export interface ILoyaltyProgramRepository {
  /** Get the active loyalty program for an org. */
  getLoyaltyProgram(orgId: string): Promise<LoyaltyProgram>

  /** Get all active point-earning rules for a program. */
  getPointRules(programId: string): Promise<PointRule[]>

  /** Get all tiers for a program, with their perks, ordered by sort_order. */
  getTiers(programId: string): Promise<ProgramTierWithPerks[]>

  /** Get all active rewards in the catalog for a program. */
  getRewardCatalog(programId: string): Promise<Reward[]>
}

// ─────────────────────────────────────────────────────────────
// MEMBER PROFILE
// ─────────────────────────────────────────────────────────────

export interface IMemberRepository {
  /** Returns null if the profile hasn't been created yet (new user). */
  getMemberProfile(userId: string): Promise<MemberProfile | null>

  /** Called during onboarding to create the initial profile. */
  createMemberProfile(
    profile: Pick<MemberProfile, 'id' | 'displayName' | 'phone' | 'birthday'>
  ): Promise<MemberProfile>

  /** Update profile fields. Partial — only provided fields are updated. */
  updateMemberProfile(
    userId: string,
    updates: Partial<Pick<MemberProfile, 'displayName' | 'phone' | 'birthday' | 'avatarUrl'>>
  ): Promise<MemberProfile>
}

// ─────────────────────────────────────────────────────────────
// ENROLLMENT
// ─────────────────────────────────────────────────────────────

export interface IEnrollmentRepository {
  /**
   * Get a member's enrollment in a specific program.
   * Returns null if the member hasn't joined this program.
   */
  getEnrollment(
    memberId: string,
    programId: string
  ): Promise<MemberEnrollmentWithTier | null>

  /** Get all enrollments for a member (across all programs). */
  getMemberEnrollments(memberId: string): Promise<MemberEnrollmentWithTier[]>

  /**
   * Enroll a member in a program. Assigns the base (free) tier automatically.
   * Idempotent — returns existing enrollment if already enrolled.
   */
  enrollMember(memberId: string, programId: string): Promise<MemberEnrollment>
}

// ─────────────────────────────────────────────────────────────
// POINTS
// ─────────────────────────────────────────────────────────────

export interface IPointsRepository {
  /** Current point balance for an enrollment (sum of ledger). */
  getPointBalance(enrollmentId: string): Promise<number>

  /** Paginated ledger history, newest first. */
  getPointHistory(
    enrollmentId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<PointLedgerEntry[]>

  /** All purchase/check-in transactions for an enrollment, newest first. */
  getTransactions(
    enrollmentId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<Transaction[]>
}

// ─────────────────────────────────────────────────────────────
// REDEMPTIONS
// ─────────────────────────────────────────────────────────────

export interface IRedemptionRepository {
  /** All redemptions for an enrollment, newest first. */
  getRedemptions(enrollmentId: string): Promise<RedemptionWithReward[]>

  /**
   * Redeem a reward. Validates sufficient balance.
   * Throws if insufficient points or reward unavailable.
   * Writes a negative ledger entry atomically.
   */
  redeemReward(enrollmentId: string, rewardId: string): Promise<Redemption>
}

// ─────────────────────────────────────────────────────────────
// COMBINED SERVICE INTERFACE
// ─────────────────────────────────────────────────────────────

/**
 * The full set of repositories injected via ServiceContext.
 * This is what useServices() returns.
 */
export interface IBrewLoyaltyServices {
  organizations: IOrganizationRepository
  programs: ILoyaltyProgramRepository
  members: IMemberRepository
  enrollments: IEnrollmentRepository
  points: IPointsRepository
  redemptions: IRedemptionRepository
}
