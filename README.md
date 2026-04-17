# Ledger/Points

A points-to-travel recommendation engine. Users pick the credit cards they carry, search a flight, and receive three booking options: the cash fare, their best transfer-partner redemption, and a sweet-spot award the rest of the internet forgets to mention.

## Stack

- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4 (configured via `@theme` in `app/globals.css`)
- Supabase (Postgres + Auth) — waitlist persistence
- Fonts: Fraunces, Inter Tight, JetBrains Mono via `next/font/google`
- pnpm

## Getting started

```bash
pnpm install
cp .env.local.example .env.local  # fill in when Supabase is ready
pnpm dev
```

The landing page works without Supabase — the waitlist route logs and returns `persisted: false` when env vars are missing.

## Search engine

All logic lives in `lib/engine/`:

- `search.ts` — `searchFlights()` is the single entry point. Returns cash option + two award options (best + alt), filtered by selected cards, sorted by availability status then cpp.
- `availability.ts` — deterministic FNV-1a hash of `(routeKey, departDate, program, cabin)` → open / waitlist / none. Same inputs always return the same result, so the demo is reproducible.

Data:

- `lib/data/cards.ts` — 8 cards (Chase, Amex, Capital One, Citi, Bilt)
- `lib/data/routes.ts` — 27 routes (ATL/JFK/LAX × 9 destinations)
- `lib/data/sweetSpots.ts` — per-route award prices + transfer partners
- `lib/data/airlines.ts` — `pickAirline(routeKey)` helper

Run the engine tests:

```bash
pnpm dlx tsx lib/engine/search.test.ts
```

## Supabase setup

Paste `supabase/schema.sql` into the SQL editor of a new Supabase project. Then copy the project URL, anon key, and service-role key into `.env.local`.

## What's in Phase 1 vs. Phase 2

| Concern | Phase 1 (shipped) | Phase 2 |
| --- | --- | --- |
| Award pricing | Static sweet-spot catalog | AwardFares API |
| Seat availability | Deterministic simulation | Seats.aero |
| User accounts | Stub endpoints | Magic-link auth + /wallet + /searches |
| Booking execution | Decorative button | Out of scope (link-out) |

The engine signatures do not change between phases.
