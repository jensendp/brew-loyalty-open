# Contributing to Brew Loyalty

Thanks for your interest in contributing! Brew Loyalty is open source and welcomes contributions of all kinds — bug fixes, features, documentation, and new plugins.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Branch Strategy](#branch-strategy)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Testing](#testing)
- [Building Plugins](#building-plugins)
- [Project Structure](#project-structure)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- Expo CLI (`npm install -g expo-cli`)
- A Supabase account (free tier is fine)

### Setup

```bash
# Clone the repo
git clone https://github.com/derekjensen/brew-loyalty.git
cd brew-loyalty

# Install dependencies (from monorepo root)
npm install

# Set up environment
cp apps/mobile/.env.example apps/mobile/.env.local
# Fill in your Supabase URL and anon key

# Apply the DB schema to your Supabase project
# (see supabase/README.md for full instructions)

# Start the mobile app
npm run mobile
```

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, release-ready code |
| `develop` | Integration branch — all feature PRs target this |
| `feature/*` | New features (`feature/qr-checkin`) |
| `fix/*` | Bug fixes (`fix/points-balance-off-by-one`) |
| `chore/*` | Maintenance, deps, tooling (`chore/upgrade-expo-52`) |
| `docs/*` | Documentation only |

**All PRs must target `develop`, not `main`.** Merges to `main` happen via release PRs.

---

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/). This enables automatic changelog generation and semantic versioning.

**Format:** `<type>(<scope>): <description>`

| Type | When to use |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `test` | Adding or updating tests |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `chore` | Build process, tooling, dependencies |
| `perf` | Performance improvement |

**Examples:**
```
feat(points): add birthday bonus rule evaluation
fix(tiers): correct threshold calculation for lifetime spend
docs(contributing): add plugin development guide
test(EventBus): add coverage for once() edge cases
chore(deps): upgrade @supabase/supabase-js to 2.48.0
```

**Breaking changes:** Add `!` after the type and a `BREAKING CHANGE:` footer.
```
feat(plugins)!: rename PluginTab.key to PluginTab.route

BREAKING CHANGE: PluginTab.key has been renamed to PluginTab.route
to better reflect its use as an Expo Router route name.
```

---

## Pull Requests

### Before Opening a PR
- [ ] Fork the repo and create a branch from `develop`
- [ ] Write tests for any new code
- [ ] Run `npm test` and make sure all tests pass
- [ ] Follow the commit message convention
- [ ] Update `CHANGELOG.md` under the `[Unreleased]` section

### PR Requirements
- All CI checks must pass (tests, TypeScript)
- At least one approving review
- Conventional commit messages
- `packages/types` changes must not import any backend-specific code
- New screens must have at least one test

### PR Size
Keep PRs focused. Prefer small, reviewable PRs over large ones. If a feature is large, open a draft PR early to get feedback on direction.

---

## Testing

```bash
# Run all tests
cd apps/mobile && npm test

# Run with coverage
cd apps/mobile && npm test -- --coverage

# Run a specific test file
cd apps/mobile && npm test EventBus
```

### Test conventions
- Co-locate tests with source: `src/lib/EventBus.ts` → `src/lib/__tests__/EventBus.test.ts`
- Use `renderWithServices()` for component tests — never import Supabase in tests
- Mock at the interface boundary, not at the Supabase SDK level
- Every non-trivial function, hook, and component should have tests

---

## Building Plugins

Plugins are the primary extension point for Brew Loyalty. A plugin is a package that implements the `BrewLoyaltyPlugin` interface from `@brew-loyalty/types`.

See `packages/types/src/plugins.ts` for the full interface and inline documentation.

**Quickstart:**

```typescript
import type { BrewLoyaltyPlugin } from '@brew-loyalty/types'
import { EventsScreen } from './screens/EventsScreen'

export const eventsCalendarPlugin: BrewLoyaltyPlugin = {
  id: 'com.yourcompany.events-calendar',
  name: 'Events Calendar',
  version: '1.0.0',
  tabs: [{
    key: 'events',
    title: 'Events',
    icon: '📅',
    component: EventsScreen,
  }],
  async initialize({ services, events }) {
    events.on('member.signed_in', ({ userId }) => {
      // prefetch events for this member
    })
  },
}
```

Register your plugin in `apps/mobile/src/lib/plugins.ts`.

---

## Project Structure

```
brew-loyalty/
├── apps/
│   └── mobile/          React Native (Expo) — member-facing app
├── packages/
│   └── types/           Shared TypeScript interfaces (backend-agnostic)
├── supabase/
│   ├── migrations/      SQL migrations (numbered, idempotent)
│   └── seed/            Demo data for development
├── .github/             PR and issue templates
├── CONTRIBUTING.md      This file
├── CODE_OF_CONDUCT.md
└── CHANGELOG.md
```

The key architectural rule: **`packages/types` never imports anything backend-specific.** App code (`apps/`) talks to interfaces, never to Supabase directly. This keeps the codebase portable and testable.
