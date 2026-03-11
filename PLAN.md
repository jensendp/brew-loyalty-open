# Brew Loyalty — Project Plan

**Version:** 0.1 — Initial Planning
**Date:** 2026-03-11
**Status:** Active

---

## 1. Product Vision

Brew Loyalty is a white-label B2B2C mobile loyalty platform for small to medium craft beverage businesses — breweries, wineries, and coffee roasters. It gives customers a digital loyalty experience (points, tiers, rewards) and gives owners a powerful-yet-simple admin portal to configure and manage their program.

**Business Model — Tiered:**

| Tier | Who | What | Cost to Owner |
|------|-----|------|---------------|
| **DIY** | Technical owners / devs | Fork repo, self-host on own Supabase + Expo | Free (infra only) |
| **Scripted Deploy** | Semi-technical owners | "Deploy to Supabase" button + setup guide in README | Free (infra only) |
| **Derek's Service** | Non-technical owners | Derek sets up, customizes, brands, and launches | Paid (setup fee) |
| **Hosted SaaS** *(future)* | Any owner | Derek runs everything, owner just uses the app | Monthly subscription |

**Key insight:** Tiers 1 and 2 are open-source deliverables. They don't compete with Derek's service — they serve a different buyer and actually validate the platform. The `supabase/` directory in the repo is a first-class deliverable: idempotent migrations, RLS policies, seed/demo data, and a one-button Supabase deploy. Tier 3 is selling time and expertise to owners who don't want to think about infrastructure.

**Inspiration:** Cooper's Hawk Winery loyalty app — a mature example of points + tiered membership done well in the beverage space.

---

## 2. Users & Personas

### Persona 1: The Owner (Admin)
- **Who:** Owner or manager at a local brewery, winery, or coffee roaster
- **Technical level:** Low to moderate
- **Goal:** Increase repeat visits, reward loyal customers, drive membership revenue
- **Pain points:** Can't afford enterprise loyalty platforms, don't have dev resources
- **Devices:** Desktop/tablet for admin work

### Persona 2: The Member (Customer)
- **Who:** A regular or aspiring regular at a local craft beverage spot
- **Technical level:** Moderate — comfortable with apps like Starbucks, Untappd
- **Goal:** Get rewarded for their spending, feel like a VIP
- **Pain points:** Too many loyalty apps, wants simplicity
- **Devices:** Smartphone (iOS or Android)

---

## 3. Core Features — MVP

### Member App (React Native / Expo)
| Feature | Description | Priority |
|---------|-------------|----------|
| Auth | Sign up / sign in via magic link (email) | P0 |
| Member Home | Points balance, tier status, active rewards | P0 |
| Member Card | QR code for staff to scan at POS | P0 |
| Points History | Chronological ledger of earnings/redemptions | P1 |
| Tier Progress | Visual progress toward next tier, current perks | P1 |
| Reward Catalog | Browse and redeem available rewards | P1 |
| Enrollment | Join a loyalty program by scanning venue QR or code | P1 |
| Profile | Name, email, birthday (for birthday perks) | P1 |
| Notifications | Push: reward unlocked, tier upgrade, birthday perk | P2 |

### Owner Admin Portal (Web — Phase 5)
| Feature | Description | Priority |
|---------|-------------|----------|
| Program Setup | Configure org name, logo, color scheme | P0 |
| Loyalty Config | Set point rules (rate per $), tier definitions | P0 |
| Tier Builder | Create tiers: name, cost/threshold, perks | P0 |
| Reward Builder | Create redeemable rewards with point cost | P0 |
| Member List | View enrolled members, tier, points balance | P1 |
| Transaction Log | See all check-ins and point movements | P1 |
| Manual Award | Grant points manually to a member | P1 |
| Venue QR | Generate venue enrollment QR code | P1 |
| Analytics | Visit frequency, top members, redemption rates | P2 |

---

## 4. Loyalty Mechanic Design

### Cooper's Hawk Reference Points
- $1 spent = 1 point
- 350 points = $25 dining reward (auto-applied)
- Ambassador tier: earned by annual spend + tenure
- Ambassador Elite: higher threshold
- Birthday reward: free entrée loaded 30 days before birthday
- Monthly wine club: choose bottle count + type, tasting included

### Brew Loyalty MVP Mechanic
```
LoyaltyProgram (per org)
  └── PointRules[]          → How points are earned (per $, per visit, bonus events)
  └── ProgramTiers[]        → Tier definitions
        └── TierPerks[]     → What each tier gives (multiplier, discount, free item)
  └── RewardCatalog[]       → What points can be redeemed for
```

