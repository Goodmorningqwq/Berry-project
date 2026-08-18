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
 * **Every onboard reward is a discount, never a free item.** The customer
 * always pays the balance, so every redemption is attached to a sale UO would
 * often not otherwise have made. Free items were tried and removed: they cost
 * twice as much per coin as a discount, because nothing is bought alongside
 * them to offset the cost.
 *
 * **Two rules keep onboard margin intact:**
 *   1. no discount exceeds **HK$10**, so no single coupon can swallow the
 *      margin on a HK$20 snack or a HK$40 drink
 *   2. no discount exceeds **a third of the `retail`** of the cheapest item it
 *      applies to
 *
 * `hkd` is what the customer receives; `cost` is what the store charges in
 * coins, always *above* the coin's book value — see COINS_PER_HKD in
 * state/store.jsx, which is the accounting liability, not a price. The markup
 * rises with what fulfilment actually costs UO:
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
 * Flat pricing was the previous mistake: every coupon cost 160 coins per HK$1,
 * so the bigger rungs were identical value and there was no reason to ever pick
 * one. The choice collapsed to 'what can I afford today', which parks everyone
 * on the cheapest rung forever.
 *
 * Now the coins-per-dollar rate falls as the discount grows, exactly like a
 * bulk price. Saving up is genuinely rewarded, and the top rung of each tab is
 * flagged 'Best value' so the ladder is legible without doing the division.
 *
 * This is the honest version of the decoy effect (Huber, Payne & Puto, 1982):
 * a real quantity discount rather than a deliberately bad middle option, so it
 * survives a customer actually running the numbers.
 *
 * It does cost UO more per coin at the top — HK$3.08 per 1,000 coins on a HK$10
 * coupon against HK$2.50 on a HK$3 one. That is the price of the incentive, and
 * it buys larger attached baskets and fewer, later redemptions.
 */
export const VOLUME_MARKUP = {
  3: 160,
  5: 150,
  8: 140,
  10: 130
}

/** Which tabs use the volume curve — the onboard ladders where sizes compete. */
export const ONBOARD_KINDS = ['drink', 'snack', 'meal', 'sweet']

export const priceOf = (r) =>
  ONBOARD_KINDS.includes(r.kind) && r.tier === 'coupon'
    ? r.hkd * VOLUME_MARKUP[r.hkd]
    : r.hkd * MARKUP[r.tier]

export const REWARDS = [
  /* ---- drinks: cartons/cans 20–25 · signature 40/45 ---- */
  {
    id: 'drink-3',
    tier: 'coupon',
    kind: 'drink',
    name: 'HK$3 off any drink',
    detail: 'Soft drinks, juices and teas from the trolley',
    hkd: 3,
    retail: 20,
    cost: 480,
    emoji: '🥤'
  },
  {
    id: 'drink-5',
    tier: 'coupon',
    kind: 'drink',
    name: 'HK$5 off any drink',
    detail: 'Soft drinks, juices and teas from the trolley',
    hkd: 5,
    retail: 20,
    cost: 750,
    emoji: '🧃'
  },
  {
    id: 'drink-signature-10',
    tier: 'coupon',
    kind: 'drink',
    name: 'HK$10 off any Signature Drink',
    detail: 'Milk tea, latte or the barista-made specials',
    hkd: 10,
    retail: 40,
    cost: 1300,
    bestValue: true,
    emoji: '☕'
  },

  /* ---- snacks: packets 20 · Pringles 25 · cup noodles 30 ---- */
  {
    id: 'snack-3',
    tier: 'coupon',
    kind: 'snack',
    name: 'HK$3 off any snack',
    detail: 'Crisps, gummies, biscuits — anything from the snack page',
    hkd: 3,
    retail: 20,
    cost: 480,
    emoji: '🍪'
  },
  {
    id: 'snack-5',
    tier: 'coupon',
    kind: 'snack',
    name: 'HK$5 off any snack',
    detail: 'Crisps, gummies, biscuits — anything from the snack page',
    hkd: 5,
    retail: 20,
    cost: 750,
    emoji: '🥨'
  },
  {
    id: 'snack-noodles-8',
    tier: 'coupon',
    kind: 'snack',
    name: 'HK$8 off any cup noodles',
    detail: 'Any cup noodle on board',
    hkd: 8,
    retail: 30,
    cost: 1120,
    bestValue: true,
    emoji: '🍜'
  },

  /* ---- meals: light bites 35–45 · combos 65 · hearty mains 75 ---- */
  {
    id: 'meal-light-3',
    tier: 'coupon',
    kind: 'meal',
    name: 'HK$3 off any light bite',
    detail: 'Rice noodle rolls, buns, sandwiches',
    hkd: 3,
    retail: 35,
    cost: 480,
    emoji: '🥠'
  },
  {
    id: 'meal-light-5',
    tier: 'coupon',
    kind: 'meal',
    name: 'HK$5 off any light bite',
    detail: 'Rice noodle rolls, buns, sandwiches',
    hkd: 5,
    retail: 35,
    cost: 750,
    emoji: '🥟'
  },
  {
    id: 'meal-hot-8',
    tier: 'coupon',
    kind: 'meal',
    name: 'HK$8 off any hot meal',
    detail: 'Any hot dish on your next UO flight',
    hkd: 8,
    retail: 65,
    cost: 1120,
    emoji: '🍱'
  },
  {
    id: 'meal-hearty-10',
    tier: 'coupon',
    kind: 'meal',
    name: 'HK$10 off any Hearty Bites main',
    detail: 'The signature rice and pasta mains',
    hkd: 10,
    retail: 75,
    cost: 1300,
    bestValue: true,
    emoji: '🍛'
  },

  /* ---- sweets: egg waffle 35 · red bean soup 35 · Häagen-Dazs 40 ---- */
  {
    id: 'sweet-3',
    tier: 'coupon',
    kind: 'sweet',
    name: 'HK$3 off any dessert',
    detail: 'Egg waffles, red bean soup, ice cream',
    hkd: 3,
    retail: 35,
    cost: 480,
    emoji: '🧇'
  },
  {
    id: 'sweet-5',
    tier: 'coupon',
    kind: 'sweet',
    name: 'HK$5 off any dessert',
    detail: 'Egg waffles, red bean soup, ice cream',
    hkd: 5,
    retail: 35,
    cost: 750,
    emoji: '🍮'
  },
  {
    id: 'sweet-icecream-8',
    tier: 'coupon',
    kind: 'sweet',
    name: 'HK$8 off an ice cream cup',
    detail: 'Häagen-Dazs 100mL, vanilla or cookies & cream',
    hkd: 8,
    retail: 40,
    cost: 1120,
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
     ancillary revenue, capacity-limited rather than a cash cost, which is why
     these sit above the HK$10 onboard discount cap ---- */
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
