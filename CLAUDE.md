# Brew Loyalty — Project Memory

## Me
Derek, seasoned engineer (20+ yrs). Building Brew Loyalty solo, no IDE — all via Claude.
Goal: ship, open-source it, sell implementation services to small/medium breweries, wineries, coffee roasters.

## Project
| Name | What |
|------|------|
| **Brew Loyalty** | B2B2C mobile loyalty platform for craft beverage businesses |
| **Stack** | React Native (Expo) + Supabase + TypeScript |
| **Repo** | TBD — GitHub, open source (MIT) |
| **Model** | 4-tier: DIY → Scripted Deploy → Derek's Setup Service → Future SaaS |
| **supabase/ dir** | First-class deliverable: migrations + seed + "Deploy to Supabase" button |
| **Supabase Project ID** | oxzbjzfjzagofbkribko (us-east-1) |
→ Details: memory/projects/brew-loyalty.md

## Key Terms
| Term | Meaning |
|------|---------|
| **Owner** | The brewery/winery/coffee roaster running the loyalty program |
| **Member** | End customer using the app |
| **Program** | An owner's configured loyalty setup (points rules + tiers) |
| **Points** | Currency earned by members for purchases |
| **Tier** | Paid or earned membership level with bonus perks (e.g. Silver, Gold) |
| **Perk** | Benefit attached to a tier (free item, multiplier, early access) |
| **Redemption** | Exchanging points for a reward |
| **Reward** | Configurable item a member can redeem points for |
| **Check-in** | Member scanning QR at venue to log a visit or purchase |
| **MVP** | Minimum viable product — points + tiered membership, single owner |
| **Plugin** | Self-contained extension that adds tabs/features to the app |
| **EventBus** | In-app pub/sub for lifecycle events (points.earned, tier.changed, etc.) |
→ Full glossary: memory/glossary.md

## Loyalty Mechanic (MVP)
- **Points**: Members earn points per dollar spent (configurable rate per owner)
- **Tiers**: Owners define paid or points-threshold tiers (e.g. Wine Club Silver $15/mo)
- **Perks**: Each tier unlocks multipliers, free items, early access, etc.
- **Abstraction**: All mechanics are driven by owner-configured `LoyaltyProgram` — future owners can swap mechanic type
- **Inspiration**: Cooper's Hawk Winery loyalty + wine club app

## Architecture Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Mobile framework | React Native (Expo) | Cross-platform, JS/TS, no IDE needed |
| Backend (default) | Supabase | Postgres + Auth + Realtime, MCP tools available |
| Language | TypeScript | Type safety, Claude generates better typed code |
| Monorepo | Yes (apps/ + packages/) | Shared types between mobile + future web admin |
| Auth | Supabase Auth (magic link + OAuth) | Passwordless friendly for end consumers |
| Backend abstraction | Repository pattern | App code talks to interfaces, not Supabase directly — swappable |
| Data types | Plain TS interfaces in packages/types | Zero Supabase imports in types package — backend-agnostic |
| Plugin system | BrewLoyaltyPlugin interface + PluginRegistry | Extensions declare tabs/hooks, loaded at startup |
| App events | IEventBus pub/sub | Decouples core app from plugins and feature extensions |
| Testing | Jest + React Native Testing Library | Co-located tests, mock ServiceProvider for UI tests |
| Commits | Conventional Commits | Machine-readable history, auto-changelog generation |

## Development Workflow
- All code written by Claude, reviewed by Derek in folder
- No IDE — Claude generates files directly to workspace
- Supabase managed entirely via MCP tools (no Supabase CLI needed)
- Git commits reviewed and pushed by Derek
- Skills + automations built alongside the app as learning exercises
- **Tests required**: every non-trivial function, hook, and component gets a test
- **Flag automations**: Claude proactively flags skill/automation opportunities as they arise
- **Commit handshake**: Before moving to any new phase or major feature, Claude provides the exact commit sequence (message + files) for Derek to review and push. Work does not advance until commits are handed off.

## Preferences
- Clean, minimal abstractions — no over-engineering
- TypeScript strict mode
- Functional components, hooks — no class components
- Descriptive variable names over comments
- Tests co-located with source (`*.test.ts` / `*.test.tsx`)
- Conventional Commits for all commit messages
- Each session: update CLAUDE.md with decisions made

## Open Source Standards
- CONTRIBUTING.md — how to contribute, PR process, branch strategy
- CODE_OF_CONDUCT.md — Contributor Covenant
- .github/PULL_REQUEST_TEMPLATE.md
- .github/ISSUE_TEMPLATE/ (bug, feature)
- CHANGELOG.md — Conventional Commits format
- Branch strategy: `main` (stable) → `develop` → `feature/*`, `fix/*`
- All PRs require: passing tests, conventional commit messages, updated CHANGELOG

## Plugin Architecture (summary)
- `BrewLoyaltyPlugin` interface in `packages/types` — the extension contract
- Plugins export: `id`, `name`, `version`, `tabs[]`, `hooks`, `initialize()`
- `PluginRegistry` loads plugins at app startup and injects them into nav + EventBus
- Tab bar is dynamic — core tabs + plugin-contributed tabs
- `IEventBus` emits typed lifecycle events plugins can subscribe to
- Example future plugin: Events Calendar (adds tab, subscribes to check-in events)
→ Full spec: memory/architecture/plugins.md

## Identified Automation Opportunities
| # | Skill/Automation | Trigger | Status |
|---|-----------------|---------|--------|
| 1 | `new-screen` skill | Scaffolds a typed RN screen + test file | Backlog |
| 2 | `new-migration` skill | Generates numbered Supabase migration + applies it | Backlog |
| 3 | `new-plugin` skill | Scaffolds a new plugin package with manifest + screen | Backlog |
| 4 | `changelog` automation | Generates CHANGELOG entry from recent commits | Backlog |
| 5 | `pr-checklist` automation | Reviews staged changes against contribution rules | Backlog |
