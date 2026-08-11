/**
 * Berry coin redemption catalogue.
 *
 * Per the brief, redemption is open from ticket purchase until online check-in,
 * which is exactly the window where an extra touchpoint can convert.
 */

export const REDEMPTION_WINDOW = 'Redeemable from ticket purchase until online check-in'

export const REWARDS = [
  {
    id: 'meal-20',
    kind: 'meal',
    name: 'HK$20 off an inflight meal',
    detail: 'Applies to any hot meal on your next UO flight',
    cost: 120,
    emoji: '🍱'
  },
  {
    id: 'meal-50',
    kind: 'meal',
    name: 'HK$50 off an inflight meal combo',
    detail: 'Meal + drink combo on your next UO flight',
    cost: 260,
    emoji: '🍛'
  },
  {
    id: 'drink-free',
    kind: 'meal',
    name: 'Free inflight hot drink',
    detail: 'Coffee, tea or hot chocolate',
    cost: 80,
    emoji: '☕'
  },
  {
    id: 'merch-tote',
    kind: 'merch',
    name: 'Berry tote bag voucher',
    detail: 'Redeem at the UO online shop',
    cost: 300,
    emoji: '👜'
  },
  {
    id: 'merch-plush',
    kind: 'merch',
    name: 'Berry plush voucher',
    detail: 'The one everyone posts about',
    cost: 500,
    emoji: '🧸'
  },
  {
    id: 'merch-luggage-tag',
    kind: 'merch',
    name: 'Berry luggage tag',
    detail: 'Collect at the airport UO counter',
    cost: 180,
    emoji: '🏷️'
  },
  {
    id: 'baggage-3kg',
    kind: 'ancillary',
    name: '3kg extra baggage',
    detail: 'Added to your next booking',
    cost: 400,
    emoji: '🧳'
  },
  {
    id: 'seat-upgrade',
    kind: 'ancillary',
    name: 'Front-row seat selection',
    detail: 'Subject to availability',
    cost: 450,
    emoji: '💺'
  }
]

export const REWARD_KINDS = [
  { id: 'meal', label: 'Inflight meals' },
  { id: 'merch', label: 'Merchandise' },
  { id: 'ancillary', label: 'Travel extras' }
]

export const REWARDS_BY_ID = Object.fromEntries(REWARDS.map((r) => [r.id, r]))
