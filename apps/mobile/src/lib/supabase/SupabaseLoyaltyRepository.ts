import type {
  IEnrollmentRepository,
  ILoyaltyProgramRepository,
  IMemberRepository,
  IOrganizationRepository,
  IPointsRepository,
  IRedemptionRepository,
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
} from '@brew-loyalty/types'
import { supabase } from './client'
import {
  mapLoyaltyProgram,
  mapMemberEnrollment,
  mapMemberProfile,
  mapOrganization,
  mapPointLedgerEntry,
  mapPointRule,
  mapProgramTier,
  mapRedemption,
  mapReward,
  mapTierPerk,
  mapTransaction,
} from './mappers'

// ─────────────────────────────────────────────────────────────
// ORGANIZATION
// ─────────────────────────────────────────────────────────────

export class SupabaseOrganizationRepository implements IOrganizationRepository {
  async getOrganizationBySlug(slug: string): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return mapOrganization(data)
  }

  async getOrganization(id: string): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return mapOrganization(data)
  }
}

// ─────────────────────────────────────────────────────────────
// LOYALTY PROGRAM
// ─────────────────────────────────────────────────────────────

export class SupabaseLoyaltyProgramRepository implements ILoyaltyProgramRepository {
  async getLoyaltyProgram(orgId: string): Promise<LoyaltyProgram> {
    const { data, error } = await supabase
      .from('loyalty_programs')
      .select('*')
      .eq('org_id', orgId)
      .eq('is_active', true)
      .single()
    if (error) throw error
    return mapLoyaltyProgram(data)
  }

  async getProgramByEnrollmentCode(code: string): Promise<LoyaltyProgram | null> {
    const { data, error } = await supabase
      .from('loyalty_programs')
      .select('*')
      .eq('enrollment_code', code.trim().toUpperCase())
      .eq('is_active', true)
      .maybeSingle()
    if (error) throw error
    return data ? mapLoyaltyProgram(data) : null
  }

  async getPointRules(programId: string): Promise<PointRule[]> {
    const { data, error } = await supabase
      .from('point_rules')
      .select('*')
      .eq('program_id', programId)
      .eq('is_active', true)
    if (error) throw error
    return (data ?? []).map(mapPointRule)
  }

  async getTiers(programId: string): Promise<ProgramTierWithPerks[]> {
    const { data, error } = await supabase
      .from('program_tiers')
      .select(`*, tier_perks(*)`)
      .eq('program_id', programId)
      .order('sort_order', { ascending: true })
    if (error) throw error
    return (data ?? []).map((row) => ({
      ...mapProgramTier(row),
      perks: (row.tier_perks ?? []).map(mapTierPerk),
    }))
  }

  async getRewardCatalog(programId: string): Promise<Reward[]> {
    const { data, error } = await supabase
      .from('reward_catalog')
      .select('*')
      .eq('program_id', programId)
      .eq('is_active', true)
      .order('point_cost', { ascending: true })
    if (error) throw error
    return (data ?? []).map(mapReward)
  }
}

// ─────────────────────────────────────────────────────────────
// MEMBER PROFILE
// ─────────────────────────────────────────────────────────────

