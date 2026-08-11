/**
 * The UO flight network — every airport UO departs Hong Kong for.
 *
 * The published network also lists ferry and coach connections (Shekou,
 * Nansha, Humen, Pazhou, Zhongshan, Zhuhai HZMB, Macao HZMB, Shenzhen Airport
 * Ferry Terminal). Those feed *into* HKG rather than being places Berry flies
 * to, so they aren't collectible here.
 *
 * `region` groups destinations for the region medals; the exclusive prop is
 * awarded per country, not per city — see COUNTRIES below.
 */

export const DESTINATIONS = [
  /* ---- Japan ---- */
  { code: 'FUK', city: 'Fukuoka', country: 'Japan', region: 'Japan', emoji: '🍜', hue: 32 },
  { code: 'HIJ', city: 'Hiroshima', country: 'Japan', region: 'Japan', emoji: '🕊️', hue: 205 },
  { code: 'ISG', city: 'Ishigaki', country: 'Japan', region: 'Japan', emoji: '🐠', hue: 190 },
  { code: 'KMQ', city: 'Komatsu', country: 'Japan', region: 'Japan', emoji: '⛩️', hue: 12 },
  { code: 'NGO', city: 'Nagoya', country: 'Japan', region: 'Japan', emoji: '🏯', hue: 25 },
  { code: 'OKA', city: 'Okinawa', country: 'Japan', region: 'Japan', emoji: '🌺', hue: 330 },
  { code: 'KIX', city: 'Osaka', country: 'Japan', region: 'Japan', emoji: '🐙', hue: 18 },
  { code: 'SDJ', city: 'Sendai', country: 'Japan', region: 'Japan', emoji: '🌾', hue: 58 },
  { code: 'TAK', city: 'Takamatsu', country: 'Japan', region: 'Japan', emoji: '🍥', hue: 200 },
  { code: 'HND', city: 'Tokyo (Haneda)', country: 'Japan', region: 'Japan', emoji: '🗼', hue: 340 },
  { code: 'NRT', city: 'Tokyo (Narita)', country: 'Japan', region: 'Japan', emoji: '🎌', hue: 355 },

  /* ---- South Korea ---- */
  { code: 'PUS', city: 'Busan', country: 'South Korea', region: 'Korea', emoji: '🌊', hue: 208 },
  { code: 'TAE', city: 'Daegu', country: 'South Korea', region: 'Korea', emoji: '🍎', hue: 352 },
  { code: 'CJU', city: 'Jeju', country: 'South Korea', region: 'Korea', emoji: '🍊', hue: 28 },
  { code: 'ICN', city: 'Seoul', country: 'South Korea', region: 'Korea', emoji: '🏯', hue: 215 },

  /* ---- Chinese Mainland ---- */
  { code: 'PKX', city: 'Beijing (Daxing)', country: 'Chinese Mainland', region: 'Greater China', emoji: '🏮', hue: 0 },
  { code: 'CZX', city: 'Changzhou', country: 'Chinese Mainland', region: 'Greater China', emoji: '🎋', hue: 105 },
  { code: 'NGB', city: 'Ningbo', country: 'Chinese Mainland', region: 'Greater China', emoji: '⛵', hue: 198 },
  { code: 'SYX', city: 'Sanya', country: 'Chinese Mainland', region: 'Greater China', emoji: '🥥', hue: 38 },
  { code: 'WUX', city: 'Wuxi', country: 'Chinese Mainland', region: 'Greater China', emoji: '🍑', hue: 348 },
  { code: 'YIW', city: 'Yiwu', country: 'Chinese Mainland', region: 'Greater China', emoji: '🛍️', hue: 285 },

  /* ---- Taiwan ---- */
  { code: 'KHH', city: 'Kaohsiung', country: 'Taiwan', region: 'Greater China', emoji: '🐉', hue: 148 },
  { code: 'RMQ', city: 'Taichung', country: 'Taiwan', region: 'Greater China', emoji: '🌞', hue: 48 },
  { code: 'TPE', city: 'Taipei', country: 'Taiwan', region: 'Greater China', emoji: '🧋', hue: 268 },

  /* ---- Southeast Asia ---- */
  { code: 'BKI', city: 'Kota Kinabalu', country: 'Malaysia', region: 'Southeast Asia', emoji: '🌅', hue: 300 },
  { code: 'SZB', city: 'Kuala Lumpur (Subang)', country: 'Malaysia', region: 'Southeast Asia', emoji: '🏙️', hue: 262 },
  { code: 'PEN', city: 'Penang', country: 'Malaysia', region: 'Southeast Asia', emoji: '🍲', hue: 20 },
  { code: 'CRK', city: 'Clark', country: 'Philippines', region: 'Southeast Asia', emoji: '🌋', hue: 8 },
  { code: 'MNL', city: 'Manila', country: 'Philippines', region: 'Southeast Asia', emoji: '🚙', hue: 45 },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', region: 'Southeast Asia', emoji: '🛕', hue: 42 },
  { code: 'CNX', city: 'Chiang Mai', country: 'Thailand', region: 'Southeast Asia', emoji: '🏮', hue: 5 },
  { code: 'HKT', city: 'Phuket', country: 'Thailand', region: 'Southeast Asia', emoji: '🏝️', hue: 172 },
  { code: 'DAD', city: 'Da Nang', country: 'Vietnam', region: 'Southeast Asia', emoji: '🌉', hue: 130 },
  { code: 'HAN', city: 'Hanoi', country: 'Vietnam', region: 'Southeast Asia', emoji: '🍲', hue: 92 },
  { code: 'PQC', city: 'Phu Quoc', country: 'Vietnam', region: 'Southeast Asia', emoji: '🐚', hue: 185 }
]

/**
 * One exclusive prop per country, unlocked on the first landing there. Eight
 * countries is a set I can actually draw well; thirty-five cities is not.
 */
export const COUNTRIES = [
  { id: 'Japan', region: 'Japan', flag: '🇯🇵', reward: 'sakura-clip' },
  { id: 'South Korea', region: 'Korea', flag: '🇰🇷', reward: 'hanbok-band' },
  { id: 'Chinese Mainland', region: 'Greater China', flag: '🇨🇳', reward: 'panda-hood' },
  { id: 'Taiwan', region: 'Greater China', flag: '🇹🇼', reward: 'bubble-tea' },
  { id: 'Malaysia', region: 'Southeast Asia', flag: '🇲🇾', reward: 'batik-bandana' },
  { id: 'Philippines', region: 'Southeast Asia', flag: '🇵🇭', reward: 'salakot' },
  { id: 'Thailand', region: 'Southeast Asia', flag: '🇹🇭', reward: 'thai-garland' },
  { id: 'Vietnam', region: 'Southeast Asia', flag: '🇻🇳', reward: 'conical-hat' }
]

export const DESTINATIONS_BY_CODE = Object.fromEntries(DESTINATIONS.map((d) => [d.code, d]))
export const COUNTRIES_BY_ID = Object.fromEntries(COUNTRIES.map((c) => [c.id, c]))

export const REGIONS = ['Japan', 'Korea', 'Greater China', 'Southeast Asia']

/** Destinations grouped by country, in COUNTRIES order — used by the passport. */
export const BY_COUNTRY = COUNTRIES.map((country) => ({
  ...country,
  cities: DESTINATIONS.filter((d) => d.country === country.id)
}))

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
    gate: String(12 + (i % 40)),
    seat: `${12 + (i % 20)}A`
  }
}
