import { DESTINATIONS, REGIONS } from './destinations.js'

/**
 * Two kinds of award, both derived from state so the store tracks no medal
 * data at all:
 *
 *  - TIERED_MEDALS climb Copper → Silver → Gold → Diamond as a number grows.
 *  - REGION_BADGES are plain completions for stamping a whole region.
 */

export const TIERS = [
  { id: 'copper', label: 'Copper', emoji: '🥉', color: '#B06A3B' },
  { id: 'silver', label: 'Silver', emoji: '🥈', color: '#8E97A8' },
  { id: 'gold', label: 'Gold', emoji: '🥇', color: '#D9A521' },
  { id: 'diamond', label: 'Diamond', emoji: '💎', color: '#4FC3D9' }
]

export const TIERED_MEDALS = [
  {
    id: 'flights',
    name: 'Frequent Flyer',
    emoji: '🛫',
    unit: 'trips',
    thresholds: [3, 10, 25, 50],
    value: (s) => s.flights.length
  },
  {
    id: 'streak',
    name: 'Berry Streak',
    emoji: '🔥',
    unit: 'days in a row',
    thresholds: [7, 30, 100, 365],
    value: (s) => s.bestStreak
  },
  {
    id: 'passport',
    name: 'Passport',
    emoji: '📖',
    unit: 'destinations',
    thresholds: [5, 12, 24, DESTINATIONS.length],
    value: (s) => s.stamps.length
  },
  {
    id: 'wardrobe',
    name: 'Wardrobe',
    emoji: '👗',
    unit: 'cosmetics',
    thresholds: [5, 10, 17, 25],
    value: (s) => s.ownedItems.length
  },
  {
    id: 'coins',
    name: 'Coin Earner',
    emoji: '🪙',
    unit: 'coins earned',
    thresholds: [500, 2000, 6000, 15000],
    value: (s) => s.lifetimeCoins
  }
]

/**
 * Resolves a raw number into its tier, the next one to chase, and how far
 * away that promotion is.
 */
export function tierFor(value, thresholds) {
  let index = -1
  for (let i = 0; i < thresholds.length; i++) {
    if (value >= thresholds[i]) index = i
  }

  const current = index >= 0 ? TIERS[index] : null
  const next = index + 1 < TIERS.length ? TIERS[index + 1] : null
  const floor = index >= 0 ? thresholds[index] : 0
  const target = next ? thresholds[index + 1] : thresholds[thresholds.length - 1]

  return {
    current,
    next,
    value,
    target,
    remaining: next ? Math.max(0, target - value) : 0,
    // Progress across the current band, so the bar refills on every promotion.
    pct: next ? Math.min(100, ((value - floor) / (target - floor)) * 100) : 100,
    maxed: !next
  }
}

const regionCount = (state, region) =>
  DESTINATIONS.filter((d) => d.region === region && state.stamps.includes(d.code)).length

const regionTotal = (region) => DESTINATIONS.filter((d) => d.region === region).length

export const REGION_BADGES = REGIONS.map((region) => ({
  id: `region-${region.toLowerCase().replace(/\s+/g, '-')}`,
  name: `${region} Explorer`,
  detail: `Stamp every ${region} destination`,
  emoji: { Japan: '🗾', Korea: '🇰🇷', 'Greater China': '🏮', 'Southeast Asia': '🌴' }[region],
  total: regionTotal(region),
  count: (s) => regionCount(s, region)
}))
