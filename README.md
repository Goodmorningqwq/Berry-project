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
| **Daily check-in** | A fixed 7-day calendar (see below), a celebration reveal, and the Pilot Berry look at 30 consecutive days. The reveal then previews what tomorrow pays |
| **Feed Berry** | Treats from check-ins are fed to Berry; every 5 fed earns a free blindbox |
| **Minigames** | Cloud Dash, Baggage Match and Candy Rush, entered with one of 3 daily play tickets |
| **Leaderboards** | A ranking per game, shown right after each round and on a Play tab |
| **Blindbox** | Spend coins on random hats, accessories and looks; duplicates refund coins |
| **Passport & medals** | 35 real UO destinations to stamp; your first landing in each country unlocks that country's exclusive prop |
| **Redemption** | 21 rewards across six tabs, priced against the real UO inflight menu — onboard discounts, Berry merchandise and travel extras. Redeemable from ticket purchase until online check-in, capped at one outstanding voucher each |

### Berry's wardrobe

A flat sprite in a fixed pose can't take a clothing layer, so the wardrobe has two tiers:

- **Looks** swap the whole character sprite — Everyday Berry (starter), UO Cabin Crew Berry (epic
  blindbox pull) and UO Pilot Berry (the 30-day check-in exclusive).
- **Props** — hats and accessories — are SVG overlays drawn over the sprite. Each look declares
  anchor points in `src/data/looks.js`, so one drawing lands correctly on all three poses. Props may
  also declare a `Behind` layer that renders *under* the sprite, which is what puts the neck pillow
  behind Berry's head instead of across his face.

### The network

The passport covers the real UO flight network — 35 destinations across 8 countries, grouped into
four regions for the region badges. The published network also lists ferry and coach connections
(Shekou, Nansha, Humen, Pazhou, Zhongshan, Zhuhai HZMB, Macao HZMB, Shenzhen Airport Ferry); those
feed *into* HKG rather than being places Berry flies to, so they aren't collectible.

Exclusives are awarded **per country**, on the first landing there — eight props is a set that can
be drawn well, where 35 city props could not. The six city-flavoured props that predate the network
expansion (takoyaki hat, ramen hat, straw hat, shell necklace, snorkel, lantern) moved into the
blindbox pool rather than being retired.

### Medals

Five medals climb **Copper → Silver → Gold → Diamond**, each showing how far the next promotion is:

| Medal | Measures | Copper | Silver | Gold | Diamond |
| --- | --- | --- | --- | --- | --- |
| Frequent Flyer | trips | 3 | 10 | 25 | 50 |
| Berry Streak | best streak | 7 | 30 | 100 | 365 |
| Passport | destinations | 5 | 12 | 24 | 35 |
| Wardrobe | cosmetics | 5 | 10 | 17 | 25 |
| Coin Earner | lifetime coins | 500 | 2,000 | 6,000 | 15,000 |

Below them sit four region badges — Japan, Korea, Greater China, Southeast Asia — earned by stamping
a whole region. All of it derives from state in `src/data/medals.js`; the store tracks no medal data.

### It opens from the real UO app

The demo starts on a screenshot of the HK Express home screen with a live **Fly with Berry** row
added to "Get Prepared For Your Trip". Tapping it pushes the extension in from the right; a back
chevron returns. The palette is sampled from that screenshot — `#6F2B90` header, `#77279A` headings,
`#5B0E80` nav active, `#F5F5F5` page — so the extension reads as part of the host app rather than a
separate product. Berry's own content is where the softer, cuter styling lives.

### The 7-day check-in calendar

Nothing about the check-in is random — the cycle always pays the same thing on the same day, so the
Home strip can promise it in advance:

| Day | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Coins | +10 | +5 | +10 | +5 | **+25** | +5 | +10 |
| Bonus | — | 🍪 | — | 🧃 | — | 🧼 | 🎁 blindbox |

70 coins a week, the same as the flat 10/day it replaced. Treats are what feed Berry.

### Berry's room

Home opens on Berry's room rather than a plain stage. Two shelves hold nine trophy slots — the five
tiered medals on top, the four region badges below — each earned one tinted with its tier colour and
each empty one left as a dashed outline, because a trophy room only works if the gaps show. Tapping
any trophy jumps to Collection → Medals.

**Tap Berry** and he answers. `src/data/dialogue.js` checks context first — hungry, in-flight, not
checked in, long streak, no stamps yet, what he's wearing, blindboxes waiting — and falls back to a
pool of general chatter, never repeating the line already on screen. He squashes, hearts float up,
and the bubble reverts to its default line after a few seconds.

### Leaderboards and the guest player

A guest identity is generated silently on first run — a name like `Traveller 4821`, renameable from
the leaderboard — so nothing ever blocks the demo with a sign-up form. In production this would be
the player's UO account.

Each game keeps its own board, because the three score on completely different scales: coins caught
in Cloud Dash, seconds to spare in Baggage Match, points in Candy Rush. Finishing a round shows your
rank and the players either side of you; the full board lives on the Play screen's Leaderboard tab.

**The rivals are sample data, not a database.** `src/data/leaderboard.js` holds a fixed roster of 20
players with hand-tuned scores — fixed rather than generated, so the board doesn't reshuffle on every
reload. The ranking itself is real: your best score is merged in and sorted, and a tie leaves you
*below* the rival holding it, since beating someone should require actually beating them. A real
deployment needs server-held scores and anti-cheat, as a client-reported score is trivially forged.

### In-flight mode

