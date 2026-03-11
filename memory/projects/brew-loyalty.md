# Project: Brew Loyalty

**Status:** Active — Phase 0 (Foundation)
**Started:** 2026-03-11
**Stack:** React Native (Expo) + Supabase + TypeScript

## Vision
A white-label B2B2C mobile loyalty platform sold to small/medium craft beverage businesses:
- Local breweries
- Wineries
- Coffee roasters

Business model: Open-source (self-hostable) + Derek provides paid setup/implementation services.

## Loyalty Mechanic
**MVP:** Points + Tiered Membership hybrid
- Members earn points per dollar spent
- Owners can define paid or threshold-based tiers
- Tiers unlock perks: point multipliers, free items, early access
- Inspired by: Cooper's Hawk Winery loyalty app

**Future:** Plugin-style loyalty mechanic system so owners can choose:
- Points only
- Punch card only
- Tiered membership only
- Points + Tiers (MVP default)

## User Roles
1. **Owner / Admin** — brewery/winery/cafe staff managing the program
2. **Member** — end customer using the mobile app

## Repo Structure (planned)
```
brew-loyalty/
├── apps/
│   ├── mobile/          # React Native (Expo) — member-facing app
│   └── admin/           # Web admin portal (future)
├── packages/
│   ├── types/           # Shared TypeScript types
│   └── utils/           # Shared utilities
├── supabase/
│   └── migrations/      # DB migrations
├── CLAUDE.md            # Hot memory cache
└── memory/              # Deep memory
```

## Phases
| Phase | Focus | Status |
|-------|-------|--------|
| 0 | Foundation: planning, DB setup, repo scaffold | 🔄 In Progress |
| 1 | Member auth + profile + home screen | ⬜ Pending |
| 2 | Points earning (QR check-in flow) | ⬜ Pending |
| 3 | Tier enrollment + management | ⬜ Pending |
| 4 | Rewards catalog + redemption | ⬜ Pending |
| 5 | Owner admin portal | ⬜ Pending |
| 6 | Multi-venue / multi-owner support | ⬜ Pending |
| 7 | Open-source packaging + docs | ⬜ Pending |

## Key Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-11 | React Native + Expo | Cross-platform, no IDE needed, strong ecosystem |
| 2026-03-11 | Supabase backend | Postgres, Auth, Realtime, MCP tools available |
| 2026-03-11 | MVP = Points + Tiers | Based on Cooper's Hawk model, most complete experience |
| 2026-03-11 | Abstracted LoyaltyProgram config | Enables future mechanic flexibility without rewrite |
| 2026-03-11 | Monorepo | Shared types across mobile + future web admin |
