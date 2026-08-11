import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import {
  BLINDBOX_POOL,
  BASIC_ITEMS,
  BASIC_ITEMS_BY_ID,
  ITEMS_BY_ID,
  MILESTONE_ITEM_ID,
  STARTER_ITEM_ID
} from '../data/items.js'
import { COUNTRIES_BY_ID, DESTINATIONS_BY_CODE } from '../data/destinations.js'
import { REGION_BADGES, TIERED_MEDALS, tierFor } from '../data/medals.js'
import { REWARDS_BY_ID } from '../data/rewards.js'

const STORAGE_KEY = 'flywithberry.v1'
const SCHEMA_VERSION = 3

export const CHECK_IN_COINS = 10
export const BLINDBOX_COST = 150
export const MILESTONE_DAYS = 30
export const DAILY_PLAYS_PER_GAME = 3

/** Coins paid for caring for Berry. Supply is limited by the check-in drop. */
export const FEED_REWARDS = {
  'berry-snack': 25,
  'berry-juice': 20,
  'berry-soap': 15
}

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

function initialState() {
  return {
    version: SCHEMA_VERSION,
    screen: 'home',
    coins: 0,
    lifetimeCoins: 0,
    streak: 0,
    bestStreak: 0,
    lastCheckIn: null,
    dayOffset: 0,
    blindboxTickets: 0,
    ownedItems: [STARTER_ITEM_ID],
    equipped: { look: STARTER_ITEM_ID, hat: null, accessory: null },
    inventory: {},
    fedCount: 0,
    stamps: [],
    flights: [],
    vouchers: [],
    plays: { day: null, counts: {} },
    seenIntro: false
  }
}

/* ------------------------------------------------------------------ */
/* Reducer                                                             */
/* ------------------------------------------------------------------ */

function rollDailyBonus(streak) {
  // Deterministic beats on the streak so the demo tells a legible story,
  // with a light random sprinkle of basic items in between.
  if (streak > 0 && streak % 7 === 0) return { type: 'blindbox' }
  if (Math.random() < 0.3) {
    const item = BASIC_ITEMS[Math.floor(Math.random() * BASIC_ITEMS.length)]
    return { type: 'item', id: item.id, name: item.name }
  }
  return null
}

function pickBlindboxItem(ownedItems) {
  const unowned = BLINDBOX_POOL.filter((i) => !ownedItems.includes(i.id))
  const pool = unowned.length ? unowned : BLINDBOX_POOL
  const weights = { common: 60, rare: 30, epic: 10 }
  const total = pool.reduce((sum, i) => sum + weights[i.rarity], 0)
  let roll = Math.random() * total
  for (const item of pool) {
    roll -= weights[item.rarity]
    if (roll <= 0) return item
  }
  return pool[pool.length - 1]
}

function voucherCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return `UO-${out}`
}

function reducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen }

    case 'SEEN_INTRO':
      return { ...state, seenIntro: true }

    case 'CHECK_IN': {
      const today = dayKey(state.dayOffset)
      if (state.lastCheckIn === today) return state

      const continued = state.lastCheckIn && daysBetween(state.lastCheckIn, today) === 1
      const streak = continued ? state.streak + 1 : 1
      const bonus = rollDailyBonus(streak)

      let next = {
        ...state,
        lastCheckIn: today,
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
        coins: state.coins + CHECK_IN_COINS,
        lifetimeCoins: state.lifetimeCoins + CHECK_IN_COINS
      }

      if (bonus?.type === 'blindbox') {
        next.blindboxTickets = state.blindboxTickets + 1
      } else if (bonus?.type === 'item') {
        next.inventory = { ...state.inventory, [bonus.id]: (state.inventory[bonus.id] || 0) + 1 }
      }

      // 30 consecutive days unlocks the exclusive look.
      const milestone = streak >= MILESTONE_DAYS && !state.ownedItems.includes(MILESTONE_ITEM_ID)
      if (milestone) next.ownedItems = [...state.ownedItems, MILESTONE_ITEM_ID]

      // The reveal sheet renders straight from this, rather than the screen
      // trying to infer what was awarded by diffing the previous state.
      next.lastCheckInResult = {
        day: streak,
        coins: CHECK_IN_COINS,
        bonus,
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
        lifetimeCoins: state.lifetimeCoins + action.amount
      }

    case 'RECORD_PLAY': {
      const today = dayKey(state.dayOffset)
      const counts = state.plays.day === today ? { ...state.plays.counts } : {}
      counts[action.gameId] = (counts[action.gameId] || 0) + 1
      return { ...state, plays: { day: today, counts } }
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

      const reward = FEED_REWARDS[action.itemId] ?? 10
      const inventory = { ...state.inventory }
      if (held > 1) inventory[action.itemId] = held - 1
      else delete inventory[action.itemId]

      return {
        ...state,
        inventory,
        fedCount: state.fedCount + 1,
        coins: state.coins + reward,
        lifetimeCoins: state.lifetimeCoins + reward
      }
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

      return {
        ...state,
        stamps: newStamp ? [...state.stamps, action.code] : state.stamps,
        flights: [...state.flights, { code: action.code, date: today }],
        ownedItems: unlocks ? [...state.ownedItems, countryReward] : state.ownedItems,
        coins: state.coins + reward,
        lifetimeCoins: state.lifetimeCoins + reward
      }
    }

    case 'REDEEM_REWARD': {
      const reward = REWARDS_BY_ID[action.rewardId]
      if (!reward || state.coins < reward.cost) return state
      return {
        ...state,
        coins: state.coins - reward.cost,
        vouchers: [
          {
            id: `${reward.id}-${Date.now()}`,
            rewardId: reward.id,
            code: voucherCode(),
            issuedAt: dayKey(state.dayOffset),
            used: false
          },
          ...state.vouchers
        ]
      }
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
        lifetimeCoins: state.lifetimeCoins + action.amount
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
    return { ...initialState(), ...saved }
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
    return {
      state,
      dispatch,
      today,
      checkedInToday: state.lastCheckIn === today,
      playsLeft: (gameId) => {
        const used = state.plays.day === today ? state.plays.counts[gameId] || 0 : 0
        return Math.max(0, DAILY_PLAYS_PER_GAME - used)
      },
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
