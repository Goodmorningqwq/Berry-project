/**
 * A slice of the UO network. Each destination grants a passport stamp and a
 * one-off exclusive cosmetic on landing.
 */

export const DESTINATIONS = [
  { code: 'NRT', city: 'Tokyo', country: 'Japan', region: 'Japan', emoji: '🗼', hue: 340, reward: 'kimono' },
  { code: 'KIX', city: 'Osaka', country: 'Japan', region: 'Japan', emoji: '🐙', hue: 18, reward: 'takoyaki-hat' },
  { code: 'FUK', city: 'Fukuoka', country: 'Japan', region: 'Japan', emoji: '🍜', hue: 32, reward: 'ramen-bowl' },
  { code: 'ISG', city: 'Ishigaki', country: 'Japan', region: 'Japan', emoji: '🐠', hue: 190, reward: 'diving-fins' },
  { code: 'ICN', city: 'Seoul', country: 'Korea', region: 'Korea', emoji: '🏯', hue: 210, reward: 'hanbok' },
  { code: 'CJU', city: 'Jeju', country: 'Korea', region: 'Korea', emoji: '🍊', hue: 28, reward: 'jeju-hat' },
  { code: 'TPE', city: 'Taipei', country: 'Taiwan', region: 'Greater China', emoji: '🧋', hue: 268, reward: 'bubble-tea' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', region: 'Southeast Asia', emoji: '🛕', hue: 45, reward: 'thai-garland' },
  { code: 'HKT', city: 'Phuket', country: 'Thailand', region: 'Southeast Asia', emoji: '🏝️', hue: 172, reward: 'snorkel' },
  { code: 'CNX', city: 'Chiang Mai', country: 'Thailand', region: 'Southeast Asia', emoji: '🏮', hue: 5, reward: 'lantern' },
  { code: 'DAD', city: 'Da Nang', country: 'Vietnam', region: 'Southeast Asia', emoji: '🌉', hue: 130, reward: 'conical-hat' },
  { code: 'BKI', city: 'Kota Kinabalu', country: 'Malaysia', region: 'Southeast Asia', emoji: '🌅', hue: 300, reward: 'kota-shirt' }
]

export const DESTINATIONS_BY_CODE = Object.fromEntries(DESTINATIONS.map((d) => [d.code, d]))

export const REGIONS = [...new Set(DESTINATIONS.map((d) => d.region))]

const TIMES = [
  ['09:15', '14:30'],
  ['07:40', '12:05'],
  ['13:25', '17:50'],
  ['11:05', '15:20'],
  ['08:30', '13:00'],
  ['16:10', '20:35']
]

export const ORIGIN = { code: 'HKG', city: 'Hong Kong' }

/**
 * The next unflown destination becomes the "upcoming trip". Completing a trip
 * advances it, so the demo always has somewhere new to fly to.
 */
export function nextTrip(stamps = []) {
  const dest = DESTINATIONS.find((d) => !stamps.includes(d.code)) ?? DESTINATIONS[0]
  const i = DESTINATIONS.indexOf(dest)
  const [depart, arrive] = TIMES[i % TIMES.length]
  return {
    number: `UO ${610 + i * 8}`,
    from: ORIGIN,
    to: dest.code,
    dest,
    depart,
    arrive,
    gate: String(12 + i),
    seat: `${12 + i}A`
  }
}
