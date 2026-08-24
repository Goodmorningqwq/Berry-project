# Minigame Reward Table

Berry coin payouts for all three minigames, taken from the live formulas and **measured by
simulation**, not assumed.

**Entry is by ticket.** Everyone gets **3 play tickets a day** (`DAILY_TICKETS` in
`src/state/store.jsx`), spendable on whichever games they like — three rounds of one game, or one of
each. The ticket is taken **on entry** so the balance reads honestly while you play, but **leaving
without collecting hands it straight back**: you only pay for a round you take the coins from. Every
7th consecutive check-in grants a **bonus ticket**, and you can hold at most **5** at once.

Every game pays a **floor of 1 coin** and caps at **23**. The floor is deliberately a token amount —
enough that a round is never literally worthless, small enough that **idling through a round is never
worth a ticket**.

| Game | Score metric | Formula | Cap reached at | Round |
| --- | --- | --- | --- | --- |
| Cloud Dash | coins caught in the air | `min(23, 1 + ⌊coins × 1.45⌋)` | 16 coins | 40 seconds |
| Baggage Match | seconds left **and** moves used | `solved ? min(23, 1 + ⌊left × 0.76 + (16−moves) × 1.0⌋) : 1` | ~26s left in 11 moves | 45 seconds |
| Candy Rush | points scored | `min(23, 1 + ⌊points ÷ 197⌋)` | ~4,340 points | 20 moves |

---

## How these were set: simulation, not guesswork

`scratchpad/payout-dist.mjs` replays each game's real logic — Cloud Dash's physics loop, Baggage
Match's deck and clock, Candy Rush's board, cascades and refills — **20,000 rounds per game per skill
level**, driven by three player models. Only the player model is invented; every constant and formula
is copied from the game files.

That measurement found three defects that no amount of reading the code had surfaced:

| Defect | Evidence |
| --- | --- |
| **Cloud Dash barely paid** | An average player earned **2.5 coins** and hit the 1-coin floor **37%** of rounds. The flagship game was nearly worthless. |
| **Baggage Match's cap was unreachable** | 35 needed 8 pairs solved in 15 seconds with 16 cards to reveal. **0 hits in 60,000 rounds**; the true ceiling was ~26. The docs claimed all three caps were reachable — they were wrong. |
| **Candy Rush was a slot machine** | Random play scored **19.5** against optimal play's **21.0**. Skill was worth 8%, and it was the biggest earner, so the game where play barely mattered set the shape of the whole economy. |

And the economy had been assuming **17.7 coins per round** when the measured population figure was
**10.4** — a 70% overstatement flowing into every reward price and cost projection.

### What changed

- **Cloud Dash** — obstacle gap widened **168 → 210px** and the multiplier raised **1.7 → 2.2**. The
  gap was the real fix; the multiplier alone would have paid more for a game you still could not
  play.
- **Baggage Match** — clock tightened **60 → 45s**, and payout now counts **moves as well as time**.
  Time alone made it a flat plateau with near-zero variance; the move bonus rewards memory, which is
  the skill the game is actually about, and gives the cap a real if rare route.
- **Candy Rush** — divisor **70 → 130**, plus a **×1.6 bonus on runs of 4+**. Since tickets let a
  player choose their game, the best-paying game sets the whole economy, so the three have to land
  near each other or one of them is simply the correct answer.

**Then everything was scaled down by a third.** A coupon took 3–22 days, which is far too fast for a
reward you spend onboard when people fly perhaps twice a year. Payouts were cut ~34% and the cap
lowered **35 → 23** in proportion. The cap had to move with them: scaling the multipliers alone would
have put Baggage Match's cap out of reach again, the exact defect this simulation was built to catch.
Cloud Dash is now `×1.45`, Baggage `×0.76` on time with a `1.0` move bonus, and Candy `÷197`.

### What they pay now

Average player, 20,000 rounds each:

| Game | Before | After | Floor rate | Notes |
| --- | --- | --- | --- | --- |
| Cloud Dash | 2.5 | **4.4** | 37% → **21%** | High variance by design — weak rounds end early, strong rounds cap |
| Baggage Match | 17.9 | **10.9** | 0% → 0.7% | Now has real spread instead of a plateau |
| Candy Rush | 20.3 | **8.9** | 0% | Skill now worth ~16% instead of 8% |

