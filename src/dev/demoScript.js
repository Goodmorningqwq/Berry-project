import { playBaggageMatch } from './demoPlay.js'

/**
 * The six demo clips, as data.
 *
 * Each clip is `{ id, title, note, seed, steps }`. `seed` is dispatched before
 * recording begins — always on top of a `RESET`, so a clip never depends on the
 * one before it and a retake is identical to the take it replaces.
 *
 * A step is just `(ctx) => Promise | void`. The builders below cover everything
 * the clips need; `run` is the escape hatch, used only for the scripted Baggage
 * Match round.
 *
 * `tap` takes a `data-demo` name, not a CSS selector. Nearly every control these
 * clips touch is an unlabelled button inside `.tabs`, `.game-card` or
 * `.reward-row`, and an `:nth-child` selector against those would break silently
 * the first time a tab is reordered. The runner throws on a name it cannot
 * resolve, because the person recording is watching OBS, not the console.
 */

export const wait = (ms) => (c) => c.wait(ms)
export const tap = (name) => (c) => c.tap(name)
export const act = (action) => (c) => c.dispatch(action)
export const run = (fn) => (c) => fn(c)
export const scroll = (name) => (c) => c.scroll(name)

/** Held frame at the end of every clip, so there is something to trim into. */
const OUTRO = wait(1500)

export const CLIPS = [
  {
    id: 1,
    title: 'Entry & check-in',
    note: 'Host app → Berry → check in → 30-day calendar',
    seed: [{ type: 'DEMO_SET_STREAK', days: 6 }, { type: 'GO_HOST' }],
    steps: [
      wait(1400),
      tap('host-entry'),
      wait(1900),
      tap('check-in'),
      wait(3400), // the anticipate → settled animation plays on its own
      tap('reveal-collect'),
      wait(2300), // "what tomorrow pays"
      tap('reveal-done'),
      wait(1500),
      tap('streak-strip'),
      wait(3000),
      tap('modal-close'),
      OUTRO
    ]
  },

  {
    id: 2,
    title: "Berry's room",
    note: 'Tap to talk → feed → the room re-themes',
    seed: [
      { type: 'SEEN_INTRO' },
      { type: 'NAVIGATE', screen: 'home' },
      { type: 'CHECK_IN' },
      // Drop the reveal the check-in queues, or it pops over the opening beat.
      { type: 'CLEAR_CHECK_IN' },
      { type: 'DEMO_GRANT_ITEMS' },
      { type: 'DEMO_OWN_ITEMS', ids: ['bg-sakura', 'bg-cabin'] }
    ],
    steps: [
      wait(1500),
      tap('berry-pet'),
      wait(2000),
      tap('feed-berry'),
      wait(1000),
      tap('treat-berry-snack'),
      wait(2200),
      // Equipped straight from the reducer so the room re-themes without
      // leaving Berry's screen. Clip 4 shows the wardrobe that actually does it.
      act({ type: 'EQUIP_ITEM', itemId: 'bg-sakura' }),
      wait(2200),
      act({ type: 'EQUIP_ITEM', itemId: 'bg-cabin' }),
      OUTRO
    ]
  },

  {
    id: 3,
    title: 'Play & earn',
    note: 'Tickets → Baggage Match → payout',
    seed: [
      { type: 'SEEN_INTRO' },
      { type: 'CHECK_IN' },
      // Drop the reveal the check-in queues, or it pops over the opening beat.
      { type: 'CLEAR_CHECK_IN' },
      { type: 'NAVIGATE', screen: 'play' }
    ],
    steps: [
      wait(1700),
      tap('game-baggagematch'),
      wait(1500),
      tap('game-start'),
      wait(900),
      run(playBaggageMatch),
      wait(1900),
      tap('game-collect'),
      wait(1800),
      OUTRO
    ]
  },

  {
    id: 4,
    title: 'Collection',
    note: 'Land in Tokyo → stamp + exclusive → wardrobe',
    seed: [
      { type: 'SEEN_INTRO' },
      { type: 'NAVIGATE', screen: 'collect' },
      { type: 'DEMO_OWN_ITEMS', ids: ['bg-sakura'] }
    ],
    steps: [
      wait(1600),
      act({ type: 'COMPLETE_FLIGHT', code: 'HND' }),
      wait(3200),
      tap('collect-tab-wardrobe'),
      wait(1400),
      tap('slot-hat'),
      wait(1000),
      tap('item-japan-hachimaki'),
      wait(2200),
      tap('slot-background'),
      wait(1000),
      tap('item-bg-sakura'),
      wait(2200),
      OUTRO
    ]
  },

  {
    id: 5,
    title: 'Rewards',
    note: 'The coupon ladders → buy a room → merch',
    seed: [
      { type: 'SEEN_INTRO' },
      { type: 'NAVIGATE', screen: 'shop' },
      { type: 'DEMO_GRANT_COINS', amount: 6000 }
    ],
    steps: [
      wait(1700),
      tap('shop-tab-snack'),
      wait(1300),
      tap('shop-tab-meal'),
      wait(1300),
      tap('shop-tab-sweet'),
      wait(1300),
      tap('shop-tab-berry'),
      wait(1400),
      tap('reward-bg-sakura'), // digital: granted instantly, no voucher
      wait(2600), // the "added to Berry's wardrobe" celebration
      tap('pull-close'),
      wait(1200),
      tap('shop-tab-merch'),
      wait(2200),
      OUTRO
    ]
  },

  {
    id: 6,
    title: 'In-flight & expiry',
    note: 'Offline rules → back online → when coins expire',
    seed: [
      { type: 'SEEN_INTRO' },
      { type: 'NAVIGATE', screen: 'home' },
      { type: 'CHECK_IN' },
      // Drop the reveal the check-in queues, or it pops over the opening beat.
      { type: 'CLEAR_CHECK_IN' },
      { type: 'DEMO_GRANT_COINS', amount: 3000 }
    ],
    steps: [
      wait(1400),
      act({ type: 'TOGGLE_OFFLINE' }),
      wait(2200),
      tap('nav-play'),
      wait(2600),
      tap('nav-shop'),
      wait(2600),
      act({ type: 'TOGGLE_OFFLINE' }), // reconnect toast
      wait(2000),
      tap('coin-pill'),
      wait(2800),
      tap('modal-close'),
      wait(900),
      act({ type: 'ADVANCE_DAY', days: 152 }), // into the expiry warning window
      wait(2400),
      tap('coin-pill'),
      wait(2600),
      OUTRO
    ]
  }
]

export const CLIPS_BY_ID = Object.fromEntries(CLIPS.map((c) => [c.id, c]))
