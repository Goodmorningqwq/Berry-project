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
  at. This is the accounting number.
- **Shelf price — set by UO, above book value.** The markup is UO's margin and the only real lever on
  what the programme gives away. The app has never advertised an exchange rate and still doesn't; it
  just shows prices.

**Berry coins are not a rebate.** Airline miles are worth 1.2–1.6 US cents because they're earned by
*spending* — they discount revenue already booked. Berry coins are earned by *playing*, so they're
retention marketing spend, priced as marketing rather than as yield.

### Menu prices are real

Every `retail` figure in `src/data/rewards.js` comes from the HK Express *Inflight Gourmet Meals and
Deals* menu:

| Category | Menu price |
| --- | --- |
| Bottled water (Bonaqua 250mL) | HK$10 |
| Juice / tea cartons (Hi-C, oolong, Qoo, café mocha) | HK$20 |
| Cans (Coca-Cola, Sprite) | HK$25 |
| Signature drinks (milk tea, lattes, salted lime Sprite) | HK$40 hot / HK$45 cold |
| Packet snacks (Doritos, Haribo, Meiji, Ginbis, mini rusk) | HK$20 |
| Pringles 48g | HK$25 |
| Cup noodles (Nissin, Nong Shim) | HK$30 |
| Light bites (rice noodle rolls, pineapple bun, sandwich set) | HK$35–45 |
| Combos (street food combo, mac & cheese) | HK$65 |
| Hearty mains (Satay King, Tsui Wah, A-1 carbonara) | HK$75 |
| Desserts (egg waffle, red bean soup) | HK$35 |
| Häagen-Dazs 100mL | HK$40 |
| Drink add-on with any food | **+HK$15** |
| Signature drink or ice cream add-on | **+HK$30** |

The menu is seasonal, so **these need refreshing when UO changes it**. Reward *wording* is
deliberately generic ("any hot meal", not a named dish) so a new menu doesn't invalidate the
catalogue — only the `retail` figures the discount cap is checked against.

The **+HK$15 drink add-on** is why "Free drink with any meal" has a face value of exactly HK$15: it is
UO's own price for that upgrade, not a guess.

### The markup schedule

Markup rises with what a reward actually costs UO to fulfil (`MARKUP` in `src/data/rewards.js`):

| Tier | Rate | Applied to | Why |
| --- | --- | --- | --- |
| **`free`** | **100 coins/HK$** | face value | Nothing to fulfil — digital goods, seat selection. The hook, meant to be redeemed. |
| **`coupon`** | **160 coins/HK$** | the discount | Customer pays the balance on a ~60%-margin item, so UO nets money on a sale that often wouldn't have happened. |
| **`freebie`** | **200 coins/HK$** | **UO's unit cost** | A whole free item with no offsetting sale, so it prices off `unitCost` (~35% of menu price), not retail. |
| **`merch`** | **200 coins/HK$** | face value | Real COGS, priced as the aspiration. |

**Why freebies price off cost.** A bottle of water retails at HK$10 but costs UO around HK$3. Priced
off retail it would cost 2,000 coins — more than HK$20 off a main — which is absurd for a bottle of
water. Priced off the HK$3 it lands at 600 coins, about nine days, which is where an entry reward
belongs.

Each reward carries its own `tier`, deliberately separate from `kind` (the tab it appears under).
Standard seat selection is a travel extra to the customer but costs UO nothing to give, so it sits in
the Travel tab at the `free` rate. Collapsing the two would misprice it.

**Discount cap:** no coupon exceeds a third of the `retail` of the cheapest item it applies to, so the
customer always pays the balance and every coupon redemption stays margin-positive. Two rewards were
tuned to satisfy it against the real menu — the Signature Drink discount is HK$12 rather than HK$15
(HK$15 on a HK$40 drink is 38%), and the free dessert pairs with a Hearty Bites main rather than any
hot meal (32% instead of 35%).

**Holding cap — one outstanding voucher per reward.** An unused voucher blocks redeeming another of
the same reward, so nobody banks ten drink coupons and uses them all on one flight. Tapping a
voucher marks it used and frees the slot. That works in flight (onboard is where a coupon is spent);
only *issuing* new vouchers is frozen offline.

### The catalogue — 23 rewards, six tabs

