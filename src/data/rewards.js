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
 * desserts HK$35–40. The menu is seasonal, so these need refreshing when UO
 * changes it; the reward *wording* is deliberately generic so a new menu
 * doesn't invalidate the catalogue.
 *
 * **Three numbers live here, and conflating them is the mistake to avoid.**
 *
 *   hkd       what the customer receives — the discount amount, or the retail
 *             value of a free item
 *   unitCost  what UO actually pays to hand a free item over (~35% of menu
 *             price, typical for onboard retail). Freebies only.
 *   cost      what the store charges in coins, set by the tier below. Always
 *             *above* the coin's book value — see COINS_PER_HKD in
 *             state/store.jsx, which is the accounting liability, not a price.
 *
 * The markup rises with what fulfilment actually costs UO:
 *
 *   free     100 coins/HK$ of face   nothing to fulfil, so priced at book
 *                                    value — the hook, meant to be redeemed
 *   coupon   160 coins/HK$ of face   the customer still pays the balance on a
 *                                    ~60%-margin item, so UO nets money on a
 *                                    sale that often wouldn't have happened
 *   freebie  200 coins/HK$ of COST   a whole free item with no offsetting
 *                                    sale, so it prices off `unitCost`. Priced
 *                                    off retail it would make free water dearer
 *                                    than HK$20 off a main, which is absurd
 *   merch    200 coins/HK$ of face   real COGS, priced as the aspiration
 *
 * **Freebies are the most expensive tier per coin.** A coupon at 800 coins
 * gives away ~HK$2 of real cost; a freebie at 600 gives away HK$3 — roughly
 * double. That's the deliberate price of offering a whole free item, which
 * motivates far better than a few dollars off. `scratchpad/economy.mjs` models
 * this per tier rather than hiding it behind one blended percentage.
 *
 * **Discount cap:** no coupon exceeds a third of the `retail` of the cheapest
 * item it applies to, so the customer always pays the balance and every coupon
 * redemption stays margin-positive.
 */

export const REDEMPTION_WINDOW = 'Redeemable from ticket purchase until online check-in'

/** Coins charged per HK$1, by what fulfilment actually costs UO. */
export const MARKUP = {
  free: 100,
  coupon: 160,
  freebie: 200,
  merch: 200
}

/**
 * What a reward is priced from: a freebie prices off UO's unit cost, everything
 * else off the face value the customer receives.
 */
export const priceBasis = (r) => (r.tier === 'freebie' ? r.unitCost : r.hkd)
export const priceOf = (r) => priceBasis(r) * MARKUP[r.tier]

export const REWARDS = [
  /* ---- drinks: water 10 · cartons 20 · cans 25 · signature 40/45 ---- */
  {
    id: 'drink-water-free',
    tier: 'freebie',
    kind: 'drink',
    name: 'Free bottled water',
    detail: 'Bonaqua 250mL on your next UO flight',
    hkd: 10,
    unitCost: 3,
    retail: 10,
    cost: 600,
    emoji: '💧'
  },
  {
    id: 'drink-5-off',
    tier: 'coupon',
    kind: 'drink',
    name: 'HK$5 off any drink',
    detail: 'Soft drinks, juices and teas from the trolley',
    hkd: 5,
    retail: 20,
    cost: 800,
    emoji: '🥤'
  },
  {
    id: 'drink-carton-free',
    tier: 'freebie',
    kind: 'drink',
    name: 'Free juice or tea carton',
    detail: 'Lemon tea, oolong, apple juice or café mocha',
    hkd: 20,
    unitCost: 7,
    retail: 20,
    cost: 1400,
    emoji: '🧃'
  },
  {
    id: 'drink-signature-12',
    tier: 'coupon',
    kind: 'drink',
    name: 'HK$12 off any Signature Drink',
    detail: 'Milk tea, latte or the barista-made specials',
    hkd: 12,
    retail: 40,
    cost: 1920,
    emoji: '☕'
  },

  /* ---- snacks: packets 20 · Pringles 25 · cup noodles 30 ---- */
  {
    id: 'snack-5-off',
    tier: 'coupon',
    kind: 'snack',
    name: 'HK$5 off any snack',
    detail: 'Crisps, gummies, biscuits — anything from the snack page',
    hkd: 5,
    retail: 20,
    cost: 800,
    emoji: '🍪'
  },
  {
    id: 'snack-packet-free',
    tier: 'freebie',
    kind: 'snack',
    name: 'Free packet snack',
    detail: 'Your pick of the gummies, biscuits or tortilla chips',
    hkd: 20,
    unitCost: 7,
    retail: 20,
    cost: 1400,
    emoji: '🥨'
  },
  {
    id: 'snack-noodles-10',
    tier: 'coupon',
    kind: 'snack',
    name: 'HK$10 off any cup noodles',
    detail: 'Any cup noodle on board',
    hkd: 10,
    retail: 30,
    cost: 1600,
    emoji: '🍜'
  },

  /* ---- meals: light bites 35–45 · combos 65 · hearty mains 75 ---- */
  {
    id: 'meal-light-5',
    tier: 'coupon',
    kind: 'meal',
    name: 'HK$5 off any light bite',
    detail: 'Rice noodle rolls, buns, sandwiches',
    hkd: 5,
    retail: 35,
    cost: 800,
    emoji: '🥟'
  },
  {
    id: 'meal-hot-10',
    tier: 'coupon',
    kind: 'meal',
    name: 'HK$10 off any hot meal',
    detail: 'Any hot dish on your next UO flight',
    hkd: 10,
    retail: 65,
    cost: 1600,
    emoji: '🍱'
  },
  {
    id: 'meal-drink-free',
    tier: 'coupon',
    kind: 'meal',
    // Face value is the menu's own +HKD15 drink add-on price, not a guess.
    name: 'Free drink with any meal',
    detail: 'The HK$15 drink add-on, on us',
    hkd: 15,
    retail: 50,
    cost: 2400,
    emoji: '🍹'
  },
  {
    id: 'meal-hearty-20',
    tier: 'coupon',
    kind: 'meal',
    name: 'HK$20 off any Hearty Bites main',
    detail: 'The signature rice and pasta mains',
    hkd: 20,
    retail: 75,
    cost: 3200,
    emoji: '🍛'
  },

  /* ---- sweets: egg waffle 35 · red bean soup 35 · Häagen-Dazs 40 ---- */
  {
    id: 'sweet-5-off',
    tier: 'coupon',
    kind: 'sweet',
    name: 'HK$5 off any dessert',
    detail: 'Egg waffles, red bean soup, ice cream',
    hkd: 5,
    retail: 35,
    cost: 800,
    emoji: '🧇'
  },
  {
    id: 'sweet-icecream-free',
    tier: 'freebie',
    kind: 'sweet',
    name: 'Free ice cream cup',
    detail: 'Häagen-Dazs 100mL, vanilla or cookies & cream',
    hkd: 40,
    unitCost: 14,
    retail: 40,
    cost: 2800,
    emoji: '🍨'
  },
  {
    id: 'sweet-with-main',
    tier: 'coupon',
    kind: 'sweet',
    name: 'Free dessert with a Hearty Bites main',
    detail: 'Pick any dessert when you order a signature main',
    hkd: 35,
    retail: 110,
    cost: 5600,
    emoji: '🍮'
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
     ancillary revenue, capacity-limited ---- */
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
