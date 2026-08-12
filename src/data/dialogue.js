/**
 * What Berry says when you tap him.
 *
 * Context first, chatter second: if something is actually true right now he
 * comments on it, otherwise he pulls from the general pool. Either way the
 * picker never returns the line that's already on screen, so every tap says
 * something new.
 */

import { MILESTONE_DAYS } from '../state/store.jsx'

/** Checked in order — the first match wins. */
export const CONTEXT_LINES = [
  {
    id: 'offline',
    when: (c) => c.offline,
    lines: [
      'No signal up here. Just you, me and the clouds ☁️',
      'Rewards are grounded until we land — but I’m not going anywhere.',
      'Can we open the window? …No? Fair enough.',
      'Flying is much comfier when someone’s holding you.'
    ]
  },
  {
    id: 'hungry',
    when: (c) => c.hungry,
    lines: [
      'My tummy just made a noise. Did you hear that?',
      'I’m not saying I’m starving. I’m saying snacks exist.',
      'One little treat? I’ll be extra cute for it.',
      'Feed me and I’ll pretend I wasn’t sulking 🍪'
    ]
  },
  {
    id: 'not-checked-in',
    when: (c) => !c.checkedInToday,
    lines: [
      'You haven’t checked in yet! I’ve been counting.',
      'Coins are just sitting there waiting for you, you know.',
      'Tap check-in. I’ll wait. I’m very patient. Mostly.'
    ]
  },
  {
    id: 'near-milestone',
    when: (c) => c.streak >= MILESTONE_DAYS - 3 && c.streak < MILESTONE_DAYS,
    lines: [
      `So close to ${MILESTONE_DAYS} days. I can almost feel the wings 👑`,
      'Don’t stop now — we’ve come so far together!'
    ]
  },
  {
    id: 'milestone',
    when: (c) => c.streak >= MILESTONE_DAYS,
    lines: [
      'Captain Berry, at your service ✈️',
      'Thirty days. You actually did it. I’m a bit emotional.',
      'I wear these wings because of you.'
    ]
  },
  {
    id: 'pilot-look',
    when: (c) => c.look === 'pilot',
    lines: [
      'Do I look official? I feel official.',
      'This is your captain speaking. Please enjoy the snacks.',
      'I have absolutely no flying qualifications. Don’t tell anyone.'
    ]
  },
  {
    id: 'crew-look',
    when: (c) => c.look === 'crew',
    lines: [
      'Tea? Coffee? A small woolly hug?',
      'Cabin crew, prepare for cuddles.'
    ]
  },
  {
    id: 'tickets',
    when: (c) => c.tickets > 0,
    lines: [
      'You’ve got a blindbox waiting! Open it, open it, open it.',
      'There’s an unopened box with my name on it. Well — your name.'
    ]
  },
  {
    id: 'no-stamps',
    when: (c) => c.stamps === 0,
    lines: [
      'I’ve never left Hong Kong. Not once. Look at me.',
      'Where are we going first? I’ve got my bag packed already.',
      'I hear Osaka has excellent snacks. Just putting that out there.'
    ]
  },
  {
    id: 'streak-week',
    when: (c) => c.streak >= 7,
    lines: [
      // A line may be a function of context when it wants the real numbers.
      (c) => `${c.streak} days in a row and counting — you’re one of the good ones.`,
      'Same time tomorrow? It’s our thing now.'
    ]
  }
]

/** The general pool, used whenever nothing more specific applies. */
export const CHATTER = [
  'Hello! You smell like an airport. I mean that nicely.',
  'Do you think clouds are soft? I think they’re soft.',
  'I counted my coins twice. Same number both times. Suspicious.',
  'If you tap me again I will simply say another thing.',
  'I’ve been practising my window-seat face.',
  'Sometimes I just sit here and think about noodles.',
  'Is it a holiday somewhere? It’s always a holiday somewhere.',
  'I packed three hats and no socks. Bears don’t need socks.',
  'One day I’d like to see snow. Or a very cold cloud.',
  'You’re my favourite person in this app. You’re the only person in this app.',
  'I dreamt I was a very small plane. It was lovely.',
  'Do you ever look at a map and just… feel things?',
  'I keep my boarding passes. All of them. Every single one.',
  'Airports at 6am have a certain magic, don’t you think?',
  'That was a good tap. Firm, but kind.',
  'I’m told I photograph well from this side.',
  'Somewhere out there is a snack with my name on it.',
  'Wanna go somewhere? Anywhere. I’m extremely easy to please.',
  'I alphabetised my stamps. Then I un-alphabetised them.',
  'Turbulence doesn’t scare me. Loud noises do, but not turbulence.',
  'Every time you tap me a little serotonin happens.'
]

/**
 * Picks Berry's next line.
 *
 * `last` is whatever is already on screen — it's excluded so consecutive taps
 * never repeat, which is the whole point of tapping again.
 */
export function pickLine(ctx, last) {
  const match = CONTEXT_LINES.find((entry) => entry.when(ctx))
  const pool = match ? match.lines : CHATTER

  // Resolve first so the de-duplication compares the strings the player
  // actually sees, not the functions behind them.
  const resolved = pool.map((l) => (typeof l === 'function' ? l(ctx) : l))
  const fresh = resolved.filter((l) => l !== last)
  const from = fresh.length ? fresh : resolved

  return from[Math.floor(Math.random() * from.length)]
}
