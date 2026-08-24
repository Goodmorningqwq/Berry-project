import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import {
  BLINDBOX_POOL,
  BASIC_ITEMS,
  BASIC_ITEMS_BY_ID,
  ITEMS_BY_ID,
  MILESTONE_ITEM_ID,
  STARTER_ITEM_ID
} from '../data/items.js'
import { COUNTRIES_BY_ID, DESTINATIONS_BY_CODE, tripFor } from '../data/destinations.js'
import { CYCLE_LENGTH, rewardForStreak } from '../data/checkin.js'
import { REGION_BADGES, TIERED_MEDALS, tierFor } from '../data/medals.js'
import { REWARDS_BY_ID } from '../data/rewards.js'

const STORAGE_KEY = 'flywithberry.v1'
/**
 * Which release the player last saw, kept deliberately *outside* STORAGE_KEY so
 * a SCHEMA_VERSION bump doesn't wipe it — see the patch-notes effect in App.
 */
export const RELEASE_KEY = 'flywithberry.release'
const SCHEMA_VERSION = 14

/**
 * The coin's **book value** — what UO carries the outstanding coin liability
 * at, not a shelf price. Berry coins are earned by playing rather than
 * spending, so they're marketing spend rather than a rebate, and 1 coin = 1 HK
 * cent is the number the costing model uses.
 *
 * Store prices are set *above* this: see `MARKUP` in data/rewards.js, where the
 * markup rises with what a reward actually costs UO to fulfil. Do not use this
 * constant to predict a price — it no longer derives them.
 */
export const COINS_PER_HKD = 100

export const BLINDBOX_COST = 800
export const MILESTONE_DAYS = 30
/** Game entry is ticketed: 3 a day, spend them on whichever games you like. */
export const DAILY_TICKETS = 3
export const TICKET_CAP = 5
/** Every Nth consecutive check-in grants a bonus ticket. */
export const TICKET_STREAK_BONUS = 7

/**
 * Feeding earns blindbox tickets rather than coins. Paying coins for a treat
 * that was itself a reward made the care loop circular — you were just
 * converting an item back into money.
 */
export const FEEDS_PER_TICKET = 5

/**
 * Expiry, six months for both.
 *
 * Coins expire on **inactivity** rather than per-batch: the whole balance
 * carries one date, and any earning or spending pushes it out again. That is
 * how airline miles actually work, and it keeps the balance a single number
 * instead of a ledger of dated lots.
 *
 * The real argument for it is not retention — at six months of inactivity it
 * rarely fires for anyone who opens the app — it is that an unbounded coin
 * balance is an unbounded liability UO could never write off.
 */
export const COIN_EXPIRY_DAYS = 180
export const VOUCHER_EXPIRY_DAYS = 180
/** How close to the end before the app starts warning about it. */
export const EXPIRY_WARN_DAYS = 30

/** Days without feeding before Berry looks glum. Nothing is ever deducted. */
export const HUNGRY_AFTER_DAYS = 2

/* ------------------------------------------------------------------ */
/* Virtual clock                                                       */
/*                                                                     */
/* Every date read in the app goes through here. `dayOffset` is what    */
/* the presenter's "Next day" button moves, so fast-forwarding works    */
/* across streaks, vouchers and game allowances at once.                */
/* ------------------------------------------------------------------ */

const pad = (n) => String(n).padStart(2, '0')