A presenter toggle (and the browser's real `online`/`offline` events) puts the app in flight mode.
The rule is that **offline freezes the economy, not the app**:

| Blocked in flight | Still works |
| --- | --- |
| Daily check-in | All three minigames, unlimited |
| Posting a leaderboard score | Browsing the leaderboards |
| Opening blindboxes | Dressing Berry, browsing the wardrobe |
| Redeeming *new* coupons | Using a voucher you already hold — that happens onboard |
| Feeding Berry | Passport, medals, the room, flight records |
| Completing a flight | Everything else |

Minigames stay playable but pay nothing **and don't consume a play ticket** — burning the daily
allowance for zero reward would be worse than blocking them outright.

Because nothing at all accrues offline, there is no queue to reconcile, no cap to tune and nothing
to farm by pulling the network. Enforcement lives in a single gate at the top of the reducer
(`ECONOMY_ACTIONS` in `src/state/store.jsx`) rather than in the screens, so no component can bypass
it — verified by forcing clicks on disabled controls and confirming state comes back byte-identical.

### Drop rates

Every random reward is disclosed in-app behind the **View odds** link on the blindbox and on the
check-in reveal. `src/components/OddsSheet.jsx` reads the same constants and pools the rolls use, so
the published numbers can't drift from the code:

- **Blindbox** — Common 60%, Rare 30%, Epic 10%. The rarity is picked first, then an item within it,
  preferring anything not yet owned; an unavoidable duplicate refunds 20 coins. (Measured over
  200,000 rolls: 59.94 / 30.04 / 10.02.)
- **Check-in** — nothing random; the sheet lists the full 7-day calendar.
- **Feeding** — no coins; every 5 treats fed earns a free blindbox.

### Economy

**Play tickets.** Games are entered with a ticket, not opened freely: **3 a day**, spent on whichever
games you like, plus a bonus ticket on every 7th consecutive check-in and a cap of 5 held at once.
The ticket is taken on entry so the balance reads honestly while you play, but leaving without
collecting hands it back — you only pay for a round you take the coins from. This bounds the day at
three collected rounds however the player mixes them, which is what makes the coin worth pricing.

**Coins carry two different numbers, and conflating them is the mistake to avoid.** The **book
value** is 1 coin = HK$0.01 (`COINS_PER_HKD`) — what UO carries the outstanding liability at. The
**shelf price** is set above it, by a markup that rises with what a reward actually costs to fulfil
(`MARKUP` in `src/data/rewards.js`): 100 coins/HK$ for zero-cost perks, 160 for discount coupons,
200 for real merchandise.

**The menu prices are real.** Every `retail` figure comes from the HK Express *Inflight Gourmet Meals
and Deals* menu — cartons HK$20, cans HK$25, signature drinks HK$40/45, packet snacks HK$20, cup
noodles HK$30, light bites HK$35–45, hearty mains HK$75, desserts HK$35–40. Reward wording stays
generic so a seasonal menu change doesn't invalidate the catalogue.

**Every onboard reward is a discount, never a free item.** The customer always pays the balance, so
each redemption is attached to a sale UO would often not otherwise have made. Free items were built
and removed: they cost twice as much per coin, because nothing is bought alongside them to offset
the cost. Two rules protect margin — **no discount exceeds HK$10**, and none exceeds **a third of
what it applies to**. Both are asserted against the real menu prices; the largest in the catalogue is
27%.

**One outstanding voucher per reward.** Holding an unused coupon blocks redeeming a second one, so
coupons can't be banked and dumped on a single flight — the reward card reads *Held* until you tap
the voucher to mark it used. Marking a voucher used deliberately works **in flight**, since onboard
is exactly where a coupon gets spent; only issuing new ones is frozen.

Rounds pay **1 to 35 coins**. The floor is deliberately a token amount: idling through three rounds
pays 3 coins, so AFK farming earns nothing worth having, while a cap of 35 is reachable in all three
games by playing well. The shop runs 21 rewards across six tabs — Drinks, Snacks, Meals, Sweets,
Berry and Travel — and **every tab opens on something reachable in 3–12 days**, because a tab whose
cheapest item is months away just reads as a wall.

At 10,000 registered players the programme issues ~209,000 coins a day (80% of it from games, which
is why the ticket cap is the control that matters) and costs roughly **HK$358/day — ~HK$131,000/year,
or HK$13.06 per registered user** after breakage. That is 17% below what the same catalogue cost with
free items in it. Full derivation, per-game curves, the markup schedule and the costing model are in
[docs/REWARD-TABLE.md](docs/REWARD-TABLE.md).

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

- **Next day** — advances the virtual clock, re-arming check-in and refreshing play tickets
- **Skip a week** — breaks the streak, to show the reset
- **Day 29 streak** — parks the streak one day short so a live check-in lands the 30-day exclusive
- **Simulate flight** — grants a stamp and that destination's exclusive prop
- **Grant 15,000 coins** — HK$150, reaches the top redemption tier
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
6. **Play → Candy Rush.** Swap a few tiles; cascades stack a combo multiplier.
7. **Rewards → open a blindbox.** Show the rarity reveal, then equip the new prop.
8. **Trips → simulate landing.** The passport stamps, and Japan's sakura clip unlocks. Fly to a
   second Japanese city to show the stamp still lands — exclusives are one per country.
9. **Grant 2,000 → Rewards → redeem** an inflight meal discount. A voucher with a code is issued —
   this is the revenue link: engagement becomes an ancillary conversion.

## Project structure

```
public/berry/          the official Berry sprites
public/host/           the HK Express screenshot the demo opens on
public/fonts/          self-hosted Nunito (no CDN, works offline)
src/
  state/store.jsx      reducer, localStorage persistence, virtual clock
  data/                looks, items, destinations, rewards, medals — all tunable content
  components/          Berry.jsx (sprite + prop layers), BerryArt.jsx (props), Toast, ui primitives
  screens/             Home, Play, Collect, Shop, Trips
  games/               CloudDash, BaggageMatch, CandyRush
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
