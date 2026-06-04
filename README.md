# ✈️ la-ny-viaje

> A private travel **operating system** for four friends traveling from Colombia to **Los Angeles** and **New York** during the **2026 FIFA World Cup** — and home to vote on election day.

Not a travel planner. A cinematic, command-center mission control: airport departure boards, neon city lights, route maps, and a finance engine that beats Splitwise.

---

## ✨ Features

| Module | What it does |
| --- | --- |
| **Mission Control** | Live phase, countdown to next event, weather, today's itinerary, upcoming flight, announcements, USD/COP widget |
| **Timeline** | Military-ops day-by-day schedule with live status + detail drawer & maps |
| **Map** | Mapbox command map — route between cities, category-filtered pins, popups, detail drawer |
| **Photo Vault** | Upload to Firebase Storage, **auto-extract EXIF GPS**, gallery / map / timeline views |
| **Documents** | Folder-based secure vault for flights, tickets, reservations, IDs |
| **Expenses** | Personal & shared, equal splits, **auto balances + minimal settlements** |
| **Finance Center** | Spend by category/user, paid-vs-owed charts, **live USD/COP exchange** + calculator |
| **Weather Center** | LA + NY current/hourly/5-day, alerts & recommendations (OpenWeather optional) |
| **Flight Center** | Departure-board, flight cards, route map, airport info |
| **Group Feed** | Real-time text + image posts with reactions |
| **Packing** | Per-person checklists with completion % |
| **Theme Parks** | Disneyland + Six Flags ride trackers, ratings, gamified progress |
| **Food Journal** | Restaurants/bars/cafes with ratings, photos, map |
| **Analytics** | Trip stats, contribution radar, top-rated spots |
| **AI Assistant** | Chat co-pilot that answers from live trip data (LLM-ready architecture) |
| **Election Hub** | Countdown to Colombia 2026 runoff, voting checklist, notes, key dates |

---

## 🧱 Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn-style UI · Firebase (Auth / Firestore / Storage) · TanStack Query · Framer Motion · Lucide · Mapbox GL · Recharts · date-fns

---

## 🚀 Quick start

```bash
npm install
npm run dev          # → http://localhost:3000
```

**It runs immediately with zero config.** Without Firebase, the app uses a rich
local seed dataset (the full trip narrative) persisted to `localStorage`, and a
demo login where you tap any of the four travelers.

---

## 🔌 Connecting Firebase (for real persistence & auth)

1. Create a project at <https://console.firebase.google.com>.
2. Enable **Authentication → Email/Password**, **Firestore Database**, and **Storage**.
3. Copy the web app config into `.env.local` (see `.env.example`):

   ```bash
   cp .env.example .env.local
   ```

   Fill in the `NEXT_PUBLIC_FIREBASE_*` values. As soon as these are present the
   app switches from local mode to live Firestore/Auth/Storage — no code changes.

4. **Seed the database & create the 4 users** (optional but recommended):

   - Firebase console → *Project settings → Service accounts → Generate new private key*
   - Save it as `./serviceAccount.json` (git-ignored)
   - Run:

     ```bash
     npm run seed
     ```

   This pushes all collections and creates the four accounts with password
   `worldcup2026`:

   | Name | Email | Role |
   | --- | --- | --- |
   | Jeronimo | jeronimo@lanyviaje.com | admin |
   | Mateo | mateo@lanyviaje.com | member |
   | Santiago | santiago@lanyviaje.com | member |
   | User4 | user4@lanyviaje.com | member |

5. **Deploy security rules:**

   ```bash
   npm i -g firebase-tools
   firebase deploy --only firestore:rules,storage
   ```

---

## 🗝️ Optional integrations (all free tiers)

| Variable | Service | Used for |
| --- | --- | --- |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | [Mapbox](https://account.mapbox.com/access-tokens/) | The command map & flight routes (falls back to a placeholder + OSM embeds) |
| `NEXT_PUBLIC_OPENWEATHER_KEY` | [OpenWeather](https://openweathermap.org/api) | Live weather (falls back to seed snapshots) |

The USD/COP rate uses [open.er-api.com](https://open.er-api.com) — **no key needed**.

> 💸 Everything here fits comfortably in free tiers: Firebase Spark plan,
> Mapbox free tier, OpenWeather free plan, and a no-key exchange API.

---

## 🗂️ Firestore data model

Collections: `users`, `expenses`, `photos`, `locations`, `documents`,
`timelineEvents`, `posts`, `checklists`, `restaurants`, `rides`, `flights`,
`electionNotes`, `electionTasks`, `announcements`.

All TypeScript interfaces live in [`src/lib/types.ts`](src/lib/types.ts).
Seed data lives in [`src/lib/seed-data.ts`](src/lib/seed-data.ts).

---

## 📁 Structure

```
src/
  app/                 # routes (one folder per feature page)
  components/
    ui/                # shadcn-style primitives (button, card, drawer, tabs…)
    layout/            # sidebar, topbar, app shell + auth gate
    widgets/           # countdown, exchange widget
    map/               # Mapbox map component
    auth/              # login screen
  hooks/               # use-collection, use-now, use-weather, use-exchange, use-upload
  lib/                 # firebase, types, seed-data, trip math, assistant, utils
scripts/seed.ts        # Firestore + Auth seeding (firebase-admin)
firestore.rules        # squad-only access
storage.rules          # squad-only, 20MB cap
```

---

## 🏗️ Architecture notes

- **Local-first / Firebase-ready.** A single generic `useCollection(name)` hook
  reads/writes Firestore when configured, otherwise a `localStorage` store seeded
  with the trip. Pages don't know the difference.
- **No Redux.** TanStack Query owns server state; React state owns UI.
- **The AI assistant** is a rule engine over the same data context — swap
  `lib/assistant.ts#answer()` for an LLM call with identical inputs.

Built for the squad. 🇨🇴 → 🇺🇸 → 🗳️
