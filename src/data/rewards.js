/**
 * Berry coin redemption catalogue.
 *
 * Per the brief, redemption is open from ticket purchase until online check-in,
 * which is exactly the window where an extra touchpoint can convert.
 *
 * **Every price is face value × 100** (1 coin = 1 HK cent — see `COINS_PER_HKD`
 * in state/store.jsx). `hkd` is the retail value the price is derived from, so
 * the economy can be re-tuned by changing the rate rather than 11 numbers.
 *
 * The three cheapest rewards exist to give a new player something reachable
 * inside a week. Their marginal cost to the airline is near zero — a digital
 * sticker pack costs nothing and seat selection costs close to nothing — which
 * makes the bottom of the ladder the cheapest retention spend available.
 */

export const REDEMPTION_WINDOW = 'Redeemable from ticket purchase until online check-in'

export const REWARDS = [
  /* ---- first rungs: reachable in under a week ---- */
  {
    id: 'sticker-pack',
    kind: 'starter',
    name: 'Berry sticker pack',
    detail: 'Digital stickers for your chats',
    hkd: 3,
    cost: 300,
    emoji: '💜'
  },
  {
    id: 'seat-standard',
    kind: 'starter',
    name: 'Standard seat selection',
    detail: 'Pick your seat on your next UO flight',
    hkd: 5,
    cost: 500,
    emoji: '💺'
  },
  {
    id: 'snack-5',
    kind: 'starter',
    name: 'HK$5 off an inflight snack',
    detail: 'Any snack on board',
    hkd: 5,
    cost: 500,
    emoji: '🍪'
  },

  /* ---- inflight meals ---- */
  {
    id: 'meal-20',
    kind: 'meal',
    name: 'HK$20 off an inflight meal',
    detail: 'Applies to any hot meal on your next UO flight',
    hkd: 20,
    cost: 2000,
    emoji: '🍱'
  },
  {
    id: 'drink-free',
    kind: 'meal',
    name: 'Free inflight hot drink',
    detail: 'Coffee, tea or hot chocolate',
    hkd: 30,
    cost: 3000,
    emoji: '☕'
  },
  {
    id: 'meal-50',
    kind: 'meal',
    name: 'HK$50 off an inflight meal combo',
    detail: 'Meal + drink combo on your next UO flight',
    hkd: 50,
    cost: 5000,
    emoji: '🍛'
  },

  /* ---- merchandise ---- */
  {
    id: 'merch-luggage-tag',
    kind: 'merch',
    name: 'Berry luggage tag',
    detail: 'Collect at the airport UO counter',
    hkd: 60,
    cost: 6000,
    emoji: '🏷️'
  },
  {
    id: 'merch-tote',
    kind: 'merch',
    name: 'Berry tote bag voucher',
    detail: 'Redeem at the UO online shop',
    hkd: 100,
    cost: 10000,
    emoji: '👜'
  },
  {
    id: 'merch-plush',
    kind: 'merch',
    name: 'Berry plush voucher',
    detail: 'The one everyone posts about',
    hkd: 150,
    cost: 15000,
    emoji: '🧸'
  },

  /* ---- travel extras ---- */
  {
    id: 'seat-upgrade',
    kind: 'ancillary',
    name: 'Front-row seat selection',
    detail: 'Subject to availability',
    hkd: 80,
    cost: 8000,
    emoji: '🪟'
  },
  {
    id: 'baggage-3kg',
    kind: 'ancillary',
    name: '3kg extra baggage',
    detail: 'Added to your next booking',
    hkd: 120,
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
