import { useEffect, useRef, useState } from 'react'
import { useStore } from '../state/store.jsx'
import { pickLine } from '../data/dialogue.js'
import Berry from './Berry.jsx'

/**
 * Berry's room — the top of the Home screen.
 *
 * The medals already live on Collection → Medals as a list; here they're
 * trophies on a shelf, so the collection is the first thing anyone sees.
 * Unearned slots stay visible as dim outlines: a trophy room only works if the
 * gaps are obvious.
 *
 * Everything is derived from the `medals` and `regionBadges` selectors — the
 * room holds no state of its own.
 */

const CLOUDS = [
  { top: 14, left: 8, w: 46, h: 15, o: 0.9 },
  { top: 30, left: 40, w: 34, h: 12, o: 0.7 }
]

function Trophy({ emoji, label, earned, color, onClick }) {
  return (
    <button
      className={`trophy ${earned ? 'trophy--earned' : 'trophy--empty'}`}
      style={earned && color ? { '--trophy-color': color } : undefined}
      onClick={onClick}
      title={label}
      aria-label={earned ? `${label} — earned` : `${label} — not earned yet`}
    >
      <span className="trophy__face">{earned ? emoji : ''}</span>
    </button>
  )
}

const TAP_LINE_MS = 4200

export default function BerryRoom({ mood, effect, speech }) {
  const { state, dispatch, medals, regionBadges, hungry, offline, checkedInToday } = useStore()

  const [tapLine, setTapLine] = useState(null)
  const [poked, setPoked] = useState(false)
  const lineTimer = useRef(null)
  const pokeTimer = useRef(null)

  useEffect(
    () => () => {
      clearTimeout(lineTimer.current)
      clearTimeout(pokeTimer.current)
    },
    []
  )

  const openMedals = () => dispatch({ type: 'NAVIGATE', screen: 'collect' })

  const pet = () => {
    const ctx = {
      hungry,
      offline,
      checkedInToday,
      streak: state.streak,
      stamps: state.stamps.length,
      tickets: state.blindboxTickets,
      look: state.equipped.look
    }
    setTapLine(pickLine(ctx, tapLine ?? speech))

    // Restart the squash so rapid taps keep reacting rather than sitting still.
    setPoked(false)
    clearTimeout(pokeTimer.current)
    pokeTimer.current = setTimeout(() => setPoked(true), 0)

    clearTimeout(lineTimer.current)
    lineTimer.current = setTimeout(() => setTapLine(null), TAP_LINE_MS)
  }

  return (
    <section className="room">
      {/* back wall */}
      <div className="room__wall" aria-hidden="true">
        <div className="room__window">
          {CLOUDS.map((c, i) => (
            <span key={i} style={{ top: c.top, left: c.left, width: c.w, height: c.h, opacity: c.o }} />
          ))}
        </div>
      </div>

      <div className="room__shelves">
        <div className="room__shelf">
          {medals.map((m) => (
            <Trophy
              key={m.id}
              emoji={m.emoji}
              label={m.current ? `${m.name} · ${m.current.label}` : m.name}
              earned={!!m.current}
              color={m.current?.color}
              onClick={openMedals}
            />
          ))}
        </div>
        <div className="room__shelf">
          {regionBadges.map((b) => (
            <Trophy
              key={b.id}
              emoji={b.emoji}
              label={b.name}
              earned={b.earned}
              color="var(--purple-500)"
              onClick={openMedals}
            />
          ))}
        </div>
      </div>

      <div className="room__floor" aria-hidden="true" />

      <div className="room__stage">
        <p className="stage__greeting">Your travel buddy</p>
        <h1 className="stage__name">Berry</h1>
        <p className="speech" key={tapLine ?? speech}>
          {tapLine ?? speech}
        </p>

        <button
          className={`room__pet ${poked ? 'room__pet--poked' : ''}`}
          onClick={pet}
          aria-label="Pet Berry"
        >
          <Berry
            equipped={state.equipped}
            mood={tapLine ? 'happy' : mood}
            // Feeding hearts still win — petting only adds hearts of its own.
            effect={effect ?? (poked ? 'hearts' : null)}
            size={168}
          />
        </button>
      </div>
    </section>
  )
}
