# Plugin Architecture — Brew Loyalty

## Overview

Plugins are the primary extension point. They let developers add features to Brew Loyalty without modifying core app code.

## Key Files

| File | Purpose |
|------|---------|
| `packages/types/src/plugins.ts` | `BrewLoyaltyPlugin` interface, `PluginTab`, `PluginContext`, `IPluginRegistry` |
| `packages/types/src/events.ts` | `IEventBus`, `AppEventMap` — all typed lifecycle events |
| `apps/mobile/src/lib/EventBus.ts` | Concrete `EventBus` implementation (singleton: `eventBus`) |
| `apps/mobile/src/lib/PluginRegistry.ts` | Concrete `PluginRegistry` (singleton: `pluginRegistry`) |
| `apps/mobile/src/lib/plugins.ts` | **Register plugins here** |
| `apps/mobile/src/lib/providers.tsx` | Calls `pluginRegistry.initializeAll()` at startup |
| `apps/mobile/app/(app)/_layout.tsx` | Tab bar reads `pluginRegistry.getTabs()` for dynamic tabs |

## Lifecycle

```
App starts
  → ServicesProvider mounts
  → pluginRegistry.initializeAll(context) called
  → Each plugin's initialize() runs
  → Plugin subscribes to events, prefetches data, etc.
  → Tab bar reads pluginRegistry.getTabs()
  → Plugin tabs appear in navigation
```

## Writing a Plugin

```typescript
import type { BrewLoyaltyPlugin } from '@brew-loyalty/types'
import { MyScreen } from './screens/MyScreen'

export const myPlugin: BrewLoyaltyPlugin = {
  id: 'com.example.my-plugin',   // globally unique, reverse-domain
  name: 'My Plugin',
  version: '1.0.0',

  tabs: [{
    key: 'my-tab',         // route name in Expo Router
    title: 'My Tab',
    icon: '🔧',
    component: MyScreen,
  }],

  async initialize({ services, auth, events }) {
    // Subscribe to app events
    events.on('member.signed_in', ({ userId }) => {
      console.log('member signed in:', userId)
    })

    // Access loyalty data
    const profile = await services.members.getMemberProfile(userId)
  },
}
```

Register in `apps/mobile/src/lib/plugins.ts`:
```typescript
import { myPlugin } from '@brew-loyalty/plugin-my-plugin'
pluginRegistry.register(myPlugin)
```

## Available Events

| Event | Payload | When fired |
|-------|---------|------------|
| `member.signed_in` | `{ userId, email }` | After successful auth |
| `member.signed_out` | `{ userId }` | After sign-out |
| `member.onboarded` | `{ userId }` | After profile created |
| `member.enrolled` | `{ memberId, programId, orgId }` | After program enrollment |
| `points.earned` | `{ enrollmentId, amount, reason }` | After points credited |
| `points.spent` | `{ enrollmentId, amount, rewardId? }` | After points debited |
| `tier.changed` | `{ enrollmentId, previousTierId, newTierId, newTierName }` | After tier upgrade/downgrade |
| `reward.redeemed` | `{ enrollmentId, rewardId, rewardName }` | After redemption |

## Example Plugins (future)

| Plugin | Tabs | Events used |
|--------|------|-------------|
| Events Calendar | Events tab | `member.signed_in` (prefetch) |
| Venue Map | Map tab | `member.enrolled` |
| Push Notifications | None (background) | All events |
| Social/Referrals | Friends tab | `points.earned` |
| Stamp Card (alternate mechanic) | — | Replaces points mechanic |