**Population blend (30% weak / 50% average / 20% strong): 8.2 coins per round.** The spread between
the best and worst game for an average player fell from **8×** to **2.5×**.

---

## What a day is worth

| | Per round | × 3 tickets | + check-in | **Day total** |
| --- | --- | --- | --- | --- |
| Idled | 1 | 3 | ~10 | **~13** |
| Measured blend | ~8 | 24 | ~10 | **~35** |
| Skilled | 23 | 69 | ~10 | **~79** |

Over 30 days that is **~1,050 coins**, or **35/day** — the figure every price in the catalogue is
now checked against.

**The floor is what makes AFK pointless.** Three idled rounds pay 3 coins — around 160 days for the
cheapest reward — so a bot or an idle tab earns essentially nothing while a player who engages earns
in days.

The daily check-in alone pays 70 coins a week (`WEEKLY_COINS`), or ~300/month, and is now **27%** of
all coins issued rather than 20%. Completing a flight pays a separate **50 coins**, and feeding Berry
pays no coins at all — every 5 treats fed earns a free blindbox instead.

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

The menu is seasonal, so **these need refreshing when UO reissues it**. Reward *wording* is
deliberately generic ("any hot meal", not a named dish) so a new menu doesn't invalidate the
catalogue — only the `retail` figures the discount cap is checked against.

### Discounts only, never free items

**Every onboard reward is a discount.** The customer always pays the balance, so each redemption is
attached to a sale UO would often not otherwise have made.

Free items were built and then removed. They cost **twice as much per coin** as a discount, because
nothing is bought alongside them to offset the cost, and dropping them cut the programme's cost by
17%. A discount also reads as a better deal than it costs: 10% off a HK$30 cup noodle sounds like a
real offer and costs UO about HK$1.20, because the customer still pays the other HK$27.

### Two rules protect onboard margin

1. **No discount exceeds HK$10** (`MAX_DISCOUNT_HKD`), so no single coupon can swallow the margin on
   a HK$20 snack or a HK$40 drink.
2. **No discount exceeds a third of the `retail`** of the cheapest item it applies to.

Both are asserted in `scratchpad/economy.mjs` against the real menu prices, not eyeballed. The
largest discount in the catalogue is 27% of what it applies to; most sit between 9% and 25%.

The travel extras (front-row seat, 3kg baggage) sit above the HK$10 cap deliberately: they are
capacity-limited rather than a cash cost, and they are the aspiration for that tab rather than an
everyday redemption.

### The markup schedule

Base markup rises with what a reward actually costs UO to fulfil (`MARKUP` in `src/data/rewards.js`):

| Tier | Rate | Why |
| --- | --- | --- |
| **`free`** | **100 coins/HK$** | Nothing to fulfil — digital goods, seat selection. The hook, meant to be redeemed. |
| **`coupon`** | **160 coins/HK$** | Customer pays the balance on a ~60%-margin item, so UO nets money on a sale that often wouldn't have happened. |
| **`merch`** | **200 coins/HK$** | Real COGS, priced as the aspiration. |

Each reward carries its own `tier`, deliberately separate from `kind` (the tab it appears under).
Standard seat selection is a travel extra to the customer but costs UO nothing to give, so it sits in
the Travel tab at the `free` rate. Collapsing the two would misprice it.

### The volume curve — why the ladders aren't proportional

Onboard coupons were briefly priced proportionally: every rung at 160 coins per HK$1, so a HK$8
coupon cost exactly the same per dollar as a HK$3 one. **That is the worst possible shape for a
ladder** — with identical value per coin there is no reason to ever pick the bigger rung, so the
decision collapses to "what can I afford today" and everyone parks on the cheapest one forever. The
tiers become decoration.

The rate now falls as the **percentage** grows (`VOLUME_MARKUP`), exactly like a bulk price:

| Discount | Coins per HK$1 | Saving vs flat |
| --- | --- | --- |
| 5% | 160 | — |
| 7.5% | 150 | 6% |
| 10% | 140 | 13% |

