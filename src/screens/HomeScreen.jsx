import { useEffect, useRef } from 'react'
import { useStore, CHECK_IN_COINS, MILESTONE_DAYS, prettyDate } from '../state/store.jsx'
import { useToast } from '../components/Toast.jsx'
import Berry from '../components/Berry.jsx'
import { Coin } from '../components/ui.jsx'
import { BASIC_ITEMS, BASIC_ITEMS_BY_ID, ITEMS_BY_ID } from '../data/items.js'
import { nextTrip } from '../data/destinations.js'

const CLOUDS = [
  { top: 18, left: -10, w: 92, h: 26, o: 0.7 },
  { top: 54, left: 74, w: 64, h: 20, o: 0.55 },
  { top: 96, left: 8, w: 48, h: 16, o: 0.45 },
  { top: 130, left: 82, w: 76, h: 22, o: 0.5 }
]

function lineFor(state, checkedInToday) {
  if (!checkedInToday) return 'You’re back! Tap check-in and I’ll get you a treat 💜'
  if (state.streak >= MILESTONE_DAYS) return 'Thirty days together. You’re my favourite human.'
  if (state.streak >= 7) return `${state.streak} days in a row — we’re on a roll!`
  if (state.stamps.length === 0) return 'Where should we fly first? I’ve never left HKG…'
  return 'Fancy a minigame? I could use more berry coins.'
}

export default function HomeScreen() {
  const { state, dispatch, checkedInToday, today } = useStore()
  const toast = useToast()
  const prev = useRef(state)

  // The reducer decides the daily bonus, so we read the result back out of
  // state rather than duplicating the roll here.
  useEffect(() => {
    const p = prev.current
    if (state.lastCheckIn && state.lastCheckIn !== p.lastCheckIn) {
      toast(`Day ${state.streak} check-in · +${CHECK_IN_COINS} berry coins`, '🎁')

      if (state.blindboxTickets > p.blindboxTickets) {
        toast('7-day bonus: a free blindbox!', '🎉')
      }
      const gained = Object.keys(state.inventory).find(
        (k) => (state.inventory[k] || 0) > (p.inventory[k] || 0)
      )
      if (gained) {
        const item = BASIC_ITEMS_BY_ID[gained]
        toast(`Bonus item: ${item.name}`, item.emoji)
      }
      if (state.ownedItems.length > p.ownedItems.length) {
        const unlocked = ITEMS_BY_ID[state.ownedItems[state.ownedItems.length - 1]]
        toast(`${MILESTONE_DAYS}-day exclusive unlocked: ${unlocked.name}!`, '👑')
      }
    }
    prev.current = state
  }, [state, toast])

  const cyclePosition = state.streak === 0 ? 0 : ((state.streak - 1) % 7) + 1
  const milestonePct = Math.min(100, (state.streak / MILESTONE_DAYS) * 100)
  const trip = nextTrip(state.stamps)
  const basics = BASIC_ITEMS.filter((i) => state.inventory[i.id])

  return (
    <>
      <section className="stage">
        <div className="stage__clouds" aria-hidden="true">
          {CLOUDS.map((c, i) => (
            <span
              key={i}
              style={{ top: c.top, left: c.left, width: c.w, height: c.h, opacity: c.o }}
            />
          ))}
        </div>

        <p className="stage__greeting">Your travel buddy</p>
        <h1 className="stage__name">Berry</h1>

        <p className="speech">{lineFor(state, checkedInToday)}</p>

        <Berry
          equipped={state.equipped}
          mood={checkedInToday ? 'happy' : 'sleepy'}
          size={182}
        />
      </section>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="checkin">
          <div className="ring" style={{ '--pct': milestonePct }}>
            <div className="ring__label">
              <b>{state.streak}</b>
              <span>of {MILESTONE_DAYS}</span>
            </div>
          </div>
          <div className="checkin__text">
            <div className="checkin__title">
              {checkedInToday ? 'Checked in today' : 'Daily check-in'}
            </div>
            <p className="muted">
              {checkedInToday
                ? `See you tomorrow — ${MILESTONE_DAYS - state.streak > 0 ? `${MILESTONE_DAYS - state.streak} days to the exclusive set` : 'exclusive set unlocked'}`
                : `+${CHECK_IN_COINS} berry coins, and a bonus every 7 days`}
            </p>
          </div>
        </div>

        <button
          className={`btn btn--block btn--lg ${checkedInToday ? '' : 'btn--primary'}`}
          style={{ marginTop: 14 }}
          onClick={() => dispatch({ type: 'CHECK_IN' })}
          disabled={checkedInToday}
        >
          {checkedInToday ? `Come back tomorrow` : 'Check in'}
        </button>

        <div className="streak-days">
          {Array.from({ length: 7 }, (_, i) => {
            const day = i + 1
            const done = day <= cyclePosition
            return (
              <div
                key={day}
                className={`streak-day ${done ? 'streak-day--done' : ''} ${
                  day === cyclePosition + (checkedInToday ? 1 : 0) ? 'streak-day--today' : ''
                }`}
              >
                {day === 7 ? '🎁' : day}
              </div>
            )
          })}
        </div>
        <p className="tiny" style={{ marginTop: 8, textAlign: 'center' }}>
          {prettyDate(today)}
        </p>
      </div>

      {basics.length > 0 && (
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Berry’s stash</div>
          <div style={{ display: 'flex', gap: 14 }}>
            {basics.map((item) => (
              <div key={item.id} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26 }}>{item.emoji}</div>
                <div className="tiny" style={{ fontWeight: 700 }}>
                  ×{state.inventory[item.id]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tiles">
        <button className="tile" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'play' })}>
          <span className="tile__emoji">🎮</span>
          <span className="tile__label">Play & earn</span>
          <span className="tiny">
            +10 <Coin small />
          </span>
        </button>
        <button className="tile" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'shop' })}>
          <span className="tile__emoji">🎁</span>
          <span className="tile__label">Blindbox</span>
          <span className="tiny">
            {state.blindboxTickets > 0 ? `${state.blindboxTickets} free` : 'New drops'}
          </span>
        </button>
        <button className="tile" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'collect' })}>
          <span className="tile__emoji">📖</span>
          <span className="tile__label">Passport</span>
          <span className="tiny">{state.stamps.length} stamps</span>
        </button>
      </div>

      <h3 className="section-title">
        Next trip <small onClick={() => dispatch({ type: 'NAVIGATE', screen: 'trips' })}>View</small>
      </h3>

      <div className="flight-card" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'trips' })}>
        <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 600 }}>
          {trip.number} · {trip.dest.emoji} {trip.dest.city}
        </div>
        <div className="flight-card__route">
          <div className="flight-card__code">{trip.from.code}</div>
          <div className="flight-card__line">
            <span>✈️</span>
          </div>
          <div className="flight-card__code">{trip.to}</div>
        </div>
        <div className="flight-card__meta">
          <div>Depart {trip.depart}</div>
          <div>Seat {trip.seat}</div>
          <div>Gate {trip.gate}</div>
        </div>
      </div>
    </>
  )
}
