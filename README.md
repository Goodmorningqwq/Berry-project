# Fly with Berry

A clickable proof-of-concept for **Fly with Berry** — a digital-pet companion built as an extension
to the HK Express (UO) app.

**Team:** Air Con – Airline Consultants

## The problem

The UO app is a transactional utility: people open it to book, check flight status, or check in
online, then don't come back. Engagement is *episodic* rather than *habitual*, which means few
touchpoints and few chances to promote ancillary products.

## The solution in this demo

Berry is a bear companion that gives 18–34 year-old users a reason to open the app daily:

| Loop | What it does |
| --- | --- |
| **Daily check-in** | +10 berry coins, streak tracking, a bonus blindbox every 7 days, an exclusive outfit at 30 consecutive days |
| **Minigames** | Cloud Dash and Baggage Match, 3 rewarded plays each per day |
| **Blindbox** | Spend coins on random outfits, hats and accessories; duplicates refund coins |
| **Passport & medals** | Every flight stamps a destination and unlocks that city's exclusive clothing; medals reward multiple travels |
| **Redemption** | Coins convert into inflight meal discounts, merchandise vouchers and travel extras — redeemable from ticket purchase until online check-in |

Everything is stored locally in `localStorage`. There is no backend and no network calls, so the
demo works offline.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173. Build for production with `npm run build`.

## Presenter controls

The ⚙ button in the bottom-right corner opens demo-only shortcuts. None of this ships in the real
product — it exists so a 30-day habit loop can be shown in five minutes:

- **Next day** — advances the virtual clock, re-arming check-in and game plays
- **Skip a week** — breaks the streak, to show the reset
- **Day 29 streak** — parks the streak one day short so a live check-in lands the 30-day exclusive
- **Simulate flight** — grants a stamp and that destination's exclusive outfit
- **Grant 500 coins** — skips the grind to reach the shop
- **Reset demo** — back to a clean first run

## Suggested 5-minute demo script

1. **Reset demo**, then walk through the intro — this is Berry.
2. **Check in.** +10 coins, streak 1. Point out the button now says "come back tomorrow".
3. **Next day → check in.** Streak 2. The habit is forming.
4. **Day 29 streak → check in.** Streak 30, the Golden Wings Set unlocks. Equip it in
   Collection → Wardrobe.
5. **Play → Cloud Dash.** Play a short round, collect coins.
6. **Rewards → open a blindbox.** Show the rarity reveal, then equip the new item.
7. **Trips → simulate landing.** The passport stamps, and Tokyo's exclusive kimono unlocks.
8. **Rewards → redeem** an inflight meal discount. A voucher with a code is issued — this is the
   revenue link: engagement becomes an ancillary conversion.

## Project structure

```
src/
  state/store.jsx      reducer, localStorage persistence, virtual clock
  data/                items, destinations, rewards, medals — all tunable content
  components/          Berry.jsx (layered SVG), BerryArt.jsx (wardrobe), Toast, ui primitives
  screens/             Home, Play, Collect, Shop, Trips
  games/               CloudDash, BaggageMatch
  dev/DemoPanel.jsx    presenter controls
```

**The virtual clock is the key design decision.** Every date read goes through `dayKey(dayOffset)`
in `src/state/store.jsx`; nothing calls `new Date()` directly. That single indirection is what lets
"Next day" fast-forward streaks, game allowances and voucher dates all at once.

Berry is drawn as an original layered SVG (`src/components/Berry.jsx`). If official character art
becomes available, drop the files in `public/` and swap that one renderer.

## Deploy

Configured for Vercel as a static Vite build (`vercel.json`). No routing rewrites are needed —
screen state lives in the store rather than the URL.

## Not included

No backend, no real HK Express API or booking flow, no accounts, no analytics. This is a
presentation artefact, not a production codebase.
