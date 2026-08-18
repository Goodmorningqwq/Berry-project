/**
 * Berry coin redemption catalogue.
 *
 * Per the brief, redemption is open from ticket purchase until online check-in,
 * which is exactly the window where an extra touchpoint can convert.
 *
 * **Menu prices are real.** Every `retail` figure comes from the HK Express
 * *Inflight Gourmet Meals and Deals* menu — water HK$10, cartons HK$20, cans
 * HK$25, signature drinks HK$40/45, packet snacks HK$20, Pringles HK$25, cup
 * noodles HK$30, light bites HK$35–45, combos HK$65, hearty mains HK$75,
 * desserts HK$35, Häagen-Dazs HK$40. The menu is seasonal, so these need
 * refreshing when UO reissues it; the reward *wording* is deliberately generic
 * so a new menu doesn't invalidate the catalogue.
 *
 * **Onboard coupons are percentages, not cash amounts.** `pct` is the headline
 * the customer sees and `hkd` is what it works out to against that reward's
 * `retail` — the number the costing model needs. Both are stored rather than
 * derived at render time so the economy script can assert they agree.
 *
 * A percentage reads as a proper offer and scales with what you order, but it
 * is vaguer than cash, so each card also spells the money out in `detail`.
 *
 * **Every onboard reward is a discount, never a free item.** The customer
 * always pays the balance, so every redemption is attached to a sale UO would
 * often not otherwise have made. Free items were tried and removed: they cost
 * twice as much per coin as a discount, because nothing is bought alongside
 * them to offset the cost.
 *
 * **Two rules keep onboard margin intact**, both asserted in
 * `scratchpad/economy.mjs` against the real menu prices:
 *   1. no discount is worth more than **HK$10** in cash
 *   2. no discount exceeds **a third of the `retail`** it applies to
 *
 * At 5–10% both hold with enormous headroom — the largest coupon in the
 * catalogue is HK$7.50, a tenth of the hearty main it discounts.
 *
 * `cost` is what the store charges in coins, always *above* the coin's book
 * value — see COINS_PER_HKD in state/store.jsx, which is the accounting
 * liability, not a price. The base markup rises with what fulfilment costs UO:
 *
 *   free    100 coins/HK$   nothing to fulfil — digital goods, seat selection
 *   coupon  160 coins/HK$   customer pays the balance, so the sale offsets it
 *   merch   200 coins/HK$   real COGS, priced as the aspiration
 */

export const REDEMPTION_WINDOW = 'Redeemable from ticket purchase until online check-in'

/** Coins charged per HK$1 of face value, by what fulfilment costs UO. */
export const MARKUP = {
  free: 100,
  coupon: 160,
  merch: 200
}

/** The most any single onboard discount may be worth, to protect margin. */
export const MAX_DISCOUNT_HKD = 10

/**
 * **Onboard coupons are priced on a volume curve, not proportionally.**
 *
 * Flat pricing was the previous mistake: every coupon cost the same per HK$1,
 * so the bigger rungs were identical value and there was no reason to ever pick
 * one. The choice collapsed to 'what can I afford today', which parks everyone
 * on the cheapest rung forever.
 *
 * The rate now falls as the *percentage* grows, exactly like a bulk price.
 * Saving up is genuinely rewarded, and the top rung of each tab is flagged
 * 'Best value' so the ladder is legible without doing the division.
 *
 * This is the honest version of the decoy effect (Huber, Payne & Puto, 1982):
 * a real quantity discount rather than a deliberately bad middle option, so it
 * survives a customer actually running the numbers.
 */
export const VOLUME_MARKUP = {
  5: 160,
  7.5: 150,
  10: 140
}

/** Which tabs use the volume curve — the onboard ladders where sizes compete. */
export const ONBOARD_KINDS = ['drink', 'snack', 'meal', 'sweet']

/**
 * Percentages of real menu prices rarely land on round numbers, so onboard
 * prices settle to the nearest 5 coins. Everything else is exact.
 */
