# Brew Loyalty — Tasks

Last updated: 2026-03-11

## 🔄 In Progress

- [ ] **Phase 2: Points Earning** — member card QR, check-in Edge Function, real-time balance

## 📋 Phase 0 — Foundation ✅

- [x] Create project plan (PLAN.md)
- [x] Set up memory system (CLAUDE.md + memory/)
- [x] Create Supabase project (oxzbjzfjzagofbkribko, us-east-1)
- [x] Apply DB migrations: 0001_core_schema, 0002_rls_policies
- [x] Apply demo seed data (Ironwood Brewing Co.)
- [x] Scaffold Expo monorepo (apps/mobile, packages/types)
- [x] Create shared TypeScript types package (@brew-loyalty/types)
- [x] Repository pattern: IAuthProvider + IBrewLoyaltyServices interfaces
- [x] Supabase implementations: SupabaseAuthProvider + all repositories
- [x] App screens: sign-in, home, card, tiers, rewards (stubs)
- [x] Expo Router navigation: auth group + app tab group
- [x] Create GitHub repository (jensendp/brew-loyalty-open)
- [x] Add README stub
- [ ] Run `npm install` and `expo start` to verify

## 📋 Phase 1 — Member Auth & Profile ✅

- [x] Migration 0003: enrollment_code on loyalty_programs
- [x] useOnboardingStatus hook (loading → unauthenticated → needs-profile → needs-enrollment → ready)
- [x] useProfile hook (create member profile during onboarding)
- [x] useEnrollment hook (join program by enrollment code)
- [x] useHomeData hook (live points, tier, recent transactions)
- [x] Onboarding screens: profile.tsx + enroll.tsx
- [x] Root layout routing: full auth → onboard → app flow
- [x] Home screen wired to live Supabase data
- [x] Tests: useOnboardingStatus, useProfile, useEnrollment

## 📋 Phase 2 — Points Earning

- [ ] Member card screen with QR code
- [ ] Supabase Edge Function: process_checkin
- [ ] Point rule engine logic
- [ ] Point ledger write on check-in
- [ ] Real-time balance update hook

## 📋 Phase 3 — Tiers

- [ ] Tier display + progress screen
- [ ] Stripe integration for paid subscriptions
- [ ] Auto-promote logic for threshold tiers
- [ ] Tier badge + perk display components

## 📋 Phase 4 — Rewards & Redemption

- [ ] Reward catalog screen
- [ ] Redemption flow + one-time QR generation
- [ ] Staff fulfillment confirmation

## 📋 Phase 5 — Owner Admin Portal

- [ ] Choose framework (React Vite vs Next.js)
- [ ] Program configuration UI
- [ ] Member management table
- [ ] Transaction log
- [ ] Venue enrollment QR generator

## 📋 Phase 6 — Multi-Venue

- [ ] Multi-location support per org
- [ ] Location-specific vs shared programs

## 📋 Phase 7 — Open Source Launch

- [ ] Full README
- [ ] Self-hosting guide
- [ ] Contributing guide
- [ ] Demo seed data
- [ ] GitHub release v1.0

## 💡 Claude Skills / Automations (Meta Goals)

- [ ] Skill: `supabase-migration` — standardized DB migration generation
- [ ] Skill: `rn-component` — React Native component best practices
- [ ] Automation: Daily project standup summary
- [ ] Automation: Changelog entry generation
