import { useStore, prettyDate } from '../state/store.jsx'
import { DESTINATIONS_BY_CODE, ORIGIN } from '../data/destinations.js'
import { ITEMS_BY_ID } from '../data/items.js'
import Berry from './Berry.jsx'
import { Coin, Modal } from './ui.jsx'

/**
 * A destination's travel history — every trip taken there, from the snapshots
 * stored on each flight. Tapping a passport stamp opens this.
 */
export default function FlightRecord({ code, onClose }) {
  const { state } = useStore()
  const dest = code ? DESTINATIONS_BY_CODE[code] : null
  const trips = code ? state.flights.filter((f) => f.code === code) : []

  if (!dest) return null

  return (
    <Modal open={!!code} onClose={onClose} label={`${dest.city} travel record`}>
      <div className="record__head">
        <span className="record__emoji">{dest.emoji}</span>
        <div>
          <h3 style={{ fontSize: 18 }}>{dest.city}</h3>
          <p className="tiny">
            {dest.country} · {dest.code}
          </p>
        </div>
        <span className="chip">
          {trips.length} {trips.length === 1 ? 'trip' : 'trips'}
        </span>
      </div>

      {trips.length === 0 ? (
        <div className="empty">
          <Berry equipped={{ look: 'everyday' }} mood="sleepy" size={104} animate={false} />
          <b style={{ display: 'block', marginTop: 6 }}>Berry hasn’t been here yet</b>
          <p style={{ marginTop: 6 }}>
            Fly to {dest.city} and your stamp — and {dest.country}’s exclusive — are waiting.
          </p>
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          {[...trips].reverse().map((f, i) => {
            const unlocked = f.unlocked ? ITEMS_BY_ID[f.unlocked] : null
            return (
              <div className="record-card" key={`${f.code}-${f.date}-${i}`}>
                <div className="record-card__top">
                  <span>{f.number ?? 'UO'}</span>
                  <span>{prettyDate(f.date)}</span>
                </div>

                <div className="flight-card__route" style={{ marginTop: 6 }}>
                  <div className="flight-card__code">{ORIGIN.code}</div>
                  <div className="flight-card__line">
                    <span>✈️</span>
                  </div>
                  <div className="flight-card__code">{f.code}</div>
                </div>

                <div className="pass-grid" style={{ marginTop: 10 }}>
                  <div>
                    <span>Depart</span>
                    <b>{f.depart ?? '—'}</b>
                  </div>
                  <div>
                    <span>Arrive</span>
                    <b>{f.arrive ?? '—'}</b>
                  </div>
                  <div>
                    <span>Gate</span>
                    <b>{f.gate ?? '—'}</b>
                  </div>
                  <div>
                    <span>Seat</span>
                    <b>{f.seat ?? '—'}</b>
                  </div>
                </div>

                <div className="record-card__foot">
                  <span className="chip chip--gold">
                    <Coin small /> +{f.coins ?? 50}
                  </span>
                  {unlocked && <span className="chip">🎽 {unlocked.name}</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <button className="btn btn--ghost btn--block" style={{ marginTop: 14 }} onClick={onClose}>
        Close
      </button>
    </Modal>
  )
}