export function dayKey(dayOffset = 0) {
  const d = new Date()
  d.setHours(12, 0, 0, 0) // midday avoids DST edges shifting the date
  d.setDate(d.getDate() + dayOffset)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function prettyDate(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
}

/** Whole days from `a` to `b`, both 'YYYY-MM-DD'. */
export function daysBetween(a, b) {
  const toUTC = (k) => {
    const [y, m, d] = k.split('-').map(Number)
    return Date.UTC(y, m - 1, d)
  }
  return Math.round((toUTC(b) - toUTC(a)) / 86400000)
}

/* ------------------------------------------------------------------ */
/* Initial state                                                       */
/* ------------------------------------------------------------------ */

/**
 * Guest registration, such as it is: a name exists from the first render so
 * nothing ever blocks the demo with a sign-up form. In production this would be
 * the player's UO account.
 */
function makeGuest() {
  return {
    id: `g-${Math.random().toString(36).slice(2, 10)}`,
    name: `Traveller ${1000 + Math.floor(Math.random() * 9000)}`
  }
}

/**
 * A past flight, shaped exactly like the ones COMPLETE_FLIGHT writes. Used only
 * to seed the demo account — a passport with stamps but an empty flight history
 * would contradict itself.
 */
function seedFlight(code, daysAgo, unlocked) {
  const trip = tripFor(code)
  return {
    code,
    date: dayKey(-daysAgo),
    number: trip.number,
    depart: trip.depart,
    arrive: trip.arrive,
    gate: trip.gate,
    seat: trip.seat,
    coins: 50,
    unlocked: unlocked ?? null
  }
}

/**
 * The demo starts as a *lightly used* account rather than an empty one.
 *
 * This is a pitch build handed to people who will hold it for a minute or two,
 * so every screen needs something on it immediately — an empty passport and an
 * empty wardrobe show none of what the product is for. It stays deliberately
 * small: three stamps out of 35, and the 30-day exclusive still locked, because
 * the gaps are the argument.
 *
 * Two things are pointedly *not* seeded. Today's check-in is unclaimed, so the
 * core loop is still the first thing a new pair of hands does. And nothing is
 * equipped, so dressing Berry and re-theming the room stay live moments.
 */
function initialState() {
  return {
    version: SCHEMA_VERSION,
    screen: 'home',
    guest: makeGuest(),
    /** Best score per game id — the only thing a leaderboard needs to persist. */
    bestScores: {},
    coins: 1000,
    lifetimeCoins: 1000,
    /** When the whole balance lapses. Set here because the seed starts with coins. */
    coinsExpireOn: dayKey(COIN_EXPIRY_DAYS),
    /** Set by SWEEP_EXPIRY so App can announce it, then cleared. */
    lastExpiry: null,
    streak: 0,
    bestStreak: 0,
    lastCheckIn: null,
    dayOffset: 0,
    blindboxTickets: 1,
    ownedItems: [STARTER_ITEM_ID, 'japan-hachimaki', 'korea-gat', 'captain-cap', 'sunnies'],
    equipped: { look: STARTER_ITEM_ID, hat: null, accessory: null, background: null },
    inventory: { 'berry-snack': 3, 'berry-juice': 3, 'berry-soap': 3 },
    fedCount: 0,
    feedProgress: 0,
    lastFed: null,
    stamps: ['FUK', 'KIX', 'ICN'],
    flights: [
      seedFlight('FUK', 46, 'japan-hachimaki'),
      seedFlight('KIX', 24),
      seedFlight('ICN', 9, 'korea-gat')
    ],
    vouchers: [],
    playTickets: DAILY_TICKETS,
    /** Which day the ticket balance belongs to; a new day refreshes it. */
    ticketDay: null,
    lastPlayed: null,
    seenIntro: false,
    // Presenter's in-flight switch. Never restored from a save — see hydrate().
    demoOffline: false,
    // Mirrors the browser's real connectivity, pushed in by App so the reducer
    // stays pure rather than reading navigator inside itself.
    networkOnline: true
  }
}

/** In-flight if the presenter says so, or if the device genuinely has no network. */
export const isOffline = (state) => state.demoOffline || !state.networkOnline

/** A voucher still worth something: neither used nor past its date. */
export const voucherLive = (v, today) => !v.used && !(v.expiresAt && today > v.expiresAt)

/**
 * Whether a *live* voucher for this reward is already in hand. Redemption is
 * capped at one outstanding voucher each, so a player can't bank ten drink
 * coupons and use them all on one flight.
 *
 * Expired vouchers deliberately don't count. If they did, letting one lapse
 * would lock that reward out forever — the cap would become a trap rather than
 * an anti-stockpiling rule.
 */
export const holdsVoucher = (state, rewardId) =>
  state.vouchers.some((v) => v.rewardId === rewardId && voucherLive(v, dayKey(state.dayOffset)))

/**
 * How the balance is doing against its expiry date: null when there is nothing
 * to lose, otherwise the date, days remaining, and whether that is close enough
 * to say so out loud.
 */
export const coinsExpiring = (state) => {
  if (!state.coins || !state.coinsExpireOn) return null
  const days = daysBetween(dayKey(state.dayOffset), state.coinsExpireOn)
  return { on: state.coinsExpireOn, days, soon: days <= EXPIRY_WARN_DAYS }
}

/**
 * The balance carries **one clock, set once and never extended**.
 *
 * It starts the moment coins go from zero to something, and it is not pushed
 * out by earning more — spend it or lose it. An earlier version reset the clock
 * on every coin movement, which meant an active player's coins could never
 * actually expire; that is a dormancy rule, not an expiry, and it was not what
 * was wanted here.
 *
 * The known edge: coins earned late in a window inherit whatever time is left,
 * so a payout on day 179 lives one day. The UI says so plainly rather than
 * letting it surprise anyone.
 *
 * Spending the balance to zero clears the clock, so the next coin earned starts
 * a fresh six months.
 */
const nextExpiry = (state, coinsAfter) => {
  if (coinsAfter <= 0) return null
  return state.coinsExpireOn ?? dayKey(state.dayOffset + COIN_EXPIRY_DAYS)
}

/**
 * Tickets refresh on the virtual clock day. Reads go through here so a new day
 * shows a full balance without needing a write first, and writes normalise
 * before changing anything.
 */
export const ticketsOn = (state, today) =>
  state.ticketDay === today ? state.playTickets : DAILY_TICKETS

/**
 * Actions that move value. Offline these are refused outright: with nothing
 * earned or spent in the air there is no queue to reconcile and nothing to
 * exploit by pulling the network. Play and cosmetics are deliberately absent
 * from this list — offline freezes the economy, not the app.
 */
const ECONOMY_ACTIONS = new Set([
  'CHECK_IN',
  'EARN_COINS',
  'SPEND_TICKET',
  // Nothing is spent in the air, so there is nothing to hand back either.
  'REFUND_TICKET',
  'OPEN_BLINDBOX',
  'REDEEM_REWARD',
  'FEED_BERRY',
  'COMPLETE_FLIGHT',
  // A rank is progression too — in the air you play, but you don't post.
  'SUBMIT_SCORE'
])

/* ------------------------------------------------------------------ */
/* Reducer                                                             */
/* ------------------------------------------------------------------ */

export const BLINDBOX_STREAK_DAY = CYCLE_LENGTH

/**
 * Published blindbox odds. These are displayed to the player in OddsSheet, so
 * the roll below has to honour them exactly.
 */
export const RARITY_ODDS = [
  { rarity: 'common', chance: 0.6 },
  { rarity: 'rare', chance: 0.3 },
  { rarity: 'epic', chance: 0.1 }
]

/**
 * Rarity first, then an item inside it.
 *
 * Weighting each *item* by its rarity and summing across the pool (the previous
 * approach) makes the class odds depend on how many items sit in each tier —
 * with the current pool that worked out to roughly 52/47/2, so no honest label
 * could read "10% epic". Choosing the tier first keeps the published numbers
 * true however the pool grows.
 */
function pickBlindboxItem(ownedItems) {
  let roll = Math.random()
  let tier = RARITY_ODDS[RARITY_ODDS.length - 1].rarity
  for (const band of RARITY_ODDS) {
    if (roll < band.chance) {
      tier = band.rarity
      break
    }
    roll -= band.chance
  }

  // A tier can only be empty if the pool is edited badly; fall back rather than
  // hand back undefined.
  const inTier = BLINDBOX_POOL.filter((i) => i.rarity === tier)
  const candidates = inTier.length ? inTier : BLINDBOX_POOL

  // Duplicate protection stays: prefer something not owned yet within the tier.
  const unowned = candidates.filter((i) => !ownedItems.includes(i.id))
  const pool = unowned.length ? unowned : candidates

  return pool[Math.floor(Math.random() * pool.length)]
}

function voucherCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return `UO-${out}`
}