**Point Earning Examples:**
- 1 point per $1 spent (configurable rate)
- Bonus: 50 points for first check-in
- Bonus: 100 points on birthday month
- Multiplier: Gold tier members earn 2x

**Tier Types (both supported):**
1. **Paid Subscription Tier** — Member pays $X/month for tier access (e.g., "Hop Club — $12/mo")
2. **Threshold Tier** — Member earns tier by accumulating enough points or spending enough (e.g., "Gold — 500 pts lifetime")

**Example Tier Structure (for a brewery):**
| Tier | Type | Cost/Threshold | Perks |
|------|------|----------------|-------|
| Member | Free | Auto on signup | 1x points |
| Hop Head | Paid | $8/mo | 1.5x points, monthly pint credit |
| Brew Master | Paid | $15/mo | 2x points, monthly pint + growler fill, event priority |
| Legend | Threshold | 2,000 lifetime pts | 2.5x, free birthday flight, VIP events |

---

## 5. Data Model — MVP

### Core Tables

```sql
-- Multi-tenant organization
organizations
  id            uuid PK
  name          text
  slug          text UNIQUE         -- for URLs/enrollment codes
  logo_url      text
  primary_color text                -- hex for theming
  created_at    timestamptz

-- The loyalty program config per org
loyalty_programs
  id            uuid PK
  org_id        uuid FK → organizations
  name          text
  description   text
  is_active     bool DEFAULT true
  created_at    timestamptz

-- Rules for how points are earned
point_rules
  id            uuid PK
  program_id    uuid FK → loyalty_programs
  rule_type     text    -- 'per_dollar', 'per_visit', 'birthday_bonus', 'signup_bonus'
  points_value  int     -- points awarded
  dollar_threshold numeric  -- for per_dollar: min spend to trigger
  multiplier    numeric DEFAULT 1.0
  description   text
  is_active     bool DEFAULT true

-- Tier definitions
program_tiers
  id            uuid PK
  program_id    uuid FK → loyalty_programs
  name          text                -- "Hop Head", "Gold", etc.
  description   text
  tier_type     text    -- 'free', 'paid_subscription', 'threshold'
  monthly_cost  numeric             -- if paid_subscription
  point_threshold int               -- if threshold
  sort_order    int                 -- display order
  color         text                -- hex for UI badging
  icon          text                -- emoji or icon name

-- Perks per tier
tier_perks
  id            uuid PK
  tier_id       uuid FK → program_tiers
  perk_type     text    -- 'point_multiplier', 'free_item', 'discount_pct', 'event_access'
  multiplier    numeric             -- if point_multiplier
  discount_pct  numeric             -- if discount_pct
  free_item_desc text              -- if free_item
  description   text               -- human-readable perk description

-- Redeemable rewards catalog
reward_catalog
  id            uuid PK
  program_id    uuid FK → loyalty_programs
  name          text                -- "Free Pint", "Tasting Flight"
  description   text
  point_cost    int
  image_url     text
  is_active     bool DEFAULT true
  quantity_limit int                -- null = unlimited
  expires_at    timestamptz         -- null = no expiry

-- Members (profile layer on top of auth.users)
member_profiles
  id            uuid PK = auth.users.id
  display_name  text
  phone         text
  birthday      date
  avatar_url    text
  created_at    timestamptz

-- Member enrollment in an org's program
member_enrollments
  id            uuid PK
  member_id     uuid FK → member_profiles
  program_id    uuid FK → loyalty_programs
  enrolled_at   timestamptz
  current_tier_id uuid FK → program_tiers (nullable, null = base/free)
  tier_expires_at timestamptz       -- for paid subs
  UNIQUE (member_id, program_id)

-- Immutable point ledger (append-only)
point_ledger
  id            uuid PK
  enrollment_id uuid FK → member_enrollments
  amount        int                 -- positive = earned, negative = spent
  ledger_type   text    -- 'earn_purchase', 'earn_bonus', 'earn_birthday', 'redeem', 'adjust', 'expire'
  reference_id  uuid                -- FK to transaction or redemption
  description   text
  created_at    timestamptz

-- Purchase/check-in transactions
transactions
  id            uuid PK
  enrollment_id uuid FK → member_enrollments
  amount_spent  numeric             -- dollar amount
  points_earned int
  checked_in_at timestamptz
  recorded_by   uuid                -- staff user id
  location_note text               -- optional

-- Reward redemptions
redemptions
  id            uuid PK
  enrollment_id uuid FK → member_enrollments
  reward_id     uuid FK → reward_catalog
  points_spent  int
  redeemed_at   timestamptz
  fulfilled_at  timestamptz         -- null = pending fulfillment
  fulfilled_by  uuid                -- staff user id
```

