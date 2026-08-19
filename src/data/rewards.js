/**
 * Berry coin redemption catalogue.
 *
 * Per the brief, redemption is open from ticket purchase until online check-in,
 * which is exactly the window where an extra touchpoint can convert.
 *
 * Three kinds of thing are sold here:
 *
 *   onboard coupons  percentage discounts on the real inflight menu, issued as
 *                    a voucher you show the crew
 *   digital goods    wallpapers, stickers and room backgrounds — granted
 *                    instantly, since you don't show a wallpaper to cabin crew
 *   merch            physical Berry goods, collected or posted
 *
 * **Menu prices are real.** Every `retail` figure comes from the HK Express
 * *Inflight Gourmet Meals and Deals* menu — cartons HK$20, cans HK$25,
 * signature drinks HK$40/45, packet snacks HK$20, cup noodles HK$30, light
 * bites HK$35–45, combos HK$65, hearty mains HK$75, desserts HK$35,
 * Häagen-Dazs HK$40. The menu is seasonal, so these need refreshing when UO
 * reissues it; the reward *wording* is deliberately generic so a new menu
 * doesn't invalidate the catalogue.
 *
 * **Onboard coupons are percentages, not cash amounts.** `pct` is the headline
 * the customer sees and `hkd` is what it works out to against that reward's
 * `retail` — the number the costing model needs. Both are stored rather than
 * derived at render time so the economy script can assert they agree. A
 * percentage reads as a proper offer and scales with what you order, but it is
 * vaguer than cash, so each card spells the money out in `detail`.
 *
 * **Every onboard reward is a discount, never a free item.** The customer
 * always pays the balance, so every redemption is attached to a sale UO would
 * often not otherwise have made.
 *
 * **Two rules keep onboard margin intact**, both asserted in
 * `scratchpad/economy.mjs` against the real menu prices:
 *   1. no discount is worth more than **HK$10** in cash
 *   2. no discount exceeds **a third of the `retail`** it applies to
 *
 * At 5–10% both hold with enormous headroom — the largest coupon is HK$7.50, a
 * tenth of the hearty main it discounts.
 *
 * `cost` is what the store charges in coins, always *above* the coin's book
 * value — see COINS_PER_HKD in state/store.jsx, which is the accounting
 * liability, not a price.
 */

export const REDEMPTION_WINDOW = 'Redeemable from ticket purchase until online check-in'

/**
 * Coins charged per HK$1 of face value, by what fulfilment costs UO.
 *
 * `merch` sits *below* the coupon rates, which inverts the usual logic that
 * physical goods with real COGS should cost more. That is deliberate: coins
 * expire 180 days after the balance starts and the clock is never extended, so
 * the most anyone can ever bank is around 6,300. At the old 200/HK$ the plush
 * cost 15,000 and was simply impossible to buy — as were the tote, the
 * front-row seat and the extra baggage. An unreachable reward is worse than an
 * imperfect markup, so merch came down to fit inside one expiry window.
 */
export const MARKUP = {
  free: 100,
  coupon: 160,
  merch: 70
}

/** The most any single onboard discount may be worth, to protect margin. */
export const MAX_DISCOUNT_HKD = 10

/**
 * **Onboard coupons are priced on a volume curve, not proportionally.**
 *
 * Flat pricing was an earlier mistake: every coupon cost the same per HK$1, so
 * the bigger rungs were identical value and there was no reason to ever pick
 * one. The choice collapsed to 'what can I afford today', which parks everyone
 * on the cheapest rung forever.
 *
 * The rate falls as the *percentage* grows, exactly like a bulk price. Saving
 * up is genuinely rewarded, and the top rung of each tab is flagged 'Best
 * value' so the ladder is legible without doing the division.
 *
 * This is the honest version of the decoy effect (Huber, Payne & Puto, 1982):
 * a real quantity discount rather than a deliberately bad middle option, so it
 * survives a customer actually running the numbers.
 *
 * Rates were raised from 160/150/140 so the best-value rung lands around a
 * month of play. Coupons are spent onboard and people fly perhaps twice a year,
 * so a month-scale goal fits inside a flight cycle — and inside the six-month
 * voucher window — where a three-day one did not.
 */
