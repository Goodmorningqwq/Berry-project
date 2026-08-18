/**
 * Berry coin redemption catalogue.
 *
 * Per the brief, redemption is open from ticket purchase until online check-in,
 * which is exactly the window where an extra touchpoint can convert.
 *
 * **Two different numbers live here, and conflating them is the mistake to
 * avoid.** `hkd` is the face value the customer receives. `cost` is what UO
 * charges for it, and it is deliberately *above* book value — see
 * `COINS_PER_HKD` in state/store.jsx, which is the accounting value of the coin
 * liability, not a shelf price. The markup is UO's margin and the only real
 * lever on what the programme gives away.
 *
 * The markup rises with what the reward actually costs UO to fulfil:
 *
 *   100 coins/HK$  zero-cost perks   nothing to fulfil, so priced at book value
 *                                    — these are the hook and are meant to be
 *                                    redeemed often
 *   160 coins/HK$  margin-positive   the customer still pays the balance on a
 *                  coupons           ~60%-margin item, so UO nets money on a
 *                                    sale that often wouldn't have happened
 *   200 coins/HK$  real merchandise  genuine COGS with no offsetting sale;
 *                                    priced as the aspiration, not the
 *                                    expectation
 *
 * **Discount cap:** no coupon exceeds roughly a third of the retail price of
 * what it discounts, so every coupon redemption stays margin-positive. HK$5 off
 * a HK$30 snack still has the customer spending HK$25.
 *
 * The two cheapest rewards exist to give a new player something reachable
 * inside a week and cost UO nothing to hand over, which makes the bottom of the
 * ladder the cheapest retention spend available.
 */

export const REDEMPTION_WINDOW = 'Redeemable from ticket purchase until online check-in'

/** Coins charged per HK$1 of face value, by what fulfilment actually costs UO. */
export const MARKUP = {
  free: 100,
  coupon: 160,
  merch: 200
}

/**
 * `tier` (what fulfilment costs UO) is deliberately separate from `kind` (which
 * tab it appears under). Standard seat selection is a travel extra to the
 * customer but costs UO nothing to give, so it sits in the ancillary tab at the
 * free rate. Collapsing the two would misprice it.
 */
export const priceOf = (reward) => reward.hkd * MARKUP[reward.tier]

export const REWARDS = [
  /* ---- quick wins: digital, nothing to fulfil, reachable in days ---- */
  {
    id: 'wallpaper-pack',
    tier: 'free',
    kind: 'starter',
    name: 'Berry wallpaper pack',
    detail: 'Phone wallpapers, four designs',
    hkd: 2,
    cost: 200,
    emoji: '🖼️'
  },
  {
    id: 'sticker-pack',
    tier: 'free',
    kind: 'starter',
    name: 'Berry sticker pack',
    detail: 'Digital stickers for your chats',
    hkd: 3,
    cost: 300,
    emoji: '💜'
  },
  {
    id: 'seat-standard',
    tier: 'free',
    kind: 'ancillary',
    name: 'Standard seat selection',
    detail: 'Pick your seat on your next UO flight',
    hkd: 5,
    cost: 500,
    emoji: '💺'
  },

  /* ---- inflight meals: margin-positive discounts ---- */
  {
    id: 'snack-5',
    tier: 'coupon',
    kind: 'meal',
    name: 'HK$5 off an inflight snack',
    detail: 'Any snack on board',
    hkd: 5,
    cost: 800,
    emoji: '🍪'
  },
  {
    id: 'meal-10',
    tier: 'coupon',
    kind: 'meal',
    name: 'HK$10 off an inflight meal',
    detail: 'Applies to any hot meal on your next UO flight',
    hkd: 10,
    cost: 1600,
    emoji: '🍱'
  },
  {
    id: 'combo-20',
    tier: 'coupon',
    kind: 'meal',
    name: 'HK$20 off a meal + drink combo',
    detail: 'Hot meal and a drink on your next UO flight',
    hkd: 20,
    cost: 3200,
    emoji: '🍛'
  },

  /* ---- merchandise: real COGS, so this is the aspiration ---- */
  {
    id: 'merch-pin',
    tier: 'merch',
    kind: 'merch',
    name: 'Berry enamel pin badge',
    detail: 'Collect at the airport UO counter',
    hkd: 12,
    cost: 2400,
    emoji: '📌'
  },
  {
    id: 'merch-luggage-tag',
    tier: 'merch',
    kind: 'merch',
    name: 'Berry luggage tag',
    detail: 'Collect at the airport UO counter',
    hkd: 40,
    cost: 8000,
    emoji: '🏷️'
  },
  {
    id: 'merch-tote',
    tier: 'merch',
    kind: 'merch',
    name: 'Berry tote bag voucher',
    detail: 'Redeem at the UO online shop',
    hkd: 55,
    cost: 11000,
    emoji: '👜'
  },
  {
    id: 'merch-plush',
    tier: 'merch',
    kind: 'merch',
    name: 'Berry plush voucher',
    detail: 'The one everyone posts about',
    hkd: 75,
    cost: 15000,
    emoji: '🧸'
  },

  /* ---- travel extras: seat selection is free to give; the rest is
     forgone ancillary revenue, capacity-limited ---- */
  {
    id: 'seat-upgrade',
    tier: 'coupon',
    kind: 'ancillary',
    name: 'Front-row seat selection',
    detail: 'Subject to availability',
    hkd: 50,
    cost: 8000,
    emoji: '🪟'
  },
  {
    id: 'baggage-3kg',
    tier: 'coupon',
    kind: 'ancillary',
    name: '3kg extra baggage',
    detail: 'Added to your next booking',
    hkd: 75,
    cost: 12000,
    emoji: '🧳'
  }
]

export const REWARD_KINDS = [
  { id: 'starter', label: 'Quick wins' },
  { id: 'meal', label: 'Inflight meals' },
  { id: 'merch', label: 'Merchandise' },
  { id: 'ancillary', label: 'Travel extras' }
]

export const REWARDS_BY_ID = Object.fromEntries(REWARDS.map((r) => [r.id, r]))
