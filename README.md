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
| **Daily check-in** | +10 berry coins, streak tracking, a bonus blindbox every 7 days, and the Pilot Berry look at 30 consecutive days |
| **Feed Berry** | Treats dropped by check-ins can be fed to Berry, who pays coins back (snack +25, juice +20, soap +15) |
| **Minigames** | Cloud Dash and Baggage Match, 3 rewarded plays each per day |
| **Blindbox** | Spend coins on random hats, accessories and looks; duplicates refund coins |
| **Passport & medals** | Every flight stamps a destination and unlocks that city's exclusive prop; medals reward multiple travels |
| **Redemption** | Coins convert into inflight meal discounts, merchandise vouchers and travel extras — redeemable from ticket purchase until online check-in |

### Berry's wardrobe

A flat sprite in a fixed pose can't take a clothing layer, so the wardrobe has two tiers:

- **Looks** swap the whole character sprite — Everyday Berry (starter), UO Cabin Crew Berry (epic
  blindbox pull) and UO Pilot Berry (the 30-day check-in exclusive).
- **Props** — hats and accessories — are SVG overlays drawn over the sprite. Each look declares
  anchor points in `src/data/looks.js`, so one drawing lands correctly on all three poses. Props may
  also declare a `Behind` layer that renders *under* the sprite, which is what puts the neck pillow
  behind Berry's head instead of across his face.

### Economy

Earning is unchanged (~130 coins on an active day). Redemption is deliberately expensive so the
daily habit matters: blindbox 150, hot drink 200, HK$20 meal discount 350, luggage tag 450, HK$50
meal combo 800, tote 900, 3kg baggage 1,200, front-row seat 1,400, Berry plush 2,000. A meal
discount is roughly three active days away; the plush is about two weeks. All of it lives in
`src/data/rewards.js` and `BLINDBOX_COST` in `src/state/store.jsx`.

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
- **Simulate flight** — grants a stamp and that destination's exclusive prop
- **Grant 2,000 coins** — reaches the top redemption tier
- **Give treats** — stocks the stash so Feed Berry can be shown on cue
- **Reset demo** — back to a clean first run

## Suggested 5-minute demo script

1. **Reset demo**, then walk through the intro — this is Berry.
2. **Check in.** +10 coins, streak 1. Point out the button now says "come back tomorrow".
3. **Next day → check in.** Streak 2. The habit is forming.
4. **Day 29 streak → check in.** Streak 30, **Pilot Berry** unlocks. Equip it in
   Collection → Wardrobe — thirty days of loyalty earns the captain's uniform.
5. **Give treats → Feed Berry.** Berry eats, hearts pop, coins come back. Care is its own reason to
   open the app.
6. **Play → Cloud Dash.** Play a short round, collect coins.
7. **Rewards → open a blindbox.** Show the rarity reveal, then equip the new prop.
8. **Trips → simulate landing.** The passport stamps, and Tokyo's sakura clip unlocks.
9. **Grant 2,000 → Rewards → redeem** an inflight meal discount. A voucher with a code is issued —
   this is the revenue link: engagement becomes an ancillary conversion.

## Project structure

```
public/berry/          the official Berry sprites
src/
  state/store.jsx      reducer, localStorage persistence, virtual clock
  data/                looks, items, destinations, rewards, medals — all tunable content
  components/          Berry.jsx (sprite + prop layers), BerryArt.jsx (props), Toast, ui primitives
  screens/             Home, Play, Collect, Shop, Trips
  games/               CloudDash, BaggageMatch
  dev/DemoPanel.jsx    presenter controls
```

**The virtual clock is the key design decision.** Every date read goes through `dayKey(dayOffset)`
in `src/state/store.jsx`; nothing calls `new Date()` directly. That single indirection is what lets
"Next day" fast-forward streaks, game allowances and voucher dates all at once.

Berry is rendered from the official character art in `public/berry/`, with props layered over the
sprite by `src/components/Berry.jsx`. Adding a new look means dropping a PNG in `public/berry/` and
adding one entry (sprite path plus head and neck anchors) to `src/data/looks.js`.

## Deploy

Configured for Vercel as a static Vite build (`vercel.json`). No routing rewrites are needed —
screen state lives in the store rather than the URL.

## Not included

No backend, no real HK Express API or booking flow, no accounts, no analytics. This is a
presentation artefact, not a production codebase.
