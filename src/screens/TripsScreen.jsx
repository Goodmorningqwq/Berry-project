import { useState } from 'react'
import { useStore, prettyDate } from '../state/store.jsx'
import { useToast } from '../components/Toast.jsx'
import { Empty } from '../components/ui.jsx'
import {
  BY_COUNTRY,
  COUNTRIES_BY_ID,
  DESTINATIONS_BY_CODE,
  ORIGIN,
  nextTrip
} from '../data/destinations.js'
import { ITEMS_BY_ID } from '../data/items.js'

const FLIGHT_COINS = 50

export default function TripsScreen() {
  const { state, dispatch, checkedInToday } = useStore()
  const toast = useToast()
  const [picking, setPicking] = useState(false)

  const trip = nextTrip(state.stamps)

  const fly = (code) => {
    const dest = DESTINATIONS_BY_CODE[code]
    const isNewStamp = !state.stamps.includes(code)
    const countryReward = COUNTRIES_BY_ID[dest.country]?.reward
    const reward =
      countryReward && !state.ownedItems.includes(countryReward) ? ITEMS_BY_ID[countryReward] : null

    dispatch({ type: 'COMPLETE_FLIGHT', code })
    setPicking(false)
    dispatch({ type: 'NAVIGATE', screen: 'collect' })

    toast(`Landed in ${dest.city} · +${FLIGHT_COINS} berry coins`, '🛬')
    if (isNewStamp) toast(`${dest.city} stamp added to your passport`, dest.emoji)
    if (reward) toast(`${dest.country} exclusive unlocked: ${reward.name}`, '🎽')
  }

  const steps = [
    { label: 'Booking confirmed', hint: 'Berry coins are redeemable from now', done: true },
    { label: 'Pre-flight check-ins', hint: 'Earn coins daily before you fly', done: checkedInToday },
    { label: 'Online check-in', hint: 'Last chance to use a voucher', done: false },
    { label: 'Land & collect your stamp', hint: 'Plus this city’s exclusive outfit', done: false }
  ]

  return (
    <>
      <div className="screen-head">
        <h2>Trips</h2>
      </div>

      <h3 className="section-title">Upcoming</h3>

      <div className="boarding-pass">
        <div className="boarding-pass__top">
          <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>{trip.number}</div>
          <div className="flight-card__route">
            <div className="flight-card__code">{trip.from.code}</div>
            <div className="flight-card__line">
              <span>✈️</span>
            </div>
            <div className="flight-card__code">{trip.to}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.85 }}>
            <span>{ORIGIN.city}</span>
            <span>
              {trip.dest.emoji} {trip.dest.city}
            </span>
          </div>
        </div>

        <div className="boarding-pass__body">
          <div className="pass-grid">
            <div>
              <span>Depart</span>
              <b>{trip.depart}</b>
            </div>
            <div>
              <span>Arrive</span>
              <b>{trip.arrive}</b>
            </div>
            <div>
              <span>Gate</span>
              <b>{trip.gate}</b>
            </div>
            <div>
              <span>Seat</span>
              <b>{trip.seat}</b>
            </div>
          </div>

          <div className="timeline">
            {steps.map((s) => (
              <div key={s.label} className={`timeline__step ${s.done ? 'timeline__step--done' : ''}`}>
                <div className="timeline__dot">{s.done ? '✓' : '•'}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{s.label}</div>
                  <p className="tiny">{s.hint}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn--primary btn--block" style={{ marginTop: 14 }} onClick={() => fly(trip.to)}>
            Simulate landing in {trip.dest.city}
          </button>
          <button
            className="btn btn--ghost btn--block"
            style={{ marginTop: 8 }}
            onClick={() => setPicking((p) => !p)}
          >
            {picking ? 'Hide destinations' : 'Fly somewhere else'}
          </button>

          {picking && (
            <div className="picker-scroll">
              {BY_COUNTRY.map((country) => (
                <div key={country.id}>
                  <p className="picker-group">
                    {country.flag} {country.id}
                  </p>
                  <div className="destination-picker">
                    {country.cities.map((d) => (
                      <button key={d.code} onClick={() => fly(d.code)}>
                        <span style={{ fontSize: 18 }}>{d.emoji}</span>
                        <span>
                          {d.city}
                          <br />
                          <span className="tiny">
                            {state.stamps.includes(d.code) ? 'Stamped' : d.code}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="tiny" style={{ marginTop: 10, textAlign: 'center' }}>
            Demo shortcut — in the real app this fires when the flight lands.
          </p>
        </div>
      </div>

      <h3 className="section-title">
        Flight history <small>{state.flights.length} trips</small>
      </h3>

      {state.flights.length === 0 ? (
        <Empty emoji="🧳" title="No trips yet" hint="Complete a flight to start your passport." />
      ) : (
        <div className="card">
          {[...state.flights].reverse().map((f, i) => {
            const d = DESTINATIONS_BY_CODE[f.code]
            return (
              <div
                key={`${f.code}-${i}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderTop: i ? '1px solid var(--line)' : 'none'
                }}
              >
                <span style={{ fontSize: 22 }}>{d.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>
                    {ORIGIN.code} → {d.code} · {d.city}
                  </div>
                  <p className="tiny">{prettyDate(f.date)}</p>
                </div>
                <span className="chip">+{FLIGHT_COINS}</span>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
