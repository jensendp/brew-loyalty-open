/**
 * @brew-loyalty/types — models.ts
 *
 * Plain TypeScript interfaces mirroring the Brew Loyalty data model.
 * NO backend-specific imports. Ever.
 *
 * All dates are ISO 8601 strings (backend-agnostic).
 * All IDs are strings (UUID-compatible, but not coupled to Postgres).
 */

// ─────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────

export type PointRuleType =
  | 'per_dollar'
  | 'per_visit'
  | 'signup_bonus'
  | 'birthday_bonus'
  | 'custom_event'

export type TierType = 'free' | 'paid_subscription' | 'threshold'

export type PerkType =
  | 'point_multiplier'
  | 'free_item'
  | 'discount_pct'
  | 'event_access'
  | 'custom'

export type LedgerType =
  | 'earn_purchase'
  | 'earn_visit'
  | 'earn_bonus'
  | 'redeem'
  | 'adjustment'
  | 'expire'

// ─────────────────────────────────────────────────────────────
// ORGANIZATION
// ─────────────────────────────────────────────────────────────

export interface Organization {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  primaryColor: string
  createdAt: string
  updatedAt: string
}

// ─────────────────────────────────────────────────────────────
// LOYALTY PROGRAM
// ─────────────────────────────────────────────────────────────

export interface LoyaltyProgram {
  id: string
  orgId: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ─────────────────────────────────────────────────────────────
// POINT RULES
// ─────────────────────────────────────────────────────────────

export interface PointRule {
  id: string
  programId: string
  ruleType: PointRuleType
  pointsValue: number
  dollarThreshold: number
  description: string | null
  isActive: boolean
  createdAt: string
}

// ─────────────────────────────────────────────────────────────
// TIERS & PERKS
// ─────────────────────────────────────────────────────────────

export interface ProgramTier {
  id: string
  programId: string
  name: string
  description: string | null
  tierType: TierType
  monthlyCost: number | null
  pointThreshold: number | null
  spendThreshold: number | null
  sortOrder: number
  color: string
  icon: string | null
  createdAt: string
  updatedAt: string
}

export interface TierPerk {
  id: string
  tierId: string
  perkType: PerkType
  multiplier: number | null
  discountPct: number | null
  freeItemDesc: string | null
  description: string
  createdAt: string
}

// Convenience: tier with its perks pre-loaded
export interface ProgramTierWithPerks extends ProgramTier {
  perks: TierPerk[]
}

// ─────────────────────────────────────────────────────────────
// REWARDS
// ─────────────────────────────────────────────────────────────

export interface Reward {
  id: string
  programId: string
  name: string
  description: string | null
  pointCost: number
  imageUrl: string | null
  isActive: boolean
  quantityLimit: number | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}

// ─────────────────────────────────────────────────────────────
// MEMBER
// ─────────────────────────────────────────────────────────────

export interface MemberProfile {
  id: string
  displayName: string | null
  phone: string | null
  birthday: string | null  // YYYY-MM-DD
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface MemberEnrollment {
  id: string
  memberId: string
  programId: string
  currentTierId: string | null
  tierExpiresAt: string | null
  enrolledAt: string
}

// Convenience: enrollment with current tier pre-loaded
export interface MemberEnrollmentWithTier extends MemberEnrollment {
  currentTier: ProgramTier | null
}

// ─────────────────────────────────────────────────────────────
// POINT LEDGER
// ─────────────────────────────────────────────────────────────

export interface PointLedgerEntry {
  id: string
  enrollmentId: string
  amount: number              // positive = earned, negative = spent
  ledgerType: LedgerType
  referenceId: string | null  // FK to transaction or redemption
  description: string | null
  createdAt: string
}

// ─────────────────────────────────────────────────────────────
// TRANSACTIONS & REDEMPTIONS
// ─────────────────────────────────────────────────────────────

export interface Transaction {
  id: string
  enrollmentId: string
  amountSpent: number
  pointsEarned: number
  checkedInAt: string
  recordedBy: string | null
  locationNote: string | null
}

export interface Redemption {
  id: string
  enrollmentId: string
  rewardId: string
  pointsSpent: number
  redeemedAt: string
  fulfilledAt: string | null
  fulfilledBy: string | null
}

// Convenience: redemption with reward pre-loaded
export interface RedemptionWithReward extends Redemption {
  reward: Reward
}
