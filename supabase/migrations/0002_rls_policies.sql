-- ============================================================
-- Migration: 0002_rls_policies
-- Description: Row Level Security policies for all tables.
--
-- Access model:
--   - Public (anon): read-only access to org + program info
--     (so members can find/join programs by slug)
--   - Authenticated members: read/write their own data only
--   - Service role: full access (used by Edge Functions)
--
-- Owner/admin access is intentionally deferred to Phase 5
-- (admin portal). For MVP, staff operations are performed
-- via service role in Edge Functions.
-- ============================================================

-- Enable RLS on all tables
alter table public.organizations         enable row level security;
alter table public.loyalty_programs      enable row level security;
alter table public.point_rules           enable row level security;
alter table public.program_tiers         enable row level security;
alter table public.tier_perks            enable row level security;
alter table public.reward_catalog        enable row level security;
alter table public.member_profiles       enable row level security;
alter table public.member_enrollments    enable row level security;
alter table public.point_ledger          enable row level security;
alter table public.transactions          enable row level security;
alter table public.redemptions           enable row level security;

-- ============================================================
-- ORGANIZATIONS — public read, no direct write from clients
-- ============================================================
create policy "orgs_public_read"
  on public.organizations for select
  using (true);

-- ============================================================
-- LOYALTY PROGRAMS — public read of active programs
-- ============================================================
create policy "programs_public_read"
  on public.loyalty_programs for select
  using (is_active = true);

-- ============================================================
-- POINT RULES — public read of active rules
-- ============================================================
create policy "point_rules_public_read"
  on public.point_rules for select
  using (is_active = true);

-- ============================================================
-- PROGRAM TIERS — public read
-- ============================================================
create policy "program_tiers_public_read"
  on public.program_tiers for select
  using (true);

-- ============================================================
-- TIER PERKS — public read
-- ============================================================
create policy "tier_perks_public_read"
  on public.tier_perks for select
  using (true);

-- ============================================================
-- REWARD CATALOG — public read of active rewards
-- ============================================================
create policy "reward_catalog_public_read"
  on public.reward_catalog for select
  using (is_active = true);

-- ============================================================
-- MEMBER PROFILES — members can read/update only their own
-- ============================================================
create policy "member_profiles_own_read"
  on public.member_profiles for select
  using (id = auth.uid());

create policy "member_profiles_own_insert"
  on public.member_profiles for insert
  with check (id = auth.uid());

create policy "member_profiles_own_update"
  on public.member_profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ============================================================
-- MEMBER ENROLLMENTS — members can read their own enrollments
-- Inserts happen via Edge Function (service role) on join
-- ============================================================
create policy "enrollments_own_read"
  on public.member_enrollments for select
  using (member_id = auth.uid());

-- Members can self-enroll (insert their own enrollment)
create policy "enrollments_own_insert"
  on public.member_enrollments for insert
  with check (member_id = auth.uid());

-- ============================================================
-- POINT LEDGER — members can read their own ledger entries
-- All writes go through Edge Functions (service role)
-- ============================================================
create policy "ledger_own_read"
  on public.point_ledger for select
  using (
    enrollment_id in (
      select id from public.member_enrollments
      where member_id = auth.uid()
    )
  );

-- ============================================================
-- TRANSACTIONS — members can read their own transactions
-- ============================================================
create policy "transactions_own_read"
  on public.transactions for select
  using (
    enrollment_id in (
      select id from public.member_enrollments
      where member_id = auth.uid()
    )
  );

-- ============================================================
-- REDEMPTIONS — members can read their own redemptions
-- ============================================================
create policy "redemptions_own_read"
  on public.redemptions for select
  using (
    enrollment_id in (
      select id from public.member_enrollments
      where member_id = auth.uid()
    )
  );

-- Members can insert their own redemptions (point deduction
-- validated by Edge Function before insert)
create policy "redemptions_own_insert"
  on public.redemptions for insert
  with check (
    enrollment_id in (
      select id from public.member_enrollments
      where member_id = auth.uid()
    )
  );
