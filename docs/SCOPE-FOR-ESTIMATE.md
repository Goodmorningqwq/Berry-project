# Fly with Berry — Scope Document for Cost Estimation

**Product:** Fly with Berry — a digital-pet companion feature inside the HK Express (UO) mobile app
**Team:** Air Con – Airline Consultants
**Document purpose:** describe the technology, functionality and UI in enough detail that a cost
estimate can be produced. Written against a working proof-of-concept, so everything in Part 2 is
demonstrably built, not aspirational.

---

## 0. Read this first: what is and isn't built

There is a **working, deployed proof of concept** (berryuo.vercel.app). It is a front-end-only
browser demo: all state lives in the browser, there is no server, no accounts, and no connection to
any HK Express system.

That distinction is the single biggest driver of cost. Estimates that treat the PoC scope as the
project will land near the original brief's figure (~US$50k). Estimates for a **production feature
inside a live airline app, integrated with real booking and loyalty data, operated for years**, land
far higher. Both are legitimate answers to different questions.

**When asking an AI for an estimate, state which of these you want priced:**

| Option | What it covers | Rough character |
| --- | --- | --- |
| A. PoC / pitch demo | What exists today. Front-end only, fake data | Weeks, one or two people |
| B. Production MVP | Real backend, accounts, integration, app store release, security review | Months, a full team |
| C. Production platform + live ops | B, plus seasonal content, campaigns, analytics, A/B testing, multi-year run cost | Ongoing annual budget |

The functional and UI detail below applies to all three. Part 4 lists what B and C add.

---

# PART 1 — Technology

## 1.1 Current proof of concept

| Layer | Choice | Notes |
| --- | --- | --- |
| UI framework | React 18.3 | Function components and hooks only |
| Build tool | Vite 5.4 | Pinned to 5.x for Node 18 compatibility |
| Language | JavaScript (JSX) | No TypeScript |
| State | Single `useReducer` + Context | ~440 lines; one reducer, no state library |
| Persistence | Browser `localStorage` | Versioned schema (currently v4) with a reset-on-mismatch guard |
| Styling | Hand-written CSS, custom properties | ~1,700 lines, no framework, no preprocessor |
| Routing | None | Screen state is held in the store; deploys as a static SPA |
| Fonts | Self-hosted Nunito (woff2, 39KB) | No CDN, works offline |
| Character art | 3 supplied PNG sprites + hand-drawn inline SVG props | ~1.8MB of sprites |
| Animation | CSS keyframes + `requestAnimationFrame` | `transform`/`opacity` only; honours `prefers-reduced-motion` |
| Hosting | Vercel static hosting | Auto-deploy from GitHub `main` |
| Runtime dependencies | **React and React-DOM only** | Deliberate: no analytics, no UI kit, no animation or confetti library |

**Size:** 31 source files, ~6,700 lines (screens 1,008 · components 1,347 · games 722 · data 586 ·
state 438 · presenter tools 168). Production bundle ~74KB gzipped JS + ~8KB CSS.

## 1.2 What a production build would realistically use

The PoC's architecture is deliberately minimal. A production feature inside the UO app would need:

- **Client:** either native (Swift / Kotlin) or the app's existing cross-platform framework (React
  Native / Flutter). The current React web code is a **design and behaviour reference, not shippable
  app code** — assume a rewrite in the host app's stack.
- **Backend:** an authoritative game service — user profiles, currency ledger, inventory, streaks,
  voucher issuance, anti-fraud. Currency and vouchers cannot live on the device (see §3.9).
- **Data:** transactional store for balances and inventory, plus an event pipeline for analytics.
- **Integration:** identity/SSO with the UO account system, booking and flight data, the loyalty or
  voucher system, inflight-purchase and merchandise fulfilment.
- **Ops:** CI/CD, staging environments, monitoring, on-call, content management for seasonal drops.
- **Compliance:** privacy (PDPO/GDPR as applicable), app store rules on loot boxes and published
  odds, accessibility, security review and penetration testing.

---

# PART 2 — Functional specification (all built and working)

## 2.1 Entry point — the app it lives inside

The demo opens on the real HK Express home screen with a **"Fly with Berry" entry point** added, to
show how the feature plugs into the existing app. Two placements are implemented and switchable:

1. A **row in the "Get Prepared For Your Trip" list**, styled like the host app's own rows, with a
   NEW badge
2. A **fifth tab in the bottom navigation**, in the featured centre slot

Opening the feature pushes it in from the right (native-style navigation); a back chevron returns to
the host app without losing progress.

## 2.2 Berry — the character

- Three full-body **looks**, each a swappable sprite: Everyday Berry, UO Cabin Crew Berry, UO Pilot
  Berry
- **31 cosmetics** total: 3 looks, 23 hats and accessories rendered as layered SVG over the sprite,
  and 5 room backgrounds implemented as CSS themes rather than image assets. Each look defines anchor
  points so one prop drawing positions correctly on every pose
- Props can render **behind** the character as well as in front (e.g. a neck pillow sits behind the
  head), which requires per-item layer ordering
- Moods drive presentation: idle, happy, sleepy — affecting animation speed and colour treatment
- **Tap-to-talk:** tapping Berry produces a line of dialogue. Context-aware first (hungry, in-flight,
  streak length, what he's wearing, nothing collected yet, rewards waiting), falling back to a pool
  of general chatter, never repeating the previous line. **47 written lines** across 10 context
  groups plus the general pool

## 2.3 Berry's room (home screen)

A furnished room: back wall, window, floor, decorative bed, and **two trophy shelves** holding nine
slots — five tiered medals and four region badges. Earned trophies are tinted with their tier
colour; unearned ones remain as visible empty outlines. Tapping any trophy opens the medal detail
screen.

## 2.4 Daily check-in

A **fixed 7-day reward calendar**, publicly previewed so users always know what each day pays:

| Day | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Coins | +10 | +5 | +10 | +5 | **+25** | +5 | +10 |
| Bonus | — | treat | — | treat | — | treat | free blindbox |

- 70 coins per full week; streak breaks reset to day 1
- **30 consecutive days** unlocks an exclusive character look (UO Pilot Berry)
- **Reward reveal sequence:** a staged animation — anticipation, burst, settle — with light rays,
  confetti, a counting coin total and a squash-and-stretch landing. Three intensity tiers so bigger
  rewards feel bigger. Tapping skips to the payoff
- A **second step** then previews tomorrow's reward and the progress toward the 30-day milestone
- **Full 30-day calendar**, opened by tapping the week strip: every day's payout, the weekly blindbox
  and bonus-ticket days, the day-30 exclusive, and the run totals

## 2.5 Minigames

Entry is **ticket-gated**: 3 play tickets a day, spendable on any mix of games, 1 per round. The
ticket is taken on entry and **refunded if the player leaves without collecting**. Every 7th
consecutive check-in grants a bonus ticket, capped at 5 held. Rounds pay **1 to 23 coins** by
performance — a token floor that makes idling worthless and a cap all three games can reach.

Payout curves are **tuned against simulation, not intuition**: a harness replays each game's real
logic for 20,000 rounds per game per skill level and reports the actual distribution. It found a
flagship game paying 2.5 coins a round, a cap that was arithmetically unreachable, and an earn rate
overstated by 46% — none of which was visible from reading the code.

1. **Cloud Dash** — tap-to-fly obstacle avoidance, 40-second rounds, `requestAnimationFrame` physics
   loop, touch and mouse
2. **Baggage Match** — 16-card memory match against a 45-second clock. Cards sit face-down as closed
   suitcases and flip to reveal what is packed inside; payout scales with time left **and** moves
   used, so memory counts rather than tapping speed
3. **Candy Rush** — 7×7 match-3 with cascade resolution, a 20-move budget, combo multipliers,
   illegal-swap rejection and dead-board reshuffling

## 2.6 Care loop — feeding

Treats earned from check-ins are fed to Berry. Feeding does **not** pay currency; every **5 treats
fed earns a free blindbox**, so care feeds the collection rather than the wallet. If Berry holds
treats and hasn't been fed for two days he visibly looks unhappy — mood only, nothing is taken away.

## 2.7 Collection — passport, medals, wardrobe

- **Passport:** 35 real UO destinations across 8 countries, grouped by country. Each flight awards a
  stamp; the **first landing in each country** unlocks that country's exclusive cosmetic
- **Flight records:** tapping a stamp opens the full travel history for that destination — flight
  number, date, route, departure and arrival times, gate, seat, coins earned, and what it unlocked
- **Medals:** five tiered awards (trips, check-in streak, destinations, cosmetics, lifetime coins),
  each climbing Copper → Silver → Gold → Diamond with the distance to the next tier shown, plus four
  region-completion badges
- **Wardrobe:** browse, preview and equip all 25 cosmetics across three slots

## 2.8 Blindbox and redemption

- **Blindbox** at 800 coins or a free ticket. **Published odds — Common 60% / Rare 30% / Epic 10%** —
  with duplicate protection (unowned items preferred within a tier) and a 20-coin refund on an
  unavoidable duplicate. Rarity-tiered reveal animation
- **Odds disclosure screen** listing every rarity percentage, the items in each tier, the full
  check-in calendar and the feeding conversion. This mirrors real gacha disclosure obligations
- **Redemption catalogue:** 22 rewards across six tabs (Drinks, Snacks, Meals, Sweets, Berry,
  Travel), priced against the **real HK Express inflight menu**. Pricing separates the coin's **book
  value** (1 coin = HK$0.01, the accounting liability) from its **shelf price**, which applies a
  markup rising with what a reward costs to fulfil — 100 coins/HK$ for zero-cost perks, 160 for
  discount coupons, 200 for real merchandise. **Every onboard reward is a percentage discount (5% / 7.5% / 10%), never a free
  item**, so the customer always pays the balance. Two rules protect margin: no discount exceeds
  **HK$10**, and none exceeds **a third of the retail price** of what it applies to. Every tab
  carries an entry reachable in 3–12 days of typical play. Redeeming issues a **voucher with a
  unique code**, redeemable from ticket purchase until online check-in, **capped at one outstanding
  voucher per reward** — an unused voucher blocks a second of the same kind until it is marked used,
  so coupons cannot be stockpiled

## 2.9 Expiry

- **Berry coins** lapse **180 days after the balance starts from zero**. One clock per balance, set
  once and never extended by earning more — spend it or lose it. Spending down to zero clears it, so
  the next coin earned starts a fresh window. Lifetime earnings are unaffected, so medals are never
  retroactively demoted
- The balance, its deadline and the rule are reachable by **tapping the coin count in the header**
- **Vouchers** expire **180 days from issue**, with the date shown on the voucher
- An expired voucher **releases the one-outstanding slot**, so expiry can never permanently lock a
  reward out
- Applied as a lazy sweep on load and whenever the clock moves, since time passes while the app is
  closed. Deliberately not gated by offline mode — expiry is the passage of time, not an economic
  action, and only ever removes value
- Both windows are disclosed in the in-app odds sheet alongside the drop rates and ticket rules
- **Why:** unbounded balances are an unbounded liability that can never be written off, and undated
  coupons get redeemed against a menu and cost base that have moved on

## 2.10 In-flight (offline) mode

Models the aircraft cabin, and is the core anti-abuse design:

- **Blocked offline:** daily check-in, blindboxes, coupon redemption, feeding, flight completion
- **Still available:** all three minigames (unlimited), the wardrobe, the room, the passport, and
  any vouchers already issued
- Minigames pay **nothing** offline, post no leaderboard score, and deliberately do **not** consume a
  play ticket
- Because nothing accrues offline there is no queue to reconcile, no cap to tune, and no way to farm
  rewards by disabling the network
- Enforcement is a single gate covering all value-moving operations, not per-screen checks

## 2.11 Demonstration tooling (PoC only)

A presenter panel with a virtual clock (advance a day, skip a week, jump to a 29-day streak),
simulate a flight to any destination, grant currency or treats, toggle in-flight mode, and reset.
**This would not ship in production**, but it is what makes a 30-day habit loop demonstrable in five
minutes.

---

# PART 3 — UI requirements

## 3.1 Platform and layout

- **Mobile-first**, portrait. Verified at 390×844 and 430×860
- **Fixed app chrome:** header and bottom tab bar stay locked while only the content scrolls
- Five tabs: Berry (home), Play, Collection, Rewards, Trips
- Bottom-sheet modals for care, odds, flight records and destination pickers
- Full-screen overlays for the three minigames

## 3.2 Visual language

- Brand palette sampled from the live UO app: **#6F2B90** header, **#77279A** headings, **#5B0E80**
  navigation active, **#F5F5F5** page background, white cards
- Host app chrome is matched faithfully; the playful styling is confined to Berry's own content so
  the feature reads as part of the airline app, not a separate product
- Rounded typeface (Nunito), generous corner radii, soft shadows, sticker-style badges with white
  outlines
- ~10 illustrated states for the character plus 22 hand-drawn prop items

## 3.3 Motion

- Reward reveals, celebration bursts, confetti, page transitions, squash-and-stretch character
  reactions, coin count-ups, stamp impressions, card flips
- **Constraint:** animations use `transform` and `opacity` only, to stay off the layout path
- `prefers-reduced-motion` is respected throughout
- Presenter-safe: any celebration can be skipped with a tap

## 3.4 Accessibility

- Interactive elements are real buttons with labels; the character itself is keyboard-focusable and
  activatable
- Decorative art is hidden from assistive technology
- Reduced-motion support
- *Not yet done:* full screen-reader audit, contrast audit against WCAG AA, dynamic type support,
  localisation

## 3.5 Content and localisation

- **English only** at present. A Hong Kong deployment realistically needs Traditional Chinese and
  Simplified Chinese — all UI strings plus 47 dialogue lines, item names, destination names, reward
  copy and legal text
- Content that needs an authoring pipeline in production: seasonal cosmetics, new destinations,
  reward catalogue and pricing, dialogue, campaign events

---

# PART 4 — What production adds (the real cost drivers)

Not built in the PoC. These are what separate a demo from a shipped feature.

**Backend and platform**
- Authoritative game service: currency ledger, inventory, streaks, blindbox rolls, voucher issuance
- Server-side RNG with auditable, published odds
- Anti-fraud and anti-cheat: no client may mint currency; clock-tamper detection for streaks
- Account system integration and session management
- Data migration and versioning for live players

**Integration with airline systems**
- Identity / SSO with UO accounts
- Booking and flight status data, to award stamps on real flights
- Loyalty or voucher platform, so coupons are real and honoured at the counter and onboard
- Inflight retail and merchandise fulfilment for redeemed rewards
- Customer service tooling for disputes ("my voucher didn't work")

**Mobile delivery**
- Rebuild in the host app's stack; integration with its navigation, auth and design system
- iOS and Android release process, app store review — including **loot-box disclosure rules**, which
  the odds screen already anticipates
- Offline-first sync, push notifications for streak reminders, device performance testing

**Quality, security, compliance**
- Automated test suite (the PoC has none), QA across device matrix
- Security review and penetration testing
- Privacy compliance, data retention, consent
- Accessibility conformance
- Legal review of a virtual currency with real-world redemption value

**Live operations (ongoing, annual)**
- Seasonal content and campaign calendar; new destinations as the network changes
- Economy tuning and balancing from live data
- Analytics, dashboards, A/B testing
- Hosting, monitoring, on-call, support
- Community management and content moderation if social features are added

---

# PART 5 — Questions that materially change the estimate

Answer these before asking for a number:

1. **Which scope — A, B or C** from §0?
2. **Native, or the app's existing cross-platform framework?** Determines whether this is one
   codebase or two
3. **Does a suitable backend already exist**, or is the game service greenfield?
4. **Are vouchers real?** Real-world redemption pulls in loyalty integration, finance, legal and
   fraud — a large multiplier
5. **How many languages** at launch?
6. **Is flight data available** to award stamps automatically, or is it manual/self-reported?
7. **Who produces art** for ongoing cosmetic drops — agency, in-house, or fixed launch set?
8. **What live-ops cadence** is expected: a static launch, or seasonal campaigns?
9. **Build, buy or partner** — some gamification platforms could cover part of this

---

## Appendix — content inventory

| Item | Count |
| --- | --- |
| Destinations | 35 across 8 countries |
| Country exclusive cosmetics | 8 |
| Total cosmetics | 25 (3 looks + 22 props) |
| Consumable treats | 3 |
| Redemption rewards | 8 |
| Medals | 5 tiered (4 tiers each) + 4 region badges |
| Minigames | 3 |
| Dialogue lines | 47 |
| Screens | 5 main + host entry + 3 game screens + 6 modal sheets |