### Computed / Derived (via Postgres views or functions)
```sql
-- Current points balance per enrollment
member_point_balance(enrollment_id) → sum(point_ledger.amount)

-- Lifetime spend per enrollment
member_lifetime_spend(enrollment_id) → sum(transactions.amount_spent)

-- Progress toward next tier threshold
member_tier_progress(enrollment_id) → computed from point_balance + lifetime_spend
```

---

## 6. Architecture

### Open-Source Backend Portability

Brew Loyalty is designed to be backend-agnostic. The default implementation uses Supabase,
but any backend can be swapped in by implementing the service interfaces in `packages/types`.

**The rule:** App code (`apps/`) NEVER imports Supabase directly.
It only uses interfaces from `packages/types` via React context.

```
App Screen
    │
    │  useServices() hook
    ▼
ServiceContext  ──────────────────────────────────────────┐
    │                                                      │
    │  IAuthProvider              ILoyaltyRepository       │
    │  IPointsRepository          IRewardRepository        │
    ▼                                                      │
SupabaseAuthProvider         SupabaseLoyaltyRepository     │  ← Default implementation
SupabasePointsRepository     SupabaseRewardRepository      │    (swap for Firebase, etc.)
    │                                                      │
    ▼                                                 (same interfaces,
Supabase SDK                                         different backends)
```

A contributor wanting to use Firebase writes `FirebaseLoyaltyRepository implements ILoyaltyRepository`,
updates `providers.ts`, and the entire app works without touching a single screen.

### Monorepo Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Brew Loyalty Monorepo                     │
│                                                             │
│  apps/                                                      │
│  ├── mobile/              React Native (Expo)               │
│  │   └── src/                                               │
│  │       ├── screens/     (Home, Card, Tiers, Rewards...)   │
│  │       ├── components/  (shared UI primitives)            │
│  │       ├── hooks/       (useAuth, usePoints, useServices) │
│  │       ├── lib/                                           │
│  │       │   ├── supabase/    ← Supabase implementations    │
│  │       │   │   ├── SupabaseAuthProvider.ts                │
│  │       │   │   ├── SupabaseLoyaltyRepository.ts           │
│  │       │   │   └── client.ts                              │
│  │       │   └── providers.ts ← Wires up implementations    │
│  │       └── navigation/  (React Navigation stack)          │
│  └── admin/               (Phase 5 — web portal)            │
│                                                             │
│  packages/                                                  │
│  ├── types/               ← NO Supabase imports ever        │
│  │   └── src/                                               │
│  │       ├── models.ts    (plain TS interfaces for all data) │
│  │       ├── repositories.ts (ILoyaltyRepository, etc.)     │
│  │       └── auth.ts      (IAuthProvider interface)         │
│  └── utils/               Shared pure utilities             │
│                                                             │
│  supabase/                                                  │
│  └── migrations/          SQL migration files               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼  (default implementation)
                ┌─────────────────────────┐
                │         Supabase         │
                │  ● PostgreSQL + RLS      │
                │  ● Auth (magic link)     │
                │  ● Storage (images)      │
                │  ● Realtime              │
                │  ● Edge Functions        │
                └─────────────────────────┘
```

### Core Service Interfaces (in packages/types)

```typescript
// IAuthProvider — swap Supabase Auth for anything
interface IAuthProvider {
  signInWithMagicLink(email: string): Promise<void>
  signOut(): Promise<void>
  getSession(): Promise<Session | null>
  onAuthStateChange(cb: (session: Session | null) => void): Unsubscribe
}

