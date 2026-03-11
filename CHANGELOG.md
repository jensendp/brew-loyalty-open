# Changelog

All notable changes to this project will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).

---

## [Unreleased]

### Added
- Core Supabase schema: organizations, loyalty programs, tiers, perks, rewards, members, point ledger
- Row Level Security (RLS) policies on all tables
- Demo seed data (Ironwood Brewing Co.)
- Expo monorepo scaffold with `apps/mobile` and `packages/types`
- `@brew-loyalty/types`: backend-agnostic TypeScript interfaces for all domain models
- `IAuthProvider`, `IBrewLoyaltyServices` interfaces — repository pattern for backend portability
- Supabase implementations: `SupabaseAuthProvider` and all repository classes
- `IEventBus` and `EventBus` — typed pub/sub for app lifecycle events
- `BrewLoyaltyPlugin` interface and `PluginRegistry` — extension architecture
- Expo Router navigation: `(auth)` group and `(app)` tab group
- Screens: sign-in (magic link), home, member card, tiers, rewards (stubs)
- Jest test infrastructure with `renderWithServices()` mock helper
- Tests: `EventBus`, `PluginRegistry`
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, PR and issue templates

---

*Releases will be tagged on `main` following the pattern `vMAJOR.MINOR.PATCH`.*