export const priceOf = (r) =>
  ONBOARD_KINDS.includes(r.kind) && r.tier === 'coupon'
    ? Math.round((r.hkd * VOLUME_MARKUP[r.pct]) / 5) * 5
    : r.hkd * MARKUP[r.tier]

export const REWARDS = [
  /* ---- drinks: cartons/cans 20–25 · signature 40/45 ---- */
  {
    id: 'drink-5pct',
    tier: 'coupon',
    kind: 'drink',
    name: '5% off any drink',
    detail: 'About HK$1 off a HK$20 carton',
    pct: 5,
    hkd: 1,
    retail: 20,
    cost: 160,
    emoji: '🥤'
  },
  {
    id: 'drink-7pct',
    tier: 'coupon',
    kind: 'drink',
    name: '7.5% off any drink',
    detail: 'About HK$1.50 off a HK$20 carton',
    pct: 7.5,
    hkd: 1.5,
    retail: 20,
    cost: 225,
    emoji: '🧃'
  },
  {
    id: 'drink-signature-10pct',
    tier: 'coupon',
    kind: 'drink',
    name: '10% off any Signature Drink',
    detail: 'About HK$4 off a HK$40 milk tea or latte',
    pct: 10,
    hkd: 4,
    retail: 40,
    cost: 560,
    bestValue: true,
    emoji: '☕'
  },

  /* ---- snacks: packets 20 · Pringles 25 · cup noodles 30 ---- */
  {
    id: 'snack-5pct',
    tier: 'coupon',
    kind: 'snack',
    name: '5% off any snack',
    detail: 'About HK$1 off a HK$20 packet',
    pct: 5,
    hkd: 1,
    retail: 20,
    cost: 160,
    emoji: '🍪'
  },
  {
    id: 'snack-7pct',
    tier: 'coupon',
    kind: 'snack',
    name: '7.5% off any snack',
    detail: 'About HK$1.50 off a HK$20 packet',
    pct: 7.5,
    hkd: 1.5,
    retail: 20,
    cost: 225,
    emoji: '🥨'
  },
  {
    id: 'snack-noodles-10pct',
    tier: 'coupon',
    kind: 'snack',
    name: '10% off any cup noodles',
    detail: 'About HK$3 off a HK$30 cup',
    pct: 10,
    hkd: 3,
    retail: 30,
    cost: 420,
    bestValue: true,
    emoji: '🍜'
  },

  /* ---- meals: light bites 35–45 · combos 65 · hearty mains 75 ---- */
  {
    id: 'meal-light-5pct',
    tier: 'coupon',
    kind: 'meal',
    name: '5% off any light bite',
    detail: 'About HK$1.75 off a HK$35 bun or roll',
    pct: 5,
    hkd: 1.75,
    retail: 35,
    cost: 280,
    emoji: '🥟'
  },
  {
    id: 'meal-hot-7pct',
    tier: 'coupon',
    kind: 'meal',
    name: '7.5% off any hot meal',
    detail: 'About HK$4.90 off a HK$65 combo',
    pct: 7.5,
    hkd: 4.875,
    retail: 65,
    cost: 730,
    emoji: '🍱'
  },
  {
    id: 'meal-hearty-10pct',
    tier: 'coupon',
    kind: 'meal',
    name: '10% off any Hearty Bites main',
    detail: 'About HK$7.50 off a HK$75 signature main',
    pct: 10,
    hkd: 7.5,
    retail: 75,
    cost: 1050,
    bestValue: true,
    emoji: '🍛'
  },

  /* ---- sweets: egg waffle 35 · red bean soup 35 · Häagen-Dazs 40 ---- */
  {
    id: 'sweet-5pct',
    tier: 'coupon',
    kind: 'sweet',
    name: '5% off any dessert',
    detail: 'About HK$1.75 off a HK$35 egg waffle',
    pct: 5,
    hkd: 1.75,
    retail: 35,
    cost: 280,
    emoji: '🧇'
  },
  {
    id: 'sweet-7pct',
    tier: 'coupon',
    kind: 'sweet',
    name: '7.5% off any dessert',
    detail: 'About HK$2.60 off a HK$35 egg waffle',
    pct: 7.5,
    hkd: 2.625,
    retail: 35,
    cost: 395,
    emoji: '🍮'
  },
  {
    id: 'sweet-icecream-10pct',
    tier: 'coupon',
    kind: 'sweet',
    name: '10% off an ice cream cup',
    detail: 'About HK$4 off a HK$40 Häagen-Dazs',
    pct: 10,
    hkd: 4,
    retail: 40,
    cost: 560,
    bestValue: true,
    emoji: '🍨'
  },

  /* ---- Berry: digital goods cost nothing, merchandise is the aspiration ---- */
  {
    id: 'wallpaper-pack',
    tier: 'free',
    kind: 'berry',
    name: 'Berry wallpaper pack',
    detail: 'Phone wallpapers, four designs',
    hkd: 2,
    cost: 200,
    emoji: '🖼️'
  },
  {
    id: 'sticker-pack',
    tier: 'free',
    kind: 'berry',
    name: 'Berry sticker pack',
    detail: 'Digital stickers for your chats',
    hkd: 3,
    cost: 300,
    emoji: '💜'
  },
  {
    id: 'merch-pin',
    tier: 'merch',
    kind: 'berry',
    name: 'Berry enamel pin badge',
    detail: 'Collect at the airport UO counter',
    hkd: 12,
    cost: 2400,
    emoji: '📌'
  },
  {
    id: 'merch-luggage-tag',
    tier: 'merch',
    kind: 'berry',
    name: 'Berry luggage tag',
    detail: 'Collect at the airport UO counter',
    hkd: 40,
    cost: 8000,
    emoji: '🏷️'
  },
  {
    id: 'merch-tote',
    tier: 'merch',
    kind: 'berry',
    name: 'Berry tote bag voucher',
    detail: 'Redeem at the UO online shop',
    hkd: 55,
    cost: 11000,
    emoji: '👜'
  },
  {
    id: 'merch-plush',
    tier: 'merch',
    kind: 'berry',
    name: 'Berry plush voucher',
    detail: 'The one everyone posts about',
    hkd: 75,
    cost: 15000,
    emoji: '🧸'
  },

  /* ---- travel: seat selection is free to give; the rest is forgone
     ancillary revenue, capacity-limited rather than a cash cost. These are the
     ancillary itself rather than a discount on it, so they sit outside the
     percentage ladder ---- */
  {
    id: 'seat-standard',
    tier: 'free',
    kind: 'travel',
    name: 'Standard seat selection',
    detail: 'Pick your seat on your next UO flight',
    hkd: 5,
    retail: 50,
    cost: 500,
    emoji: '💺'
  },
  {
    id: 'seat-upgrade',
    tier: 'coupon',
    kind: 'travel',
    name: 'Front-row seat selection',
    detail: 'Subject to availability',
    hkd: 50,
    retail: 180,
    cost: 8000,
    emoji: '🪟'
  },
  {
    id: 'baggage-3kg',
    tier: 'coupon',
    kind: 'travel',
    name: '3kg extra baggage',
    detail: 'Added to your next booking',
    hkd: 75,
    retail: 260,
    cost: 12000,
    emoji: '🧳'
  }
]

export const REWARD_KINDS = [
  { id: 'drink', label: 'Drinks' },
  { id: 'snack', label: 'Snacks' },
  { id: 'meal', label: 'Meals' },
  { id: 'sweet', label: 'Sweets' },
  { id: 'berry', label: 'Berry' },
  { id: 'travel', label: 'Travel' }
]

export const REWARDS_BY_ID = Object.fromEntries(REWARDS.map((r) => [r.id, r]))