This is the honest version of the **decoy effect** (Huber, Payne & Puto, 1982 — popularised by Dan
Ariely's Economist subscription example, where a deliberately pointless middle option lifted uptake
of the top tier from 32% to 84%). Rather than pricing a middle rung badly so the top *looks* better,
the top rung genuinely *is* better, so the shop survives a customer running the numbers. The top rung
of each tab is flagged **Best value** so the ladder is legible without doing the division.

It costs UO more per coin at the top — HK$2.86 per 1,000 coins on a 10% coupon against HK$2.50 on a
5% one. **That increase is the incentive**: a bigger coupon has to
be worth saving for, or the ladder does nothing. In exchange it buys larger attached baskets and
fewer, later redemptions.

`scratchpad/economy.mjs` asserts the curve is genuinely monotonic per tab and that exactly one rung
per tab carries the badge, so a future edit can't flatten it back by accident.

### Expiry — six months, both

| | Window | Counted from |
| --- | --- | --- |
| **Berry coins** | 180 days | The first time you earn into an **empty** balance. The date is set once and never extended. |
| **Vouchers** | 180 days | The day it was issued, shown on the voucher itself. |

**Spend it or lose it.** The balance carries one clock, started the moment coins go from zero to
something and **never pushed out by earning more**. An earlier version reset the clock on every coin
movement, which meant an active player's coins could never actually expire — that is a dormancy rule
rather than an expiry, and it isn't what this is for.

The known edge: coins earned late in a window inherit whatever time is left, so a payout on day 179
lives one day. The app says so plainly on the coin sheet rather than letting it surprise anyone.
Spending the balance to zero clears the clock, so the next coin earned starts a fresh six months.

`lifetimeCoins` is untouched when a balance lapses, so the Coin Earner medal is never retroactively
taken away.

**An expired voucher frees its slot.** Without that, the one-outstanding cap below would turn into a
trap: letting a coupon lapse would lock that reward out permanently. Expiry has to release it, and
`holdsVoucher()` ignores expired vouchers for exactly this reason.

**Why it exists.** Two reasons, and the second is the honest one: it gives the balance a deadline
that actually arrives, which is what makes a coin worth spending rather than hoarding; and it is
liability hygiene. An unbounded coin balance
is an unbounded liability UO could never write off, and a coupon with no end date can be redeemed
against a menu and a cost base that have both moved on. That is why real programmes have the rule.

Expiry is applied by a lazy sweep on load and whenever the clock moves, since time passes while the
app is closed. It is deliberately **not** gated by in-flight mode — expiry is the passage of time,
not an economic action, and it only ever removes value.

**Holding cap — one outstanding voucher per reward.** An unused voucher blocks redeeming another of
the same reward, so nobody banks ten drink coupons and uses them all on one flight. Tapping a
voucher marks it used and frees the slot. That works in flight (onboard is where a coupon is spent);
only *issuing* new vouchers is frozen offline.

### The catalogue — 22 rewards, six tabs

**Onboard coupons are percentages.** `pct` is the headline the customer sees; `hkd` is what it works
out to against that reward's real menu price, and is the number the costing model uses. The card's
`detail` says what the coupon covers rather than restating the discount in dollars.