function reducer(state, action) {
  // One gate for everything that moves value, so no screen can bypass it by
  // dispatching directly.
  if (ECONOMY_ACTIONS.has(action.type) && isOffline(state)) return state

  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen }

    case 'TOGGLE_OFFLINE':
      return { ...state, demoOffline: action.value ?? !state.demoOffline }

    case 'SET_NETWORK':
      return { ...state, networkOnline: action.online }

    case 'SEEN_INTRO':
      return { ...state, seenIntro: true }

    /** Back out to the host HK Express screen. Progress is untouched. */
    case 'GO_HOST':
      return { ...state, seenIntro: false }

    case 'CHECK_IN': {
      const today = dayKey(state.dayOffset)
      if (state.lastCheckIn === today) return state

      const continued = state.lastCheckIn && daysBetween(state.lastCheckIn, today) === 1
      const streak = continued ? state.streak + 1 : 1

      // The calendar decides the payout, so nothing here is random and the
      // Home strip can promise each day's reward in advance.
      const reward = rewardForStreak(streak)

      let next = {
        ...state,
        lastCheckIn: today,
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
        coins: state.coins + reward.coins,
        lifetimeCoins: state.lifetimeCoins + reward.coins,
        coinsExpireOn: nextExpiry(state, state.coins + reward.coins)
      }

      let bonus = null
      if (reward.blindbox) {
        next.blindboxTickets = state.blindboxTickets + 1
        bonus = { type: 'blindbox' }
      } else if (reward.treat) {
        next.inventory = {
          ...state.inventory,
          [reward.treat]: (state.inventory[reward.treat] || 0) + 1
        }
        bonus = { type: 'item', id: reward.treat }
      }

      // Every 7th day in a row buys another go at the games, so the streak is
      // worth keeping for more than just the blindbox.
      const ticketBonus = streak > 0 && streak % TICKET_STREAK_BONUS === 0
      if (ticketBonus) {
        next.playTickets = Math.min(TICKET_CAP, ticketsOn(state, today) + 1)
        next.ticketDay = today
      }

      // 30 consecutive days unlocks the exclusive look.
      const milestone = streak >= MILESTONE_DAYS && !state.ownedItems.includes(MILESTONE_ITEM_ID)
      if (milestone) next.ownedItems = [...state.ownedItems, MILESTONE_ITEM_ID]

      // The reveal sheet renders straight from this, rather than the screen
      // trying to infer what was awarded by diffing the previous state.
      next.lastCheckInResult = {
        day: streak,
        coins: reward.coins,
        peak: !!reward.peak,
        bonus,
        ticket: ticketBonus,
        milestone: milestone ? MILESTONE_ITEM_ID : null
      }

      return next
    }

    case 'CLEAR_CHECK_IN': {
      const { lastCheckInResult, ...rest } = state
      return rest
    }

    case 'EARN_COINS':
      return {
        ...state,
        coins: state.coins + action.amount,
        lifetimeCoins: state.lifetimeCoins + action.amount,
        coinsExpireOn: nextExpiry(state, state.coins + action.amount)
      }

    case 'SUBMIT_SCORE': {
      const best = state.bestScores[action.gameId] ?? 0
      // Only a genuine improvement counts, so a bad round can't erase a good one.
      if (action.score <= best) return state
      return { ...state, bestScores: { ...state.bestScores, [action.gameId]: action.score } }
    }

    case 'RENAME_GUEST': {
      const name = String(action.name ?? '').trim().slice(0, 20)
      if (!name) return state
      return { ...state, guest: { ...state.guest, name } }
    }

    case 'SPEND_TICKET': {
      const today = dayKey(state.dayOffset)
      const available = ticketsOn(state, today)
      if (available < 1) return state
      // lastPlayed is tracked separately from the balance, since a bonus ticket
      // can leave the count at its daily value even after a round was played.
      return { ...state, playTickets: available - 1, ticketDay: today, lastPlayed: today }
    }

    /**
     * Walking away without collecting hands the ticket back — you only pay for a
     * round you actually take the coins from.
     *
     * Only refunds against a ticket spent today: if `ticketDay` isn't today the
     * balance is the untouched daily allowance, so there is nothing to give back
     * and a stray dispatch can't mint one.
     */
    case 'REFUND_TICKET': {
      const today = dayKey(state.dayOffset)
      if (state.ticketDay !== today) return state
      return { ...state, playTickets: Math.min(TICKET_CAP, state.playTickets + 1) }
    }

    case 'OPEN_BLINDBOX': {
      const useTicket = state.blindboxTickets > 0
      if (!useTicket && state.coins < BLINDBOX_COST) return state

      const item = pickBlindboxItem(state.ownedItems)
      const duplicate = state.ownedItems.includes(item.id)
      // A duplicate pays a consolation refund instead of dead air.
      const refund = duplicate ? 20 : 0
      const spent = useTicket ? 0 : BLINDBOX_COST

      return {
        ...state,
        coins: state.coins - spent + refund,
        lifetimeCoins: state.lifetimeCoins + refund,
        coinsExpireOn: nextExpiry(state, state.coins - spent + refund),
        blindboxTickets: useTicket ? state.blindboxTickets - 1 : state.blindboxTickets,
        ownedItems: duplicate ? state.ownedItems : [...state.ownedItems, item.id],
        lastPull: { itemId: item.id, duplicate, refund }
      }
    }

    case 'EQUIP_ITEM': {
      const item = ITEMS_BY_ID[action.itemId]
      if (!item || !state.ownedItems.includes(action.itemId)) return state
      const current = state.equipped[item.slot]
      // Berry always wears *some* look, so that slot swaps rather than toggles.
      const next = current === action.itemId && item.slot !== 'look' ? null : action.itemId
      return { ...state, equipped: { ...state.equipped, [item.slot]: next } }
    }

    case 'UNEQUIP_SLOT':
      if (action.slot === 'look') return state
      return { ...state, equipped: { ...state.equipped, [action.slot]: null } }

    case 'FEED_BERRY': {
      const item = BASIC_ITEMS_BY_ID[action.itemId]
      const held = state.inventory[action.itemId] || 0
      if (!item || held < 1) return state

      const inventory = { ...state.inventory }
      if (held > 1) inventory[action.itemId] = held - 1
      else delete inventory[action.itemId]

      // Care feeds the collection loop instead of paying cash.
      const progress = state.feedProgress + 1
      const earnedTicket = progress >= FEEDS_PER_TICKET

      return {
        ...state,
        inventory,
        fedCount: state.fedCount + 1,
        lastFed: dayKey(state.dayOffset),
        feedProgress: earnedTicket ? 0 : progress,
        blindboxTickets: state.blindboxTickets + (earnedTicket ? 1 : 0),
        lastFeedResult: { itemId: action.itemId, earnedTicket, progress: earnedTicket ? 0 : progress }
      }
    }

    case 'CLEAR_FEED': {
      const { lastFeedResult, ...rest } = state
      return rest
    }

    case 'COMPLETE_FLIGHT': {
      const dest = DESTINATIONS_BY_CODE[action.code]
      if (!dest) return state
      const today = dayKey(state.dayOffset)
      const newStamp = !state.stamps.includes(action.code)
      const reward = 50

      // The exclusive is per country, granted on the first landing there —
      // 35 cities is far more than there is art for.
      const countryReward = COUNTRIES_BY_ID[dest.country]?.reward
      const unlocks = countryReward && !state.ownedItems.includes(countryReward)

      // Snapshot the whole trip: a travel record should be a record, not
      // something re-derived from the destination later.
      const trip = tripFor(action.code)
      const flight = {
        code: action.code,
        date: today,
        number: trip.number,
        depart: trip.depart,
        arrive: trip.arrive,
        gate: trip.gate,
        seat: trip.seat,
        coins: reward,
        unlocked: unlocks ? countryReward : null
      }

      return {
        ...state,
        stamps: newStamp ? [...state.stamps, action.code] : state.stamps,
        flights: [...state.flights, flight],
        ownedItems: unlocks ? [...state.ownedItems, countryReward] : state.ownedItems,
        coins: state.coins + reward,
        lifetimeCoins: state.lifetimeCoins + reward,
        coinsExpireOn: nextExpiry(state, state.coins + reward)
      }
    }

    case 'REDEEM_REWARD': {
      const reward = REWARDS_BY_ID[action.rewardId]
      if (!reward || state.coins < reward.cost) return state
      // One outstanding voucher per reward, so coupons can't be stockpiled and
      // dumped on a single flight. Mark the one you hold as used and the slot
      // frees up — see USE_VOUCHER.
      if (holdsVoucher(state, reward.id)) return state

      // Digital goods are handed over on the spot — there is nobody to show a
      // wallpaper or a room background to, so issuing a voucher for one would
      // be theatre. Everything physical still gets a code.
      if (reward.grant === 'item') {
        if (state.ownedItems.includes(reward.itemId)) return state
        return {
          ...state,
          coins: state.coins - reward.cost,
          coinsExpireOn: nextExpiry(state, state.coins - reward.cost),
          ownedItems: [...state.ownedItems, reward.itemId],
          lastPull: { itemId: reward.itemId, duplicate: false, refund: 0 }
        }
      }

      return {
        ...state,
        coins: state.coins - reward.cost,
        // Spending never buys time, but clearing the balance ends the window.
        coinsExpireOn: nextExpiry(state, state.coins - reward.cost),
        vouchers: [
          {
            id: `${reward.id}-${Date.now()}`,
            rewardId: reward.id,
            code: voucherCode(),
            issuedAt: dayKey(state.dayOffset),
            expiresAt: dayKey(state.dayOffset + VOUCHER_EXPIRY_DAYS),
            used: false
          },
          ...state.vouchers
        ]
      }
    }

    /**
     * Marking a voucher used is what frees its slot for the next redemption.
     *
     * Deliberately absent from ECONOMY_ACTIONS: a coupon is used *onboard*, so
     * it has to work in flight. It moves no value either way — the coins were
     * already spent when the voucher was issued.
     */
    case 'USE_VOUCHER': {
      const today = dayKey(state.dayOffset)
      let changed = false
      const vouchers = state.vouchers.map((v) => {
        // An expired card can't be spent, so it can't be marked used either.
        if (v.id !== action.voucherId || !voucherLive(v, today)) return v
        changed = true
        return { ...v, used: true, usedAt: dayKey(state.dayOffset) }
      })
      return changed ? { ...state, vouchers } : state
    }

    /**
     * Expiry is the passage of time, not an economic action, so it is
     * deliberately absent from ECONOMY_ACTIONS — it has to apply in flight too.
     * It only ever removes value, so there is nothing to gain by pulling the
     * network.
     *
     * It runs as a lazy sweep rather than a timer because time passes while the
     * app is closed. App dispatches it on mount and whenever the virtual clock
     * moves.
     */
    case 'SWEEP_EXPIRY': {
      const today = dayKey(state.dayOffset)
      const lapsed = state.coinsExpireOn && today > state.coinsExpireOn
      const expiringCoins = lapsed ? state.coins : 0

      // Vouchers carry their own date, so nothing has to be rewritten for them
      // to lapse — but the balance is a single number and must be zeroed.
      const anyVoucherLapsed = state.vouchers.some(
        (v) => !v.used && v.expiresAt && today > v.expiresAt
      )
      if (!lapsed && !anyVoucherLapsed) return state

      return {
        ...state,
        coins: lapsed ? 0 : state.coins,
        // lifetimeCoins is untouched: the Coin Earner medal reflects what you
        // once earned, and expiry shouldn't retroactively demote you.
        coinsExpireOn: lapsed ? null : state.coinsExpireOn,
        lastExpiry: expiringCoins > 0 ? { coins: expiringCoins, on: today } : state.lastExpiry
      }
    }

    case 'CLEAR_EXPIRY': {
      if (!state.lastExpiry) return state
      const { lastExpiry, ...rest } = state
      return rest
    }

    /* ---- presenter controls ---- */

    case 'ADVANCE_DAY':
      return { ...state, dayOffset: state.dayOffset + (action.days ?? 1) }

    case 'DEMO_SET_STREAK': {
      // Park the streak one day short so a live check-in lands the milestone.
      const days = action.days
      return {
        ...state,
        streak: days,
        bestStreak: Math.max(state.bestStreak, days),
        lastCheckIn: dayKey(state.dayOffset - 1)
      }
    }

    case 'DEMO_GRANT_ITEMS': {
      // Food only drops from the check-in bonus roll, which is too random to
      // rely on when there's an audience watching.
      const inventory = { ...state.inventory }
      BASIC_ITEMS.forEach((item) => {
        inventory[item.id] = (inventory[item.id] || 0) + 2
      })
      return { ...state, inventory }
    }

    case 'DEMO_GRANT_COINS':
      return {
        ...state,
        coins: state.coins + action.amount,
        lifetimeCoins: state.lifetimeCoins + action.amount,
        coinsExpireOn: nextExpiry(state, state.coins + action.amount)
      }

    case 'RESET':
      return { ...initialState(), seenIntro: state.seenIntro }

    case 'CLEAR_PULL': {
      const { lastPull, ...rest } = state
      return rest
    }

    default:
      return state
  }
}

