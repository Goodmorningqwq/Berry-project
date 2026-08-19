/**
 * What's new, newest first.
 *
 * Hand-maintained and written for players, not developers — this is shown in
 * the app, so it says what changed for them rather than what changed in the
 * code. Add a new entry at the top when something ships.
 *
 * `id` must sort correctly as a plain string comparison, so keep the
 * `major.minor` shape zero-padded past 9 if it ever gets that far.
 */

export const RELEASES = [
  {
    id: '1.5',
    date: '2026-08-19',
    title: 'Berry gets dressed',
    notes: [
      'Four outfits redrawn from the official artwork — a purple scarf, star sunglasses, and new looks for the Japan and Korea flight exclusives.',
      'Japan now unlocks a hachimaki headband and Korea a traditional gat, replacing the old headband and hair clip.',
      'Five room backgrounds to buy — take Berry to the clouds, a Seoul rooftop, an island beach, under the cherry blossoms, or into the cabin.',
      'Coins are worth more: rewards now take about a month to save for rather than a few days, so they feel earned.'
    ]
  },
  {
    id: '1.4',
    date: '2026-08-18',
    title: 'Coins and coupons now expire',
    notes: [
      'Berry coins last six months from the day you start saving, and coupons six months from the day you claim them.',
      'Tap your coin count at the top of any screen to see your balance, the deadline, and how long is left.',
      'Spend your balance right down and the next coin you earn starts a fresh six months.'
    ]
  },
  {
    id: '1.3',
    date: '2026-08-18',
    title: 'Better deals onboard',
    notes: [
      'Inflight coupons are now percentages — 5%, 7.5% or 10% off — priced against the real UO menu.',
      'The biggest discount in each category is flagged Best value, because it genuinely is the best coins-per-dollar.',
      'You can hold one of each coupon at a time, so nothing goes stale in your wallet.'
    ]
  },
  {
    id: '1.2',
    date: '2026-08-17',
    title: 'Games that pay their way',
    notes: [
      'Cloud Dash has a wider gap — it was far too hard and barely paid anything.',
      'Baggage Match cards are closed suitcases now, and clearing it in fewer moves pays more.',
      'Candy Rush rewards bigger matches, so planning a chain beats swapping at random.',
      'Tap the week strip on Berry’s home screen to see the whole 30-day run.'
    ]
  }
]

export const LATEST_RELEASE = RELEASES[0].id

/** Everything newer than the release the player last saw, newest first. */
export function releasesSince(seenId) {
  if (!seenId) return []
  return RELEASES.filter((r) => r.id > seenId)
}
