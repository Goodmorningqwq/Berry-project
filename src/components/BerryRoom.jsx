import { useStore } from '../state/store.jsx'
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

export default function BerryRoom({ mood, effect, speech }) {
  const { state, dispatch, medals, regionBadges } = useStore()

  const openMedals = () => dispatch({ type: 'NAVIGATE', screen: 'collect' })

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
        <p className="speech">{speech}</p>
        <Berry equipped={state.equipped} mood={mood} effect={effect} size={168} />
      </div>
    </section>
  )
}
