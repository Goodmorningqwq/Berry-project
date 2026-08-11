import { DESTINATIONS } from './destinations.js'

/**
 * Medals for multiple travels. Each medal owns its own test + progress
 * function so the store never has to track medal state — it's all derived.
 */

const regionCount = (state, region) =>
  DESTINATIONS.filter((d) => d.region === region && state.stamps.includes(d.code)).length

const regionTotal = (region) => DESTINATIONS.filter((d) => d.region === region).length

export const MEDALS = [
  {
    id: 'first-flight',
    name: 'First Flight',
    detail: 'Complete your first trip with Berry',
    emoji: '🛫',
    test: (s) => s.flights.length >= 1,
    progress: (s) => ({ current: Math.min(s.flights.length, 1), target: 1 })
  },
  {
    id: 'frequent-3',
    name: 'Frequent Flyer',
    detail: 'Complete 3 trips',
    emoji: '✈️',
    test: (s) => s.flights.length >= 3,
    progress: (s) => ({ current: Math.min(s.flights.length, 3), target: 3 })
  },
  {
    id: 'frequent-5',
    name: 'Sky Regular',
    detail: 'Complete 5 trips',
    emoji: '🌤️',
    test: (s) => s.flights.length >= 5,
    progress: (s) => ({ current: Math.min(s.flights.length, 5), target: 5 })
  },
  {
    id: 'frequent-10',
    name: 'Berry Elite',
    detail: 'Complete 10 trips',
    emoji: '🏆',
    test: (s) => s.flights.length >= 10,
    progress: (s) => ({ current: Math.min(s.flights.length, 10), target: 10 })
  },
  {
    id: 'japan-complete',
    name: 'Japan Explorer',
    detail: 'Stamp every Japan destination',
    emoji: '🗾',
    test: (s) => regionCount(s, 'Japan') === regionTotal('Japan'),
    progress: (s) => ({ current: regionCount(s, 'Japan'), target: regionTotal('Japan') })
  },
  {
    id: 'sea-complete',
    name: 'Southeast Asia Explorer',
    detail: 'Stamp every Southeast Asia destination',
    emoji: '🌴',
    test: (s) => regionCount(s, 'Southeast Asia') === regionTotal('Southeast Asia'),
    progress: (s) => ({
      current: regionCount(s, 'Southeast Asia'),
      target: regionTotal('Southeast Asia')
    })
  },
  {
    id: 'streak-7',
    name: 'Week with Berry',
    detail: 'Check in 7 days in a row',
    emoji: '🔥',
    test: (s) => s.bestStreak >= 7,
    progress: (s) => ({ current: Math.min(s.bestStreak, 7), target: 7 })
  },
  {
    id: 'streak-30',
    name: 'Berry Devotee',
    detail: 'Check in 30 days in a row',
    emoji: '💜',
    test: (s) => s.bestStreak >= 30,
    progress: (s) => ({ current: Math.min(s.bestStreak, 30), target: 30 })
  },
  {
    id: 'collector',
    name: 'Wardrobe Collector',
    detail: 'Own 10 cosmetics',
    emoji: '👗',
    test: (s) => s.ownedItems.length >= 10,
    progress: (s) => ({ current: Math.min(s.ownedItems.length, 10), target: 10 })
  }
]

export const MEDALS_BY_ID = Object.fromEntries(MEDALS.map((m) => [m.id, m]))
