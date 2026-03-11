/**
 * Mappers: DB row (snake_case) → domain type (camelCase)
 *
 * Keeping mapping logic here means:
 *   1. DB schema changes only touch this file
 *   2. Repository methods stay clean and readable
 */

import type {
  LoyaltyProgram,
  MemberEnrollment,
  MemberProfile,
  Organization,
  PerkType,
  PointLedgerEntry,
  PointRule,
  PointRuleType,
  ProgramTier,
  Redemption,
  Reward,
  TierPerk,
  TierType,
  Transaction,
  LedgerType,
} from '@brew-loyalty/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>

export const mapOrganization = (row: Row): Organization => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  logoUrl: row.logo_url,
  primaryColor: row.primary_color,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapLoyaltyProgram = (row: Row): LoyaltyProgram => ({
  id: row.id,
  orgId: row.org_id,
  name: row.name,
  description: row.description,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapPointRule = (row: Row): PointRule => ({
  id: row.id,
  programId: row.program_id,
  ruleType: row.rule_type as PointRuleType,
  pointsValue: row.points_value,
  dollarThreshold: parseFloat(row.dollar_threshold),
  description: row.description,
  isActive: row.is_active,
  createdAt: row.created_at,
})

export const mapProgramTier = (row: Row): ProgramTier => ({
  id: row.id,
  programId: row.program_id,
  name: row.name,
  description: row.description,
  tierType: row.tier_type as TierType,
  monthlyCost: row.monthly_cost ? parseFloat(row.monthly_cost) : null,
  pointThreshold: row.point_threshold,
  spendThreshold: row.spend_threshold ? parseFloat(row.spend_threshold) : null,
  sortOrder: row.sort_order,
  color: row.color,
  icon: row.icon,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapTierPerk = (row: Row): TierPerk => ({
  id: row.id,
  tierId: row.tier_id,
  perkType: row.perk_type as PerkType,
  multiplier: row.multiplier ? parseFloat(row.multiplier) : null,
  discountPct: row.discount_pct ? parseFloat(row.discount_pct) : null,
  freeItemDesc: row.free_item_desc,
  description: row.description,
  createdAt: row.created_at,
})

export const mapReward = (row: Row): Reward => ({
  id: row.id,
  programId: row.program_id,
  name: row.name,
  description: row.description,
  pointCost: row.point_cost,
  imageUrl: row.image_url,
  isActive: row.is_active,
  quantityLimit: row.quantity_limit,
  expiresAt: row.expires_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapMemberProfile = (row: Row): MemberProfile => ({
  id: row.id,
  displayName: row.display_name,
  phone: row.phone,
  birthday: row.birthday,
  avatarUrl: row.avatar_url,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapMemberEnrollment = (row: Row): MemberEnrollment => ({
  id: row.id,
  memberId: row.member_id,
  programId: row.program_id,
  currentTierId: row.current_tier_id,
  tierExpiresAt: row.tier_expires_at,
  enrolledAt: row.enrolled_at,
})

export const mapPointLedgerEntry = (row: Row): PointLedgerEntry => ({
  id: row.id,
  enrollmentId: row.enrollment_id,
  amount: row.amount,
  ledgerType: row.ledger_type as LedgerType,
  referenceId: row.reference_id,
  description: row.description,
  createdAt: row.created_at,
})

export const mapTransaction = (row: Row): Transaction => ({
  id: row.id,
  enrollmentId: row.enrollment_id,
  amountSpent: parseFloat(row.amount_spent),
  pointsEarned: row.points_earned,
  checkedInAt: row.checked_in_at,
  recordedBy: row.recorded_by,
  locationNote: row.location_note,
})

export const mapRedemption = (row: Row): Redemption => ({
  id: row.id,
  enrollmentId: row.enrollment_id,
  rewardId: row.reward_id,
  pointsSpent: row.points_spent,
  redeemedAt: row.redeemed_at,
  fulfilledAt: row.fulfilled_at,
  fulfilledBy: row.fulfilled_by,
})