/* ------------------------------------------------------------------ */
/* Persistence                                                         */
/* ------------------------------------------------------------------ */

function hydrate() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState()
    const saved = JSON.parse(raw)
    // A stale payload resets cleanly rather than crashing mid-presentation.
    if (saved?.version !== SCHEMA_VERSION) return initialState()
    return {
      ...initialState(),
      ...saved,
      // Connectivity is a live fact, never a restored one — a reload must not
      // leave you stuck in the air.
      demoOffline: false,
      networkOnline: typeof navigator === 'undefined' ? true : navigator.onLine
    }
  } catch {
    return initialState()
  }
}

/* ------------------------------------------------------------------ */
/* Provider + selectors                                                */
/* ------------------------------------------------------------------ */

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, hydrate)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* private mode / quota — the demo still works in-memory */
    }
  }, [state])

  const value = useMemo(() => {
    const today = dayKey(state.dayOffset)
    const treatsHeld = Object.values(state.inventory).reduce((n, v) => n + v, 0)
    return {
      state,
      dispatch,
      today,
      checkedInToday: state.lastCheckIn === today,
      offline: isOffline(state),
      treatsHeld,
      // Glum only — feeding is never punished, just missed.
      hungry:
        treatsHeld > 0 &&
        (!state.lastFed || daysBetween(state.lastFed, today) >= HUNGRY_AFTER_DAYS),
      ticketsLeft: ticketsOn(state, today),
      medals: TIERED_MEDALS.map((medal) => ({
        ...medal,
        ...tierFor(medal.value(state), medal.thresholds)
      })),
      regionBadges: REGION_BADGES.map((badge) => {
        const count = badge.count(state)
        return { ...badge, count, earned: count === badge.total }
      }),
      ownedCosmetics: state.ownedItems.map((id) => ITEMS_BY_ID[id]).filter(Boolean)
    }
  }, [state])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}

export { STORAGE_KEY }
