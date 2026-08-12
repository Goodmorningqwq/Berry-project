/**
 * The 7-day check-in calendar.
 *
 * Fixed rather than random, so the Home screen strip can promise exactly what
 * each day pays and users learn that day 5 is the good one. Treat days trade
 * some coins for an item; the week still totals 70 coins, the same as the flat
 * 10/day it replaces, so the economy doesn't move.
 */

export const CHECK_IN_CALENDAR = [
  { day: 1, coins: 10 },
  { day: 2, coins: 5, treat: 'berry-snack' },
  { day: 3, coins: 10 },
  { day: 4, coins: 5, treat: 'berry-juice' },
  { day: 5, coins: 25, peak: true },
  { day: 6, coins: 5, treat: 'berry-soap' },
  { day: 7, coins: 10, blindbox: true }
]

export const CYCLE_LENGTH = CHECK_IN_CALENDAR.length

/** Where a streak sits in the cycle: day 8 is cycle position 1 again. */
export function cyclePosition(streak) {
  if (streak <= 0) return 0
  return ((streak - 1) % CYCLE_LENGTH) + 1
}

/** What a given streak day pays. */
export function rewardForStreak(streak) {
  const pos = cyclePosition(streak)
  return CHECK_IN_CALENDAR[pos - 1] ?? CHECK_IN_CALENDAR[0]
}

export const WEEKLY_COINS = CHECK_IN_CALENDAR.reduce((sum, d) => sum + d.coins, 0)
