# Brew Loyalty

> Open-source mobile loyalty platform for craft beverage businesses — breweries, wineries, and coffee roasters.

Built with React Native (Expo) + Supabase + TypeScript.

---

## What is Brew Loyalty?

Brew Loyalty lets craft beverage businesses run their own branded loyalty program — points, tiers, perks, and rewards — without giving up control of their customer data.

Members earn points on purchases, unlock tiers (free and paid), and redeem rewards. Owners configure everything: point rules, tier names, perks, and the reward catalog.

Inspired by the [Cooper's Hawk Winery](https://www.coopershawkwinery.com/) loyalty + wine club app.

---

## Features (MVP)

- Magic link authentication (no passwords)
- Points earned per dollar spent
- Tiered membership: free, paid subscription, and points-threshold tiers
- Perks per tier: multipliers, free items, discounts, early access
- Reward catalog with point redemption
- Member card with QR code for check-in (Phase 2)

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Mobile | React Native (Expo) |
| Backend | Supabase (Postgres + Auth + Realtime) |
| Language | TypeScript (strict mode) |
| Monorepo | npm workspaces |
| Auth | Supabase magic link |

---

## Repository Structure

```
brew-loyalty/
├── apps/
│   └── mobile/          # Expo React Native app
├── packages/
│   └── types/           # @brew-loyalty/types — shared interfaces (no backend imports)
├── supabase/
│   ├── migrations/      # Numbered SQL migrations (apply in order)
│   └── seed/            # Demo data (Ironwood Brewing Co.)
└── memory/              # Project architecture docs
```

---

## Self-Hosting (Coming Soon)

Full self-hosting guide will be published with v1.0. The short version:

1. Create a Supabase project
2. Apply migrations in `supabase/migrations/` in order
3. Optionally seed demo data from `supabase/seed/demo.sql`
4. Set your `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `apps/mobile/.env.local`
5. Run `npm install && cd apps/mobile && npx expo start`

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

---

## License

MIT — see [LICENSE](./LICENSE).

*Built by [Derek Jensen](https://github.com/jensendp).*