| Reward | % | Of | Worth | Price | Days |
| --- | --- | --- | --- | --- | --- |
| **Drinks** | | | | | |
| 5% off any drink | 5% | HK$20 carton | HK$1.00 | **270** | ~8 |
| 7.5% off any drink | 7.5% | HK$20 carton | HK$1.50 | **375** | ~11 |
| 10% off any Signature Drink ⭐ | 10% | HK$40 latte | HK$4.00 | **920** | ~26 |
| **Snacks** | | | | | |
| 5% off any snack | 5% | HK$20 packet | HK$1.00 | **270** | ~8 |
| 7.5% off any snack | 7.5% | HK$20 packet | HK$1.50 | **375** | ~11 |
| 10% off any cup noodles ⭐ | 10% | HK$30 cup | HK$3.00 | **690** | ~20 |
| **Meals** | | | | | |
| 5% off any light bite | 5% | HK$35 bun | HK$1.75 | **475** | ~14 |
| 7.5% off any hot meal | 7.5% | HK$65 combo | HK$4.88 | **1,220** | ~35 |
| 10% off any Hearty Bites main ⭐ | 10% | HK$75 main | HK$7.50 | **1,725** | ~49 |
| **Sweets** | | | | | |
| 5% off any dessert | 5% | HK$35 waffle | HK$1.75 | **475** | ~14 |
| 7.5% off any dessert | 7.5% | HK$35 waffle | HK$2.63 | **655** | ~19 |
| 10% off an ice cream cup ⭐ | 10% | HK$40 tub | HK$4.00 | **920** | ~26 |
| **Berry** — digital, granted instantly | | | | | |
| Berry wallpaper pack | — | — | HK$2 | 200 | ~6 |
| Berry sticker pack | — | — | HK$3 | 300 | ~9 |
| Above the Clouds *(room)* | — | — | HK$6 | 600 | ~17 |
| Sakura Season *(room)* | — | — | HK$9 | 900 | ~26 |
| Island Getaway *(room)* | — | — | HK$9 | 900 | ~26 |
| Seoul Nights *(room)* | — | — | HK$12 | 1,200 | ~34 |
| Cabin Class *(room)* | — | — | HK$15 | 1,500 | ~43 |
| **Merch** — physical | | | | | |
| Berry enamel pin badge | — | — | HK$12 | 840 | ~24 |
| Berry luggage tag | — | — | HK$40 | 2,800 | ~80 |
| Berry plush | — | — | HK$75 | 5,250 | ~150 |

⭐ marks the rung flagged **Best value** in the app.

**Travel ancillaries were removed.** The front-row seat, 3kg extra baggage and the tote bag are gone,
and with them the Travel tab. They cost 8,000–12,000 coins against a hard ceiling of roughly 6,300 —
the most anyone can bank before coins expire — so they were **impossible to buy**, and had been since
expiry shipped. The catalogue is merch or backgrounds now, nothing else.

**Merch came down ~3×** for the same reason: at the old 200 coins/HK$ the plush cost 15,000 and could
never be saved for. At 70 coins/HK$ it is 5,250, about 150 days — inside one 180-day window and close
to the six-month horizon a twice-a-year flyer actually plans around. The cost is that merch now buys
fewer coins per HK$ of face than a coupon does, inverting the logic that real COGS should cost more.
An unreachable reward is worse than an imperfect markup.

**Room backgrounds are new.** Five CSS themes — no image assets — recolouring the wall, window and
floor of Berry's room. They cost UO nothing to fulfil, so they price at book value and act as the
repeatable sink for players who have already bought the coupons they need.

Percentages sit far inside both margin rules: the largest coupon is worth HK$7.50, a tenth of the
main it discounts, against a HK$10 ceiling and a one-third-of-retail ceiling.

**Every tab opens on something reachable in a fortnight — except Merch, which gets 30 days.** At the
measured 35 coins a day that is 8, 8, 14, 14 and 6 days for the food and Berry tabs, and 24 for the
pin badge. Physical goods with real COGS cannot have a one-week rung, so the assertion encodes the
difference (`REACHABLE_DAYS`) rather than being loosened for everyone.

**And every reward is now buyable inside one 180-day coin window**, asserted separately. That was not
true before this round.

Plus the blindbox at **50**.

---

## What the programme costs UO

Costed **per tier**, not as one blended percentage:

| Tier | UO cost per redemption | **Cost per 1,000 coins redeemed** |
| --- | --- | --- |
| `free` | nothing | **HK$0** |
| `coupon` | ~40% of the discount | **HK$1.47 – HK$1.74** (rises up the ladder) |
| `merch` | ~65% of face (real COGS) | **HK$9.29** |

Blended across the catalogue, a coin costs UO about **HK$2.14 per 1,000**.

Note the inversion: merch is now by far the *most* expensive tier per coin, because its price came
down while its COGS did not. That is the real cost of making the plush reachable, and it is the
number to watch if merch redemptions turn out to be popular.