export const VOLUME_MARKUP = {
  5: 270,
  7.5: 250,
  10: 230
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
    cost: 270,
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
    cost: 375,
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
    cost: 920,
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
    cost: 270,
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
    cost: 375,
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
    cost: 690,
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
    cost: 475,
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
    cost: 1220,
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
    cost: 1725,
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
    cost: 475,
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
    cost: 655,
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
    cost: 920,
    bestValue: true,
    emoji: '🍨'
  },

  /* ---- Berry: digital goods. `grant: 'item'` adds the cosmetic straight to
     the wardrobe instead of issuing a voucher — there is nobody to show a
     wallpaper to. ---- */
  {
    id: 'wallpaper-pack',
    tier: 'free',
    kind: 'berry',
    name: 'Berry wallpaper pack',
    detail: 'Four phone wallpapers — download link on your voucher',
    hkd: 2,
    cost: 200,
    emoji: '🖼️'
  },
  {
    id: 'sticker-pack',
    tier: 'free',
    kind: 'berry',
    name: 'Berry sticker pack',
    detail: 'Chat stickers — download link on your voucher',
    hkd: 3,
    cost: 300,
    emoji: '💜'
  },
  {
    id: 'bg-clouds',
    tier: 'free',
    kind: 'berry',
    grant: 'item',
    itemId: 'bg-clouds',
    name: 'Above the Clouds',
    detail: 'Room background — sky blue, cloud window',
    hkd: 6,
    cost: 600,
    emoji: '☁️'
  },
  {
    id: 'bg-sakura',
    tier: 'free',
    kind: 'berry',
    grant: 'item',
    itemId: 'bg-sakura',
    name: 'Sakura Season',
    detail: 'Room background — blossom pink, petals falling',
    hkd: 9,
    cost: 900,
    emoji: '🌸'
  },
  {
    id: 'bg-island',
    tier: 'free',
    kind: 'berry',
    grant: 'item',
    itemId: 'bg-island',
    name: 'Island Getaway',
    detail: 'Room background — teal walls, sea and palms',
    hkd: 9,
    cost: 900,
    emoji: '🏝️'
  },
  {
    id: 'bg-seoul',
    tier: 'free',
    kind: 'berry',
    grant: 'item',
    itemId: 'bg-seoul',
    name: 'Seoul Nights',
    detail: 'Room background — deep blue, neon skyline',
    hkd: 12,
    cost: 1200,
    emoji: '🌃'
  },
  {
    id: 'bg-cabin',
    tier: 'free',
    kind: 'berry',
    grant: 'item',
    itemId: 'bg-cabin',
    name: 'Cabin Class',
    detail: 'Room background — UO purple, oval cabin window',
    hkd: 15,
    cost: 1500,
    emoji: '✈️'
  },

  /* ---- merch: real COGS, collected or posted. Priced to fit inside one
     180-day coin expiry window — see MARKUP above. ---- */
  {
    id: 'merch-pin',
    tier: 'merch',
    kind: 'merch',
    name: 'Berry enamel pin badge',
    detail: 'Collect at the airport UO counter',
    hkd: 12,
    cost: 840,
    emoji: '📌'
  },
  {
    id: 'merch-luggage-tag',
    tier: 'merch',
    kind: 'merch',
    name: 'Berry luggage tag',
    detail: 'Collect at the airport UO counter',
    hkd: 40,
    cost: 2800,
    emoji: '🏷️'
  },
  {
    id: 'merch-plush',
    tier: 'merch',
    kind: 'merch',
    name: 'Berry plush voucher',
    detail: 'The one everyone posts about',
    hkd: 75,
    cost: 5250,
    emoji: '🧸'
  }
]

export const REWARD_KINDS = [
  { id: 'drink', label: 'Drinks' },
  { id: 'snack', label: 'Snacks' },
  { id: 'meal', label: 'Meals' },
  { id: 'sweet', label: 'Sweets' },
  { id: 'berry', label: 'Berry' },
  { id: 'merch', label: 'Merch' }
]

/**
 * How long a tab's cheapest reward may take. Food and digital goods have to
 * open inside a fortnight or the tab reads as a wall; merch is explicitly the
 * aspiration and carries real COGS, so it cannot have a one-week rung.
 */
export const REACHABLE_DAYS = { merch: 30, default: 14 }

export const REWARDS_BY_ID = Object.fromEntries(REWARDS.map((r) => [r.id, r]))