| Reward | Tier | Priced from | Price | Days |
| --- | --- | --- | --- | --- |
| **Drinks** | | | | |
| Free bottled water | freebie | cost HK$3 | **600** | ~9 |
| HK$5 off any drink | coupon | HK$5 | **800** | ~12 |
| Free juice or tea carton | freebie | cost HK$7 | **1,400** | ~21 |
| HK$12 off any Signature Drink | coupon | HK$12 | **1,920** | ~29 |
| **Snacks** | | | | |
| HK$5 off any snack | coupon | HK$5 | **800** | ~12 |
| Free packet snack | freebie | cost HK$7 | **1,400** | ~21 |
| HK$10 off any cup noodles | coupon | HK$10 | **1,600** | ~24 |
| **Meals** | | | | |
| HK$5 off any light bite | coupon | HK$5 | **800** | ~12 |
| HK$10 off any hot meal | coupon | HK$10 | **1,600** | ~24 |
| Free drink with any meal | coupon | HK$15 | **2,400** | ~36 |
| HK$20 off any Hearty Bites main | coupon | HK$20 | **3,200** | ~48 |
| **Sweets** | | | | |
| HK$5 off any dessert | coupon | HK$5 | **800** | ~12 |
| Free ice cream cup | freebie | cost HK$14 | **2,800** | ~42 |
| Free dessert with a Hearty Bites main | coupon | HK$35 | **5,600** | ~85 |
| **Berry** | | | | |
| Berry wallpaper pack | free | HK$2 | 200 | ~3 |
| Berry sticker pack | free | HK$3 | 300 | ~5 |
| Berry enamel pin badge | merch | HK$12 | 2,400 | ~36 |
| Berry luggage tag | merch | HK$40 | 8,000 | ~4 months |
| Berry tote bag | merch | HK$55 | 11,000 | ~5.5 months |
| Berry plush | merch | HK$75 | 15,000 | ~7.5 months |
| **Travel** | | | | |
| Standard seat selection | free | HK$5 | 500 | ~8 |
| Front-row seat selection | coupon | HK$50 | 8,000 | ~4 months |
| 3kg extra baggage | coupon | HK$75 | 12,000 | ~6 months |

Plus the blindbox at **800**.

**Every tab opens on something reachable inside two weeks** — 9, 12, 12, 12, 3 and 8 days. That is the
property this catalogue exists to hold, and it is asserted in `scratchpad/economy.mjs` rather than
eyeballed: an earlier revision failed it on two tabs.

---

## What the programme costs UO

Costed **per tier**, not as one blended percentage, because the tiers differ enormously:

| Tier | UO cost per redemption | **Cost per 1,000 coins redeemed** |
| --- | --- | --- |
| `free` | nothing | **HK$0** |
| `coupon` | ~40% of the discount | **HK$2.50** |
| `merch` | ~65% of face (real COGS) | **HK$3.25** |
| `freebie` | the unit cost outright | **HK$5.00** |

**Freebies cost exactly 2× what coupons do per coin**, because a coupon is partly paid for by the
sale it triggers and a freebie is not. That is the deliberate price of offering a whole free item,
which motivates far better than a few dollars off — but it is a real cost and is stated, not hidden.

Blended evenly across the catalogue, a coin costs UO about **HK$2.74 per 1,000**.

### At 10,000 registered players

Engagement figures are assumptions and are stated so they can be challenged. Coin rates are computed
from the live constants by `scratchpad/economy.mjs`.

| Segment | Share | Users | Active days/wk | Rounds/active day |
| --- | --- | --- | --- | --- |
| Daily | 15% | 1,500 | 7 | 3 |
| Regular | 35% | 3,500 | 4 | 2 |
| Lapsed | 50% | 5,000 | 1 | 1 |

**Coins issued per day: ~208,700** — check-in ~42,100 (20%), games ~166,600 (80%). Games issue four
times what check-in does, which is why the **ticket cap**, not the payout curve, is the control that
actually bounds the programme.

Assuming **25% breakage** (coins earned but never redeemed; loyalty programmes typically see 20–30%):

| | |
| --- | --- |
| Coins redeemed/day | ~156,500 |
| **True cost per day** | **~HK$429** |
| — from check-in | ~HK$87 |
| — from games | ~HK$342 |
| Per month | ~HK$12,900 |
| Per year | ~HK$156,500 |
| Per registered user per year | **HK$15.65** |

**This is up 9% on the previous ~HK$395/day**, and the increase is entirely the freebie tier. Adding
whole free items to the catalogue costs real money; the model surfaces that rather than burying it in
an averaged percentage.

Against a customer worth ~HK$3,000/year, HK$15.65 is **0.5% of revenue**, comfortably inside the 1–3%
loyalty benchmark, and before counting any incremental ancillary sales the coupons trigger.

**Worst case**, if all 10,000 were daily actives — which no programme achieves, but it bounds the
risk: 655,000 coins/day, **~HK$1,346/day, ~HK$491,000/year**.

Three caveats worth carrying into the pitch, because they are what a finance reviewer will push on:
the 25% breakage and the 15/35/50 engagement split are assumptions rather than measurements; the ~35%
unit-cost assumption behind freebies drives the largest single line; and the blend assumes redemptions
spread evenly across the catalogue, when in practice the *mix* of what people actually redeem moves
the total more than any single price does.

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
| Real menu prices | `src/data/rewards.js` — each reward's `retail`; refresh when UO reissues the menu |
| Free-item unit costs | `src/data/rewards.js` — each freebie's `unitCost` (~35% of menu price) |
| Check-in calendar | `src/data/checkin.js` |
| Redemption prices | `src/data/rewards.js` — `priceOf()`: basis × `MARKUP[tier]` |

**In-flight:** all three games stay playable and unlimited, but pay **0 coins**, post no leaderboard
score, and **consume no ticket** (so there is nothing to refund either) — everything waits until
landing. Nothing accrues offline, which is
what removes any queue, cap or reconciliation problem on reconnect.
