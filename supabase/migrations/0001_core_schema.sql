-- ============================================================
-- Migration: 0001_core_schema
-- Description: Core Brew Loyalty schema — organizations, loyalty
--              programs, tiers, perks, rewards, members, and
--              the point ledger.
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- ORGANIZATIONS
-- The top-level tenant: a brewery, winery, or coffee roaster.
-- ============================================================
create table public.organizations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,   -- used for enrollment codes + URLs
  logo_url      text,
  primary_color text default '#000000', -- hex for app theming
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.organizations is 'Top-level tenant: a brewery, winery, or coffee roaster.';

-- ============================================================
-- LOYALTY PROGRAMS
-- An org's configured loyalty setup. One active program per org
-- for MVP; schema supports multiple for future flexibility.
-- ============================================================
create table public.loyalty_programs (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references public.organizations(id) on delete cascade,
  name          text not null,
  description   text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.loyalty_programs is 'Owner-configured loyalty setup: rules, tiers, and rewards.';

-- ============================================================
-- POINT RULES
-- Defines how and when members earn points.
-- rule_type drives the earning logic.
-- ============================================================
create type public.point_rule_type as enum (
  'per_dollar',       -- earn X points per dollar spent
  'per_visit',        -- earn X points per check-in regardless of spend
  'signup_bonus',     -- one-time bonus on first enrollment
  'birthday_bonus',   -- bonus points during birthday month
  'custom_event'      -- manually triggered by staff (e.g. trivia night)
);

create table public.point_rules (
  id                uuid primary key default gen_random_uuid(),
  program_id        uuid not null references public.loyalty_programs(id) on delete cascade,
  rule_type         public.point_rule_type not null,
  points_value      int not null check (points_value > 0),
  -- for per_dollar: minimum spend to earn points (0 = any amount)
  dollar_threshold  numeric(10,2) not null default 0,
  description       text,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now()
);
comment on table public.point_rules is 'Configurable rules for how members earn points.';

-- ============================================================
-- PROGRAM TIERS
-- Membership levels: paid subscriptions or earned thresholds.
-- ============================================================
create type public.tier_type as enum (
  'free',               -- base tier, auto-assigned on enrollment
  'paid_subscription',  -- member pays a recurring fee
  'threshold'           -- earned by accumulating points or spend
);

create table public.program_tiers (
  id               uuid primary key default gen_random_uuid(),
  program_id       uuid not null references public.loyalty_programs(id) on delete cascade,
  name             text not null,                -- e.g. "Hop Head", "Gold", "Wine Club"
  description      text,
  tier_type        public.tier_type not null,
  monthly_cost     numeric(10,2),               -- for paid_subscription tiers
  point_threshold  int,                          -- for threshold tiers (lifetime points)
  spend_threshold  numeric(10,2),               -- for threshold tiers (lifetime spend)
  sort_order       int not null default 0,       -- display order (0 = base)
  color            text default '#888888',       -- hex for UI tier badge
  icon             text,                         -- emoji or icon identifier
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint paid_tier_has_cost
    check (tier_type != 'paid_subscription' or monthly_cost is not null),
  constraint threshold_tier_has_threshold
    check (tier_type != 'threshold' or (point_threshold is not null or spend_threshold is not null))
);
comment on table public.program_tiers is 'Tier definitions: free base, paid subscriptions, or earned thresholds.';

-- ============================================================
-- TIER PERKS
-- Benefits unlocked by each tier.
-- ============================================================
create type public.perk_type as enum (
  'point_multiplier',  -- earn points faster (e.g. 2x)
  'free_item',         -- a free product credit
  'discount_pct',      -- percentage discount on purchases
  'event_access',      -- access to members-only events
  'custom'             -- owner-defined freeform perk
);

create table public.tier_perks (
  id              uuid primary key default gen_random_uuid(),
  tier_id         uuid not null references public.program_tiers(id) on delete cascade,
  perk_type       public.perk_type not null,
  multiplier      numeric(4,2),   -- for point_multiplier (e.g. 2.0 = 2x)
  discount_pct    numeric(5,2),   -- for discount_pct (e.g. 10.00 = 10%)
  free_item_desc  text,           -- for free_item
  description     text not null,  -- human-readable: "2x points on all purchases"
  created_at      timestamptz not null default now()
);
comment on table public.tier_perks is 'Perks attached to each tier (multipliers, free items, discounts, etc.).';

-- ============================================================
-- REWARD CATALOG
-- Redeemable rewards members can spend points on.
-- ============================================================
create table public.reward_catalog (
  id             uuid primary key default gen_random_uuid(),
  program_id     uuid not null references public.loyalty_programs(id) on delete cascade,
  name           text not null,             -- e.g. "Free Pint", "Tasting Flight"
  description    text,
  point_cost     int not null check (point_cost > 0),
  image_url      text,
  is_active      boolean not null default true,
  quantity_limit int,                        -- null = unlimited
  expires_at     timestamptz,               -- null = no expiry
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
comment on table public.reward_catalog is 'Owner-configured rewards members can redeem points for.';

-- ============================================================
-- MEMBER PROFILES
-- Extends Supabase auth.users with loyalty-specific profile data.
-- id mirrors auth.users.id exactly.
-- ============================================================
create table public.member_profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  phone         text,
  birthday      date,
  avatar_url    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.member_profiles is 'Loyalty profile data for each member, keyed to auth.users.';

-- ============================================================
-- MEMBER ENROLLMENTS
-- Junction between a member and an org's loyalty program.
-- One row per member per program.
-- ============================================================
create table public.member_enrollments (
  id               uuid primary key default gen_random_uuid(),
  member_id        uuid not null references public.member_profiles(id) on delete cascade,
  program_id       uuid not null references public.loyalty_programs(id) on delete cascade,
  current_tier_id  uuid references public.program_tiers(id) on delete set null,
  tier_expires_at  timestamptz,       -- for paid subscription tiers
  enrolled_at      timestamptz not null default now(),
  unique (member_id, program_id)
);
comment on table public.member_enrollments is 'Member enrollment in a loyalty program. One row per member per program.';

-- ============================================================
-- POINT LEDGER
-- Immutable, append-only log of all point movements.
-- Never update or delete rows — always append.
-- Balance = sum(amount) for an enrollment_id.
-- ============================================================
create type public.ledger_type as enum (
  'earn_purchase',   -- points from a purchase
  'earn_visit',      -- points from a check-in (no spend)
  'earn_bonus',      -- signup, birthday, or custom event bonus
  'redeem',          -- points spent on a reward
  'adjustment',      -- manual staff correction
  'expire'           -- points expired by owner policy
);

create table public.point_ledger (
  id             uuid primary key default gen_random_uuid(),
  enrollment_id  uuid not null references public.member_enrollments(id) on delete cascade,
  amount         int not null,           -- positive = earned, negative = spent/expired
  ledger_type    public.ledger_type not null,
  reference_id   uuid,                   -- FK to transactions or redemptions (app-enforced)
  description    text,
  created_at     timestamptz not null default now()
);
comment on table public.point_ledger is 'Immutable point ledger. Append-only. Balance = sum(amount) per enrollment.';

-- Prevent updates and deletes on the ledger (immutability guarantee)
create or replace function public.prevent_ledger_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'point_ledger rows are immutable — use append-only inserts';
end;
$$;

create trigger point_ledger_no_update
  before update on public.point_ledger
  for each row execute function public.prevent_ledger_mutation();

create trigger point_ledger_no_delete
  before delete on public.point_ledger
  for each row execute function public.prevent_ledger_mutation();

-- ============================================================
-- TRANSACTIONS
-- Purchase / check-in records that trigger point earning.
-- ============================================================
create table public.transactions (
  id             uuid primary key default gen_random_uuid(),
  enrollment_id  uuid not null references public.member_enrollments(id) on delete cascade,
  amount_spent   numeric(10,2) not null default 0,
  points_earned  int not null default 0,
  checked_in_at  timestamptz not null default now(),
  recorded_by    uuid references auth.users(id) on delete set null,
  location_note  text          -- optional: "Main bar", "Taproom", etc.
);
comment on table public.transactions is 'Purchase and check-in records. Source of point earning events.';

-- ============================================================
-- REDEMPTIONS
-- Records of members exchanging points for rewards.
-- ============================================================
create table public.redemptions (
  id             uuid primary key default gen_random_uuid(),
  enrollment_id  uuid not null references public.member_enrollments(id) on delete cascade,
  reward_id      uuid not null references public.reward_catalog(id) on delete restrict,
  points_spent   int not null check (points_spent > 0),
  redeemed_at    timestamptz not null default now(),
  fulfilled_at   timestamptz,   -- null = pending staff fulfillment
  fulfilled_by   uuid references auth.users(id) on delete set null
);
comment on table public.redemptions is 'Point redemptions. fulfilled_at is set by staff on fulfillment.';

-- ============================================================
-- VIEWS — Computed balances and stats
-- ============================================================

-- Current point balance per enrollment
create or replace view public.member_point_balances as
  select
    enrollment_id,
    coalesce(sum(amount), 0)::int as balance
  from public.point_ledger
  group by enrollment_id;
comment on view public.member_point_balances is 'Current point balance per enrollment (sum of ledger).';

-- Lifetime spend per enrollment
create or replace view public.member_lifetime_spend as
  select
    enrollment_id,
    coalesce(sum(amount_spent), 0) as lifetime_spend,
    count(*) as visit_count
  from public.transactions
  group by enrollment_id;
comment on view public.member_lifetime_spend is 'Lifetime spend and visit count per enrollment.';

-- ============================================================
-- INDEXES — Performance for common queries
-- ============================================================
create index idx_loyalty_programs_org_id on public.loyalty_programs(org_id);
create index idx_point_rules_program_id on public.point_rules(program_id);
create index idx_program_tiers_program_id on public.program_tiers(program_id);
create index idx_tier_perks_tier_id on public.tier_perks(tier_id);
create index idx_reward_catalog_program_id on public.reward_catalog(program_id);
create index idx_member_enrollments_member_id on public.member_enrollments(member_id);
create index idx_member_enrollments_program_id on public.member_enrollments(program_id);
create index idx_point_ledger_enrollment_id on public.point_ledger(enrollment_id);
create index idx_point_ledger_created_at on public.point_ledger(created_at);
create index idx_transactions_enrollment_id on public.transactions(enrollment_id);
create index idx_redemptions_enrollment_id on public.redemptions(enrollment_id);

-- ============================================================
-- updated_at auto-maintenance
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_organizations
  before update on public.organizations
  for each row execute function public.set_updated_at();

create trigger set_updated_at_loyalty_programs
  before update on public.loyalty_programs
  for each row execute function public.set_updated_at();

create trigger set_updated_at_program_tiers
  before update on public.program_tiers
  for each row execute function public.set_updated_at();

create trigger set_updated_at_reward_catalog
  before update on public.reward_catalog
  for each row execute function public.set_updated_at();

create trigger set_updated_at_member_profiles
  before update on public.member_profiles
  for each row execute function public.set_updated_at();
