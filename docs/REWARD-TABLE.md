# Minigame Reward Table

Berry coin payouts for all three minigames, taken from the live formulas.

**Entry is by ticket.** Everyone gets **3 play tickets a day** (`DAILY_TICKETS` in
`src/state/store.jsx`), spendable on whichever games they like — three rounds of one game, or one of
each. The ticket is taken **on entry** so the balance reads honestly while you play, but **leaving
without collecting hands it straight back**: you only pay for a round you take the coins from. Every
7th consecutive check-in grants a **bonus ticket**, and you can hold at most **5** at once.

Every game pays a **floor of 1 coin** and caps at **35**. The floor is deliberately a token amount —
enough that a round is never literally worthless, small enough that **idling through a round is never
worth a ticket**. All three caps are genuinely reachable.

| Game | Score metric | Formula | Cap reached at | Round length |
| --- | --- | --- | --- | --- |
| Cloud Dash | coins caught in the air | `min(35, 1 + ⌊coins × 1.7⌋)` | 20 coins | 40 seconds |
| Baggage Match | seconds left on the clock | `solved ? min(35, 1 + ⌊left × 0.68⌋) : 1` | 50s to spare | 60 seconds |
| Candy Rush | points scored | `min(35, 1 + ⌊points ÷ 70⌋)` | ~2,400 points | 20 moves |

---

## Cloud Dash

Tap to fly, dodge clouds, collect coins. Each coin caught is worth 1.7 berry coins.

| Coins caught | 0 | 2 | 4 | 6 | 8 | 12 | 16 | **20+** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Payout** | **1** | 4 | 7 | 11 | 14 | 21 | 28 | **35** |

Highest variance of the three — one bad cloud ends the round near the floor.

## Baggage Match

Match 8 pairs against a 60-second clock. Paid on the time you have left, so a faster clear pays more.

| Seconds left | unsolved | 0 | 10 | 20 | 30 | 40 | **50+** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Payout** | **1** | 1 | 7 | 14 | 21 | 28 | **35** |

Failing pays the floor of 1 rather than nothing, and the "out of time" card carries a Collect button
so it is claimable — but at 1 coin it is a consolation, not an income.

This is the steadiest earner, because solving the board is the most reliable outcome of the three.

## Candy Rush

7×7 match-3 with a 20-move budget. Cascades multiply, so chains are where the points are.

| Points | 0 | 400 | 800 | 1,200 | 1,600 | 2,000 | **2,380+** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Payout** | **1** | 6 | 12 | 18 | 23 | 29 | **35** |

Typical rounds in testing scored 600–1,300, paying 9–19.

---

## What a day is worth

| | Cloud Dash | Baggage Match | Candy Rush |
| --- | --- | --- | --- |
| Floor (idled) | 1 | 1 | 1 |
| Typical round | ~14 (8 coins) | ~24 (35s left) | ~15 (1,000 pts) |
| Best possible | 35 | 35 | 35 |

Tickets are what bound the day, not the games:

| | Per round | × 3 tickets | + check-in | **Day total** |
| --- | --- | --- | --- | --- |
| Idled | 1 | 3 | ~10 | **~13** |
| Typical | ~18 | 54 | ~10 | **~64** |
| Skilled | 35 | 105 | ~10 | **~115** |

Measured over 30 days (`scratchpad/economy.mjs`, using the real check-in calendar and the weekly
bonus ticket):

| | Coins/month | Book value | Face value at shelf prices |
| --- | --- | --- | --- |
| Idling every round | 389 | HK$3.89 | ~HK$2.46 |
| Typical daily player | **1,987** | HK$19.87 | **~HK$12.55** |
| Skilled daily player | **3,585** | HK$35.85 | **~HK$22.65** |

