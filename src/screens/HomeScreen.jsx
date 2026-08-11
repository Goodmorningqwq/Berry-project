import { useEffect, useRef, useState } from 'react'
import {
  useStore,
  CHECK_IN_COINS,
  FEED_REWARDS,
  MILESTONE_DAYS,
  prettyDate
} from '../state/store.jsx'
import { useToast } from '../components/Toast.jsx'
import Berry from '../components/Berry.jsx'
import CheckInReveal from '../components/CheckInReveal.jsx'
import { Coin, Empty, Modal } from '../components/ui.jsx'
import { BASIC_ITEMS, ITEMS_BY_ID } from '../data/items.js'
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
  const [caring, setCaring] = useState(false)
  const [effect, setEffect] = useState(null)
  const effectTimer = useRef(null)

  useEffect(() => () => clearTimeout(effectTimer.current), [])

  const care = (item) => {
    dispatch({ type: 'FEED_BERRY', itemId: item.id })
    const reward = FEED_REWARDS[item.id] ?? 10
    toast(
      item.kind === 'wash'
        ? `Berry is squeaky clean · +${reward} berry coins`
        : `Berry loved that · +${reward} berry coins`,
      item.emoji
    )
    setCaring(false)
    setEffect('hearts')
    clearTimeout(effectTimer.current)
    effectTimer.current = setTimeout(() => setEffect(null), 1600)
  }

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
          mood={effect ? 'happy' : checkedInToday ? 'happy' : 'sleepy'}
          effect={effect}
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

        {/* Preview of what the next seven days pay out — the retention
            argument, made visible. */}
        <div className="streak-days">
          {Array.from({ length: 7 }, (_, i) => {
            const day = i + 1
            const done = day <= cyclePosition
            const isNext = day === (checkedInToday ? cyclePosition + 1 : cyclePosition + 1)
            return (
              <div
                key={day}
                className={`streak-day ${done ? 'streak-day--done' : ''} ${
                  isNext ? 'streak-day--today' : ''
                }`}
              >
                <span className="streak-day__num">{day}</span>
                <span className="streak-day__reward">
                  {day === 7 ? '🎁' : `+${CHECK_IN_COINS}`}
                </span>
              </div>
            )
          })}
        </div>
        <p className="tiny" style={{ marginTop: 8, textAlign: 'center' }}>
          Day 7 pays a free blindbox · day {MILESTONE_DAYS} unlocks{' '}
          <b>{ITEMS_BY_ID.pilot?.name ?? 'the exclusive look'}</b>
        </p>
        <p className="tiny" style={{ marginTop: 4, textAlign: 'center', opacity: 0.7 }}>
          {prettyDate(today)}
        </p>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Berry’s stash</div>
            <p className="muted" style={{ marginTop: 2 }}>
              {basics.length > 0
                ? 'Feed Berry a treat and he’ll share his coins.'
                : 'Check in daily to collect snacks for Berry.'}
            </p>
          </div>
          <button
            className={`btn ${basics.length > 0 ? 'btn--gold' : ''}`}
            onClick={() => setCaring(true)}
            disabled={basics.length === 0}
          >
            🍪 Feed Berry
          </button>
        </div>

        {basics.length > 0 && (
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            {basics.map((item) => (
              <div key={item.id} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26 }}>{item.emoji}</div>
                <div className="tiny" style={{ fontWeight: 700 }}>
                  ×{state.inventory[item.id]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {state.lastCheckInResult && (
        <CheckInReveal
          result={state.lastCheckInResult}
          equipped={state.equipped}
          onCollect={() => dispatch({ type: 'CLEAR_CHECK_IN' })}
        />
      )}

      <Modal open={caring} onClose={() => setCaring(false)} label="Care for Berry">
        <h3 style={{ fontSize: 17 }}>Care for Berry</h3>
        <p className="muted" style={{ marginTop: 4 }}>
          Treats come from your daily check-ins. Berry pays you back in coins.
        </p>

        {basics.length === 0 ? (
          <Empty
            emoji="🍪"
            title="Berry’s bowl is empty"
            hint="Check in tomorrow — treats drop as a check-in bonus."
          />
        ) : (
          <div style={{ marginTop: 12 }}>
            {basics.map((item) => (
              <button key={item.id} className="reward-row" onClick={() => care(item)}>
                <div className="reward-row__emoji">{item.emoji}</div>
                <div className="reward-row__body">
                  <div className="reward-row__name">
                    {item.name} <span className="tiny">×{state.inventory[item.id]}</span>
                  </div>
                  <p className="tiny">{item.note}</p>
                </div>
                <span className="chip chip--gold">
                  <Coin small /> +{FEED_REWARDS[item.id]}
                </span>
              </button>
            ))}
          </div>
        )}

        <button
          className="btn btn--ghost btn--block"
          style={{ marginTop: 14 }}
          onClick={() => setCaring(false)}
        >
          Close
        </button>
      </Modal>

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
