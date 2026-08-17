import { useCallback, useEffect, useRef, useState } from 'react'
import { Coin } from '../components/ui.jsx'
import { LeaderboardSlice } from '../components/Leaderboard.jsx'

/**
 * Eight pairs of travel icons on a 4x4 grid, against a 60 second clock.
 * Faster clears pay more — the reward scales with the time left over.
 */

const FACES = ['🧳', '🎫', '🛂', '🗺️', '📷', '🕶️', '🧃', '✈️']
const ROUND_SECONDS = 60

function shuffled() {
  const deck = [...FACES, ...FACES].map((face, i) => ({ id: i, face, up: false, matched: false }))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export default function BaggageMatch({ offline, gameId, bestScore = 0, onExit, onFinish }) {
  const [cards, setCards] = useState(shuffled)
  const [picked, setPicked] = useState([])
  const [moves, setMoves] = useState(0)
  const [left, setLeft] = useState(ROUND_SECONDS)
  const [phase, setPhase] = useState('ready') // ready | running | over
  const lockRef = useRef(false)
  const timeoutRef = useRef(null)

  const solved = cards.every((c) => c.matched)

  useEffect(() => {
    if (phase !== 'running') return
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(t)
          setPhase('over')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (phase === 'running' && solved) setPhase('over')
  }, [solved, phase])

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const flip = useCallback(
    (card) => {
      if (phase !== 'running' || lockRef.current || card.up || card.matched) return

      const next = cards.map((c) => (c.id === card.id ? { ...c, up: true } : c))
      const nowPicked = [...picked, card.id]
      setCards(next)
      setPicked(nowPicked)

      if (nowPicked.length < 2) return

      setMoves((m) => m + 1)
      const [aId, bId] = nowPicked
      const a = next.find((c) => c.id === aId)
      const b = next.find((c) => c.id === bId)

      if (a.face === b.face) {
        setCards(next.map((c) => (c.id === aId || c.id === bId ? { ...c, matched: true } : c)))
        setPicked([])
        return
      }

      lockRef.current = true
      timeoutRef.current = setTimeout(() => {
        setCards((cs) => cs.map((c) => (c.id === aId || c.id === bId ? { ...c, up: false } : c)))
        setPicked([])
        lockRef.current = false
      }, 750)
    },
    [cards, picked, phase]
  )

  const start = () => {
    setCards(shuffled())
    setPicked([])
    setMoves(0)
    setLeft(ROUND_SECONDS)
    lockRef.current = false
    setPhase('running')
  }

  // 35 cap reached at 50s to spare. Failing pays a floor of 1 — enough that a
  // spent ticket isn't wholly wasted, too little to make idling worth doing.
  const reward = solved ? Math.min(35, 1 + Math.floor(left * 0.68)) : 1
  const matchedPairs = cards.filter((c) => c.matched).length / 2

  return (
    <div className="game-shell">
      <div className="game-shell__bar">
        <button onClick={onExit} aria-label="Quit game">
          ← Quit
        </button>
        <span>Baggage Match</span>
        <span>⏱ {left}s</span>
      </div>

      <div className="game-shell__body" style={{ overflowY: 'auto' }}>
        <p className="muted" style={{ padding: '14px 18px 0', textAlign: 'center' }}>
          {matchedPairs}/8 pairs · {moves} moves
        </p>

        <div className="match-grid">
          {cards.map((card) => (
            <button
              key={card.id}
              className={`match-card ${card.up || card.matched ? 'match-card--up' : ''} ${
                card.matched ? 'match-card--matched' : ''
              }`}
              onClick={() => flip(card)}
              aria-label={card.up || card.matched ? card.face : 'Hidden card'}
            >
              <span className="match-card__inner">
                <span className="match-card__face match-card__back">B</span>
                <span className="match-card__face match-card__front">{card.face}</span>
              </span>
            </button>
          ))}
        </div>

        {phase === 'ready' && (
          <div className="dash-overlay">
            <div className="dash-overlay__card">
              <div style={{ fontSize: 34 }}>🧳</div>
              <h3 style={{ marginTop: 8 }}>Baggage Match</h3>
              <p className="muted" style={{ marginTop: 8 }}>
                Find all 8 pairs before the clock runs out. The faster you clear, the more berry
                coins Berry earns.
              </p>
              <button className="btn btn--primary btn--block" style={{ marginTop: 16 }} onClick={start}>
                Start
              </button>
            </div>
          </div>
        )}

        {phase === 'over' && (
          <div className="dash-overlay">
            <div className="dash-overlay__card">
              <div style={{ fontSize: 34 }}>{solved ? '🎉' : '⏰'}</div>
              <h3 style={{ marginTop: 8 }}>{solved ? 'All matched!' : 'Out of time'}</h3>
              <p className="muted" style={{ marginTop: 6 }}>
                {solved ? `${left}s to spare · ${moves} moves` : `${matchedPairs} of 8 pairs found`}
              </p>
              {solved ? (
                <>
                  {offline ? (
                    <p className="tiny" style={{ marginTop: 14 }}>
                      ✈️ No coins or ranking in flight — and no ticket spent, so they’re all waiting
                      for you when you land.
                    </p>
                  ) : (
                    <>
                      <div style={{ marginTop: 14, fontSize: 22, fontWeight: 800 }}>
                        <Coin /> +{reward}
                      </div>
                      {/* Score is the time you had left, so a faster clear ranks higher. */}
                      <LeaderboardSlice gameId={gameId} score={left} isBest={left > bestScore} />
                    </>
                  )}
                  <button
                    className="btn btn--gold btn--block"
                    style={{ marginTop: 16 }}
                    onClick={() => onFinish(reward, left)}
                  >
                    {offline ? 'Done' : `Collect ${reward} coin${reward === 1 ? '' : 's'}`}
                  </button>
                </>
              ) : (
                <>
                  {/* A ticket was spent, so even a failed round pays the floor. */}
                  {!offline && (
                    <div style={{ marginTop: 14, fontSize: 22, fontWeight: 800 }}>
                      <Coin /> +{reward}
                    </div>
                  )}
                  <button
                    className="btn btn--gold btn--block"
                    style={{ marginTop: 16 }}
                    onClick={() => onFinish(reward, 0)}
                  >
                    {offline ? 'Done' : `Collect ${reward} coin${reward === 1 ? '' : 's'}`}
                  </button>
                </>
              )}
              {!offline && (
                <button className="btn btn--ghost btn--block" style={{ marginTop: 8 }} onClick={onExit}>
                  Leave without collecting <small>— ticket refunded</small>
                </button>
              )}
              {offline && (
                <button className="btn btn--ghost btn--block" style={{ marginTop: 8 }} onClick={onExit}>
                  Back to games
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