export class SupabaseMemberRepository implements IMemberRepository {
  async getMemberProfile(userId: string): Promise<MemberProfile | null> {
    const { data, error } = await supabase
      .from('member_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    if (error) throw error
    return data ? mapMemberProfile(data) : null
  }

  async createMemberProfile(
    profile: Pick<MemberProfile, 'id' | 'displayName' | 'phone' | 'birthday'>
  ): Promise<MemberProfile> {
    const { data, error } = await supabase
      .from('member_profiles')
      .insert({
        id: profile.id,
        display_name: profile.displayName,
        phone: profile.phone,
        birthday: profile.birthday,
      })
      .select()
      .single()
    if (error) throw error
    return mapMemberProfile(data)
  }

  async updateMemberProfile(
    userId: string,
    updates: Partial<Pick<MemberProfile, 'displayName' | 'phone' | 'birthday' | 'avatarUrl'>>
  ): Promise<MemberProfile> {
    const { data, error } = await supabase
      .from('member_profiles')
      .update({
        ...(updates.displayName !== undefined && { display_name: updates.displayName }),
        ...(updates.phone !== undefined && { phone: updates.phone }),
        ...(updates.birthday !== undefined && { birthday: updates.birthday }),
        ...(updates.avatarUrl !== undefined && { avatar_url: updates.avatarUrl }),
      })
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return mapMemberProfile(data)
  }
}

// ─────────────────────────────────────────────────────────────
// ENROLLMENT
// ─────────────────────────────────────────────────────────────

export class SupabaseEnrollmentRepository implements IEnrollmentRepository {
  async getEnrollment(
    memberId: string,
    programId: string
  ): Promise<MemberEnrollmentWithTier | null> {
    const { data, error } = await supabase
      .from('member_enrollments')
      .select(`*, program_tiers(*)`)
      .eq('member_id', memberId)
      .eq('program_id', programId)
      .maybeSingle()
    if (error) throw error
    if (!data) return null
    return {
      ...mapMemberEnrollment(data),
      currentTier: data.program_tiers ? mapProgramTier(data.program_tiers) : null,
    }
  }

  async getMemberEnrollments(memberId: string): Promise<MemberEnrollmentWithTier[]> {
    const { data, error } = await supabase
      .from('member_enrollments')
      .select(`*, program_tiers(*)`)
      .eq('member_id', memberId)
      .order('enrolled_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((row) => ({
      ...mapMemberEnrollment(row),
      currentTier: row.program_tiers ? mapProgramTier(row.program_tiers) : null,
    }))
  }

  async enrollMember(memberId: string, programId: string): Promise<MemberEnrollment> {
    // Upsert — idempotent, returns existing enrollment if already enrolled
    const { data, error } = await supabase
      .from('member_enrollments')
      .upsert(
        { member_id: memberId, program_id: programId },
        { onConflict: 'member_id,program_id', ignoreDuplicates: false }
      )
      .select()
      .single()
    if (error) throw error
    return mapMemberEnrollment(data)
  }
}

// ─────────────────────────────────────────────────────────────
// POINTS
// ─────────────────────────────────────────────────────────────

export class SupabasePointsRepository implements IPointsRepository {
  async getPointBalance(enrollmentId: string): Promise<number> {
    const { data, error } = await supabase
      .from('member_point_balances')  // uses the view
      .select('balance')
      .eq('enrollment_id', enrollmentId)
      .maybeSingle()
    if (error) throw error
    return data?.balance ?? 0
  }

  async getPointHistory(
    enrollmentId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<PointLedgerEntry[]> {
    const { limit = 50, offset = 0 } = options
    const { data, error } = await supabase
      .from('point_ledger')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    if (error) throw error
    return (data ?? []).map(mapPointLedgerEntry)
  }

  async getTransactions(
    enrollmentId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<Transaction[]> {
    const { limit = 50, offset = 0 } = options
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('checked_in_at', { ascending: false })
      .range(offset, offset + limit - 1)
    if (error) throw error
    return (data ?? []).map(mapTransaction)
  }
}

// ─────────────────────────────────────────────────────────────
// REDEMPTIONS
// ─────────────────────────────────────────────────────────────

export class SupabaseRedemptionRepository implements IRedemptionRepository {
  async getRedemptions(enrollmentId: string): Promise<RedemptionWithReward[]> {
    const { data, error } = await supabase
      .from('redemptions')
      .select(`*, reward_catalog(*)`)
      .eq('enrollment_id', enrollmentId)
      .order('redeemed_at', { ascending: false })
    if (error) throw error
    return (data ?? []).map((row) => ({
      ...mapRedemption(row),
      reward: mapReward(row.reward_catalog),
    }))
  }

  async redeemReward(enrollmentId: string, rewardId: string): Promise<Redemption> {
    // Validate sufficient balance and insert redemption + ledger entry
    // in a single Edge Function call (atomic, server-side validated).
    // TODO Phase 4: replace with Edge Function call
    const { data, error } = await supabase
      .from('redemptions')
      .insert({ enrollment_id: enrollmentId, reward_id: rewardId, points_spent: 0 })
      .select()
      .single()
    if (error) throw error
    return mapRedemption(data)
  }
}