### At 10,000 registered players

Engagement figures are assumptions and are stated so they can be challenged. Coin rates are computed
from the live constants by `scratchpad/economy.mjs`.

| Segment | Share | Users | Active days/wk | Rounds/active day |
| --- | --- | --- | --- | --- |
| Daily | 15% | 1,500 | 7 | 3 |
| Regular | 35% | 3,500 | 4 | 2 |
| Lapsed | 50% | 5,000 | 1 | 1 |

**Coins issued per day: ~119,500** — check-in ~42,100 (35%), games ~77,300 (65%). Games still issue
nearly twice what check-in does, so the **ticket cap** remains the control that bounds the programme —
though after the payout cut, check-in is a meaningfully larger share than it was.

Assuming **25% breakage** (coins earned but never redeemed; loyalty programmes typically see 20–30%):

| | |
| --- | --- |
| Coins redeemed/day | ~89,600 |
| **True cost per day** | **~HK$192** |
| — from check-in | ~HK$68 |
| — from games | ~HK$124 |
| Per month | ~HK$5,800 |
| Per year | ~HK$70,000 |
| Per registered user per year | **HK$7.00** |

**Down 31% on last round's ~HK$279/day**, and down 55% on the ~HK$429 the free-item catalogue cost.
The latest cut comes from slowing the grind on both dials at once — a third off game payouts and a
~70% rise in coupon prices — so a coupon takes about a month rather than a few days.

Against a customer worth ~HK$3,000/year, HK$7.00 is **0.23% of revenue**, comfortably inside the 1–3%
loyalty benchmark, and before counting any incremental ancillary sales the coupons trigger.

**Worst case**, if all 10,000 were daily actives — which no programme achieves, but it bounds the
risk: **~HK$575/day, ~HK$210,000/year**.

Two caveats worth carrying into the pitch, because they are what a finance reviewer will push on: the
25% breakage and the 15/35/50 engagement split are assumptions rather than measurements; and the
blend assumes redemptions spread evenly across the catalogue, when in practice the *mix* of what
people actually redeem moves the total more than any single price does.

---

## Where these are tuned

| Value | Location |
| --- | --- |
| Cloud Dash payout | `src/games/CloudDash.jsx` — `const reward` |
| Baggage Match payout | `src/games/BaggageMatch.jsx` — `const reward` |
| Candy Rush payout | `src/games/CandyRush.jsx` — `const reward` |
| Tickets per day / cap / streak bonus | `src/state/store.jsx` — `DAILY_TICKETS`, `TICKET_CAP`, `TICKET_STREAK_BONUS` |
| Coin book value | `src/state/store.jsx` — `COINS_PER_HKD` |
| Base markup schedule | `src/data/rewards.js` — `MARKUP`, and each reward's `tier` |
| Volume curve on the ladders | `src/data/rewards.js` — `VOLUME_MARKUP`, plus `bestValue` on the top rung |
| Real menu prices | `src/data/rewards.js` — each reward's `retail`; refresh when UO reissues the menu |
| Onboard discount cap | `src/data/rewards.js` — `MAX_DISCOUNT_HKD` |
| Coupon percentages | `src/data/rewards.js` — each reward's `pct`, with `hkd` the cash it works out to |
| Reachability limits | `src/data/rewards.js` — `REACHABLE_DAYS` |
| Room background themes | `src/styles.css` — `.room--<id>` custom properties |
| Expiry windows | `src/state/store.jsx` — `COIN_EXPIRY_DAYS`, `VOUCHER_EXPIRY_DAYS`, `EXPIRY_WARN_DAYS` |
| Check-in calendar | `src/data/checkin.js` |
| Redemption prices | `src/data/rewards.js` — `priceOf()` |
| Measured payout distribution | `scratchpad/payout-dist.mjs` — 20,000 rounds per game per skill level |

**In-flight:** all three games stay playable and unlimited, but pay **0 coins**, post no leaderboard
score, and **consume no ticket** (so there is nothing to refund either) — everything waits until
landing. Nothing accrues offline, which is
what removes any queue, cap or reconciliation problem on reconnect.
