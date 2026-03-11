# Glossary — Brew Loyalty

Full decoder ring for all project terminology.

## Domain Terms
| Term | Meaning | Context |
|------|---------|---------|
| Organization / Org | A brewery, winery, or coffee roaster using Brew Loyalty | Top-level tenant |
| Owner | Staff/admin at the org managing the loyalty program | Admin role |
| Member | End customer using the mobile app | Consumer role |
| Program | Owner-configured loyalty setup (rules + tiers + rewards) | Per-org |
| Points | Earn currency (e.g. 1 pt per $1 spent) | Core mechanic |
| Tier | Membership level (paid or threshold-based) | e.g. Silver, Gold, Hop Head |
| Perk | Benefit attached to a tier | Multiplier, free item, discount, event access |
| Multiplier | Points earned faster at a given tier (e.g. 2x) | Tier perk |
| Reward | Redeemable item in the catalog (e.g. "Free Pint") | Owner-configured |
| Redemption | Member exchanging points for a reward | Transaction |
| Check-in | Member scans QR to log a visit/purchase | Entry point for point earning |
| QR Code | Unique code per member or per transaction for scanning | UX mechanic |
| Point Ledger | Append-only log of all point credits/debits per member | Audit trail |
| Ambassador | Cooper's Hawk term for their top-tier earned status | Inspiration |
| Wine Wallet | Cooper's Hawk term for bottle allocation per member | Inspiration — our equiv: Reward Wallet |
| Tenant | An organization in the multi-tenant system | Architecture term |
| Magic Link | Passwordless auth via email link | Supabase Auth feature |

## Abbreviations
| Abbr | Meaning |
|------|---------|
| CH | Cooper's Hawk (reference app) |
| RN | React Native |
| SB | Supabase |
| MVP | Minimum Viable Product |
| RLS | Row Level Security (Supabase/Postgres) |
| MCP | Model Context Protocol (Claude tool layer) |
| PWA | Progressive Web App |
| B2B2C | Business to Business to Consumer (our model) |
| OTP | One-Time Password |
| QR | Quick Response (code) |

## Architecture Shorthand
| Term | Meaning |
|------|---------|
| loyalty_program | The DB table/entity that holds an org's loyalty config |
| point_rule | Config entity defining how/when points are earned |
| program_tier | A tier definition within a loyalty program |
| tier_perk | A specific perk attached to a program_tier |
| member_enrollment | Junction: member ↔ organization membership |
| point_ledger | Immutable log of all point movements |
| reward_catalog | List of redeemable rewards per org |
| repository pattern | Abstraction layer: app talks to interfaces, not Supabase directly |
| ILoyaltyRepository | Core interface for all loyalty data ops (packages/types) |
| IAuthProvider | Core interface for auth (magic link, session mgmt) |
| ServiceContext | React context that injects the active backend implementations |
| providers.ts | The one file that wires up Supabase (or future) implementations |
