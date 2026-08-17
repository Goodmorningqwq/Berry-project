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

| | Coins/month | Face value | True cost to UO (~40%) |
| --- | --- | --- | --- |
| Idling every round | 389 | HK$3.89 | ~HK$1.56 |
| Typical daily player | **1,987** | HK$19.87 | **~HK$7.95** |
| Skilled daily player | **3,585** | HK$35.85 | **~HK$14.34** |

**The floor is what makes AFK pointless.** Three idled rounds pay 3 coins — 100 days for the cheapest
reward — so a bot or an idle tab earns essentially nothing while a player who actually engages earns
in days. The gap between idling and playing is the whole point of the curve.

The daily check-in alone pays 70 coins a week (`WEEKLY_COINS`), or ~300/month. Completing a flight
pays a separate **50 coins**, and feeding Berry pays no coins at all — every 5 treats fed earns a
free blindbox instead.

---

## What coins are worth: **100 coins = HK$1**

One coin is one HK cent. Every catalogue price is **face value × 100**, so the whole economy is
re-tuned by changing `COINS_PER_HKD`, not eleven separate numbers.

**Berry coins are not a rebate.** Airline miles are worth 1.2–1.6 US cents because they're earned by
*spending* — they discount revenue already booked. Berry coins are earned by *playing*, so they're
retention marketing spend, and two things make the rate affordable:

1. **Rewards are ancillaries, where marginal cost sits far below face value.** Seat selection costs
   UO nothing. A HK$20 discount on a ~60%-margin meal — partly driving purchases that wouldn't
   otherwise happen — costs perhaps HK$6 in real terms. Call it ~40% blended.
2. **The industry benchmark is 1–3% of customer revenue** on loyalty rewards. Against a customer
   worth ~HK$3,000/year, even a *daily* player at ~HK$7.95/month lands at ~3% — and only a small
   minority play daily, so the blended cost across all users sits comfortably inside the benchmark.

| Reward | Face | Price | Days of typical play |
| --- | --- | --- | --- |
| Berry sticker pack | HK$3 | **300** | ~5 |
| Standard seat selection | HK$5 | **500** | ~8 |
| HK$5 off an inflight snack | HK$5 | **500** | ~8 |
| Blindbox | ~HK$8 | 800 | ~12 |
| HK$20 off an inflight meal | HK$20 | 2,000 | ~30 |
| Free inflight hot drink | HK$30 | 3,000 | ~45 |
| HK$50 meal combo | HK$50 | 5,000 | ~75 |
| Berry luggage tag | HK$60 | 6,000 | ~91 |
| Front-row seat selection | HK$80 | 8,000 | ~121 |
| Berry tote bag | HK$100 | 10,000 | ~151 |
| 3kg extra baggage | HK$120 | 12,000 | ~181 |
| Berry plush | HK$150 | 15,000 | ~226 |

**The three cheap rungs are the point.** Without something reachable inside a week a new player sees
nothing attainable and leaves. A digital sticker pack costs UO literally nothing and seat selection
costs close to it, so the bottom of the ladder is nearly free to give away while doing the most work
for retention. The long tail at the top is what a genuinely committed player aims at over a
half-year — that's the habit the brief asks for.

---

## Where these are tuned

| Value | Location |
| --- | --- |
| Cloud Dash payout | `src/games/CloudDash.jsx` — `const reward` |
| Baggage Match payout | `src/games/BaggageMatch.jsx` — `const reward` |
| Candy Rush payout | `src/games/CandyRush.jsx` — `const reward` |
| Tickets per day / cap / streak bonus | `src/state/store.jsx` — `DAILY_TICKETS`, `TICKET_CAP`, `TICKET_STREAK_BONUS` |
| Coin valuation | `src/state/store.jsx` — `COINS_PER_HKD` |
| Check-in calendar | `src/data/checkin.js` |
| Redemption prices | `src/data/rewards.js` — each entry's `hkd`, with `cost = hkd × 100` |

**In-flight:** all three games stay playable and unlimited, but pay **0 coins**, post no leaderboard
score, and **consume no ticket** (so there is nothing to refund either) — everything waits until
landing. Nothing accrues offline, which is
what removes any queue, cap or reconciliation problem on reconnect.