Book value is what UO accrues as liability; face value at shelf prices is what those coins actually
buy once the store markup is applied. See [What the programme costs UO](#what-the-programme-costs-uo)
for the difference and why it matters.

**The floor is what makes AFK pointless.** Three idled rounds pay 3 coins — 100 days for the cheapest
reward — so a bot or an idle tab earns essentially nothing while a player who actually engages earns
in days. The gap between idling and playing is the whole point of the curve.

The daily check-in alone pays 70 coins a week (`WEEKLY_COINS`), or ~300/month. Completing a flight
pays a separate **50 coins**, and feeding Berry pays no coins at all — every 5 treats fed earns a
free blindbox instead.

---

## What coins are worth: book value vs shelf price

**Two different numbers, and conflating them is the mistake to avoid.**

- **Book value — 1 coin = HK$0.01** (`COINS_PER_HKD`). What UO carries the outstanding coin liability
  at. This is the accounting number and the one the costing model below uses.
- **Shelf price — set by UO, above book value.** The markup is UO's margin and the only real lever on
  what the programme gives away. The app has never advertised an exchange rate and still doesn't; it
  just shows prices.

**Berry coins are not a rebate.** Airline miles are worth 1.2–1.6 US cents because they're earned by
*spending* — they discount revenue already booked. Berry coins are earned by *playing*, so they're
retention marketing spend, which is why they're priced as marketing rather than as yield.

### The markup schedule

Markup rises with what a reward actually costs UO to fulfil (`MARKUP` in `src/data/rewards.js`):

| Tier | Markup | Why |
| --- | --- | --- |
| **`free`** — zero-cost perks | **100 coins/HK$** | Nothing to fulfil, so priced at book value. These are the hook and are meant to be redeemed often. |
| **`coupon`** — margin-positive discounts | **160 coins/HK$** | The customer still pays the balance on a ~60%-margin item, so UO nets money on a sale that often wouldn't have happened. |
| **`merch`** — real merchandise | **200 coins/HK$** | Genuine COGS with no offsetting sale. Priced as the aspiration, not the expectation. |

Each reward carries its own `tier`, deliberately separate from `kind` (the tab it appears under).
Standard seat selection is a travel extra to the customer but costs UO nothing to give, so it sits in
the Travel extras tab at the `free` rate. Collapsing the two would misprice it.

**Discount cap:** no coupon exceeds roughly a third of the retail price of what it discounts, so
every coupon redemption stays margin-positive. HK$5 off a HK$30 snack still has the customer spending
HK$25.

**Holding cap — one outstanding voucher per reward.** An unused voucher blocks redeeming another of
the same reward, so nobody banks ten drink coupons and uses them all on one flight. Tapping a
voucher marks it used and frees the slot. That works in flight (onboard is where a coupon is spent);
only *issuing* new vouchers is frozen offline.

### The catalogue

| Reward | Tier | Face | Price | Days of typical play |
| --- | --- | --- | --- | --- |
| Berry wallpaper pack | free | HK$2 | **200** | ~3 |
| Berry sticker pack | free | HK$3 | **300** | ~5 |
| HK$3 off an inflight drink | coupon | HK$3 | **480** | ~7 |
| Standard seat selection | free | HK$5 | **500** | ~8 |
| HK$5 off an inflight snack | coupon | HK$5 | **800** | ~12 |
| HK$5 off an inflight meal | coupon | HK$5 | **800** | ~12 |
| Blindbox | — | ~HK$8 | 800 | ~12 |
| Berry enamel pin badge | merch | HK$12 | **2,400** | ~36 |
| Berry luggage tag | merch | HK$40 | **8,000** | ~4 months |
| Front-row seat selection | coupon | HK$50 | **8,000** | ~4 months |
| Berry tote bag | merch | HK$55 | **11,000** | ~5.5 months |
| 3kg extra baggage | coupon | HK$75 | **12,000** | ~6 months |
| Berry plush | merch | HK$75 | **15,000** | ~7.5 months |

**Every tab has a reachable entry** — 3, 7, 36 and 8 days respectively, and six rewards sit inside a
fortnight. That is the point of the shape: a tab whose cheapest item is months away reads as a wall, and a new player who sees nothing
attainable leaves. The long tail at the top is what a genuinely committed player aims at over a
half-year, which is the habit the brief asks for.

---

## What the programme costs UO

Per daily player, over 30 days:

| | Face value/month | True cost (~40%) |
| --- | --- | --- |
| At flat book value | HK$19.87 | HK$7.95 |
| **At store markup** (~158 blended) | **HK$12.55** | **HK$5.02** |

The markup cuts exposure by **37%**. Note that shrinking individual coupons would *not* have done
this: while every price was face value × 100, exposure was fixed at earn rate ÷ 100 no matter what
the catalogue contained. Only the markup moves it.

### At 10,000 registered players

Engagement figures are assumptions and are stated so they can be challenged. Coin rates are computed
from the live constants by `scratchpad/economy.mjs`.

| Segment | Share | Users | Active days/wk | Rounds/active day | Coins/day each |
| --- | --- | --- | --- | --- | --- |
| Daily | 15% | 1,500 | 7 | 3 | 65.5 |
| Regular | 35% | 3,500 | 4 | 2 | 25.9 |
| Lapsed | 50% | 5,000 | 1 | 1 | 4.0 |

**Coins issued per day: ~208,700** — check-in ~42,100 (20%), games ~166,600 (80%). Games issue four
times what check-in does, which is why the **ticket cap**, not the payout curve, is the control that
actually bounds the programme.

Assuming **25% breakage** (coins earned but never redeemed; loyalty programmes typically see 20–30%)
and **true cost ≈ 40% of face**:

| | Flat book value | With store markup |
| --- | --- | --- |
| Face issued/day | HK$2,087 | HK$1,318 |
| — from check-in | HK$421 | HK$266 |
| — from games | HK$1,666 | HK$1,052 |
| After 25% breakage | HK$1,565 | HK$989 |
| **True cost per day** | **~HK$626** | **~HK$395** |
| Per month | ~HK$18,800 | ~HK$11,900 |
| Per year | ~HK$228,500 | ~HK$144,300 |
| Per registered user per year | HK$22.85 | **HK$14.43** |

**The markup saves ~HK$231/day — about HK$84,000 a year at this size.**

Against a customer worth ~HK$3,000/year, HK$14.43 is **0.5% of revenue**, comfortably inside the
1–3% loyalty benchmark, and before counting any incremental ancillary sales the coupons trigger.

**Worst case**, if all 10,000 were daily actives — which no programme achieves, but it bounds the
risk: 655,000 coins/day, ~HK$1,242/day, **~HK$453,000/year**. Even fully saturated the programme
costs under HK$0.5M a year.

Three caveats worth carrying into the pitch, because they are what a finance reviewer will push on:
the 25% breakage and the 15/35/50 engagement split are assumptions rather than measurements; and the
40% true-cost figure is blended — merchandise runs 60–70% COGS while the wallpaper and sticker packs
cost nothing, so the *mix* of what people actually redeem moves the total more than any single price
does.

---

## Where these are tuned

| Value | Location |
| --- | --- |
| Cloud Dash payout | `src/games/CloudDash.jsx` — `const reward` |
| Baggage Match payout | `src/games/BaggageMatch.jsx` — `const reward` |
| Candy Rush payout | `src/games/CandyRush.jsx` — `const reward` |
| Tickets per day / cap / streak bonus | `src/state/store.jsx` — `DAILY_TICKETS`, `TICKET_CAP`, `TICKET_STREAK_BONUS` |
| Coin book value | `src/state/store.jsx` — `COINS_PER_HKD` |
| Store markup schedule | `src/data/rewards.js` — `MARKUP`, and each reward's `tier` |
| Check-in calendar | `src/data/checkin.js` |
| Redemption prices | `src/data/rewards.js` — each entry's `hkd` × `MARKUP[tier]` |

**In-flight:** all three games stay playable and unlimited, but pay **0 coins**, post no leaderboard
score, and **consume no ticket** (so there is nothing to refund either) — everything waits until
landing. Nothing accrues offline, which is
what removes any queue, cap or reconciliation problem on reconnect.