// ILoyaltyRepository — all loyalty data operations
interface ILoyaltyRepository {
  getOrganization(id: string): Promise<Organization>
  getLoyaltyProgram(orgId: string): Promise<LoyaltyProgram>
  getMemberProfile(userId: string): Promise<MemberProfile>
  getEnrollment(memberId: string, programId: string): Promise<MemberEnrollment>
  getPointBalance(enrollmentId: string): Promise<number>
  getPointHistory(enrollmentId: string): Promise<PointLedgerEntry[]>
  getTiers(programId: string): Promise<ProgramTier[]>
  getRewardCatalog(programId: string): Promise<Reward[]>
  redeemReward(enrollmentId: string, rewardId: string): Promise<Redemption>
}
```

---

## 7. Development Phases & Milestones

### Phase 0 — Foundation (Current)
- [x] Project planning document
- [x] Memory system (CLAUDE.md)
- [ ] Supabase project creation
- [ ] DB migrations (core tables)
- [ ] RLS policies
- [ ] Expo project scaffold
- [ ] Monorepo structure + shared types
- [ ] GitHub repo creation

### Phase 1 — Member Auth & Profile
- [ ] Supabase Auth (magic link flow)
- [ ] Onboarding screens (name, birthday)
- [ ] Enrollment screen (join by org code)
- [ ] Member home screen (stub)

### Phase 2 — Points Earning
- [ ] QR code display (member card screen)
- [ ] Staff check-in flow (simple web page or admin scan)
- [ ] Point rule engine (server-side via Edge Function)
- [ ] Point ledger writes
- [ ] Live balance update on home screen

### Phase 3 — Tiers
- [ ] Tier enrollment UI
- [ ] Paid tier: Stripe integration for subscriptions
- [ ] Threshold tier: auto-promotion logic
- [ ] Tier badge + perks display

### Phase 4 — Rewards & Redemption
- [ ] Reward catalog screen
- [ ] Redemption flow (generate one-time QR)
- [ ] Staff fulfillment confirmation

### Phase 5 — Owner Admin Portal
- [ ] Web app (React or Next.js)
- [ ] Program configuration UI
- [ ] Member management
- [ ] Transaction log
- [ ] Venue QR generator

### Phase 6 — Multi-Venue / Multi-Org
- [ ] Multiple locations per org
- [ ] Shared vs. location-specific programs

### Phase 7 — Open Source Launch
- [ ] README + docs
- [ ] Self-hosting guide (Docker + Supabase self-hosted)
- [ ] Contributing guide
- [ ] Demo seed data
- [ ] GitHub release

---

## 8. Claude Development Goals (Meta)

Part of this project is learning to build Claude skills and automations. Planned alongside the app:

| Tool/Skill | Purpose |
|------------|---------|
| `supabase-migration` skill | Standardized pattern for writing and applying DB migrations |
| `rn-component` skill | Best practices for React Native component generation |
| `pr-review` automation | Auto-review Claude-generated code for issues |
| `changelog` automation | Auto-generate CHANGELOG entries from git commits |
| Scheduled task | Daily project standup — summarize open tasks + blockers |

---

## 9. Open Source Strategy

- **License:** MIT
- **Repo:** `github.com/derekjensen/brew-loyalty` (or similar)
- **Target audience for DIY:** Tech-savvy bar/brewery owners or their developer friends

### Scripted Backend Deploy (built alongside the app)
The `supabase/` directory is a packaged, deployable backend:
```
supabase/
├── migrations/         All schema migrations (numbered, idempotent)
├── seed/
│   └── demo.sql        Demo org + program + tiers + rewards for testing
├── functions/          Edge functions (point processing, etc.)
└── README.md           Self-hosting guide
```
The repo README will include a **"Deploy to Supabase"** button (native Supabase feature) that provisions the entire backend into any Supabase account with one click. Owner still needs to build/deploy the Expo app — which is where Derek's service fills the gap for non-technical owners.

### Derek's Value-Add (paid service)
- End-to-end setup (Supabase provisioning + Expo build + App Store submission)
- Custom branding (logo, colors, app name)
- Custom tier/reward configuration
- Ongoing support, feature requests, and maintenance
- Future: hosted/managed option (owner never touches infrastructure)

### Why open-sourcing doesn't undercut the service business
Most small brewery/winery owners are not developers. The open-source offering serves a completely different buyer (their technically inclined friend or employee). For the owner who just wants it to work, Derek's service is the product. This is the same model as WordPress, Ghost, and dozens of other successful open-source businesses.

---

## 10. Key Questions & Open Items

| # | Question | Status |
|---|----------|--------|
| 1 | Stripe for paid tier subscriptions — confirm plan | Open |
| 2 | Push notifications: Expo Push or a dedicated service? | Open |
| 3 | Admin portal: React (Vite) or Next.js? | Open |
| 4 | GitHub org vs personal account for repo? | Open |
| 5 | App icon / branding for the platform shell? | Open |
| 6 | Multi-language support needed for MVP? | Open |
