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

/**
 * Room scenery, drawn in the same ink style as Berry's props — heavy outline,
 * flat fills. It lives here rather than in BerryArt.jsx because that file is
 * the wardrobe; this is furniture.
 */
function RoomBed() {
  // Lighter than the props' weight: the bed renders ~1.7x its viewBox scale, so
  // a 3px stroke would come out heavier than anything on Berry himself.
  const ink = { stroke: '#141414', strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round' }
  return (
    <svg className="room__bed" viewBox="0 0 120 76" aria-hidden="true" focusable="false">
      {/* headboard */}
      <path d="M6 20 q0 -10 10 -10 h14 q10 0 10 10 v34 h-34 z" fill="#B07A4A" {...ink} />
      {/* mattress */}
      <rect x="24" y="34" width="92" height="20" rx="7" fill="#FBF3E8" {...ink} />
      {/* pillow */}
      <rect x="30" y="26" width="30" height="15" rx="6" fill="#fff" {...ink} />
      {/* blanket */}
      <path d="M62 34 h50 q4 0 4 5 v10 q0 5 -4 5 h-50 z" fill="#9046B8" {...ink} />
      <path d="M62 44 h54" stroke="#7A38A0" strokeWidth="2.5" />
      {/* frame and legs */}
      <rect x="24" y="52" width="92" height="8" rx="3" fill="#C98A54" {...ink} />
      <rect x="28" y="58" width="8" height="12" rx="3" fill="#B07A4A" {...ink} />
      <rect x="104" y="58" width="8" height="12" rx="3" fill="#B07A4A" {...ink} />
    </svg>
  )
}

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
  const lineTimer = useRef(null)

  useEffect(() => () => clearTimeout(lineTimer.current), [])

  const openMedals = () => dispatch({ type: 'NAVIGATE', screen: 'collect' })

  /**
   * Petting is conversational only — Berry doesn't move. Repeated taps would
   * otherwise leave him wobbling constantly; the speech bubble's own pop is
   * the signal that something changed.
   */
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
      <RoomBed />

      <div className="room__stage">
        <p className="stage__greeting">Your travel buddy</p>
        <h1 className="stage__name">Berry</h1>
        <p className="speech" key={tapLine ?? speech}>
          {tapLine ?? speech}
        </p>

        <button className="room__pet" onClick={pet} aria-label="Pet Berry">
          {/* mood and effect pass straight through: a tap must not change how
              Berry looks or moves, and hearts stay reserved for feeding. Note
              the happy mood also speeds up his idle bob, so overriding it here
              would count as movement too. */}
          <Berry equipped={state.equipped} mood={mood} effect={effect} size={168} />
        </button>
      </div>
    </section>
  )
}
