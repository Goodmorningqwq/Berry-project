import { useState } from 'react'
import { useStore, DAILY_PLAYS_PER_GAME } from '../state/store.jsx'
import { useToast } from '../components/Toast.jsx'
import { Coin } from '../components/ui.jsx'
import CloudDash from '../games/CloudDash.jsx'
import BaggageMatch from '../games/BaggageMatch.jsx'

const GAMES = [
  {
    id: 'clouddash',
    name: 'Cloud Dash',
    blurb: 'Tap to fly Berry through the clouds and scoop up coins.',
    emoji: '☁️',
    tint: '#dff0fd',
    Component: CloudDash
  },
  {
    id: 'baggagematch',
    name: 'Baggage Match',
    blurb: 'Match all 8 pairs of travel gear before the clock runs out.',
    emoji: '🧳',
    tint: '#f6e9fb',
    Component: BaggageMatch
  }
]

export default function PlayScreen() {
  const { state, dispatch, playsLeft, checkedInToday, today } = useStore()
  const toast = useToast()
  const [active, setActive] = useState(null)

  const game = GAMES.find((g) => g.id === active)

  const finish = (amount) => {
    dispatch({ type: 'EARN_COINS', amount })
    dispatch({ type: 'RECORD_PLAY', gameId: active })
    toast(`+${amount} berry coins earned`, '🪙')
    setActive(null)
  }

  if (game) {
    const G = game.Component
    return <G equipped={state.equipped} onExit={() => setActive(null)} onFinish={finish} />
  }

  const quests = [
    { id: 'checkin', label: 'Daily check-in', done: checkedInToday, reward: 10 },
    {
      id: 'game',
      label: 'Play one minigame',
      done:
        state.plays.day === today && Object.values(state.plays.counts).some((n) => n > 0),
      reward: 10
    },
    { id: 'box', label: 'Open a blindbox', done: state.ownedItems.length > 1, reward: '👕' }
  ]

  return (
    <>
      <div className="screen-head">
        <h2>Play &amp; earn</h2>
        <p className="muted" style={{ marginTop: 4 }}>
          Every round pays berry coins. {DAILY_PLAYS_PER_GAME} rewarded plays per game, per day.
        </p>
      </div>

      <div style={{ marginTop: 16 }}>
        {GAMES.map((g) => {
          const left = playsLeft(g.id)
          return (
            <button
              key={g.id}
              className="game-card"
              onClick={() => setActive(g.id)}
              disabled={left === 0}
              style={left === 0 ? { opacity: 0.55 } : undefined}
            >
              <div className="game-card__art" style={{ background: g.tint }}>
                {g.emoji}
              </div>
              <div className="game-card__body">
                <div className="game-card__title">{g.name}</div>
                <p className="muted" style={{ marginTop: 2 }}>
                  {g.blurb}
                </p>
                <span className={`chip ${left === 0 ? 'chip--out' : 'chip--gold'}`}>
                  {left === 0 ? 'Back tomorrow' : `${left} rewarded play${left > 1 ? 's' : ''} left`}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <h3 className="section-title">Today with Berry</h3>
      <div className="card">
        {quests.map((q, i) => (
          <div
            key={q.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 0',
              borderTop: i ? '1px solid var(--line)' : 'none'
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                fontSize: 12,
                background: q.done ? 'var(--teal)' : 'var(--purple-50)',
                color: q.done ? '#fff' : 'var(--purple-300)'
              }}
            >
              ✓
            </span>
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{q.label}</span>
            <span className="tiny" style={{ fontWeight: 700 }}>
              {typeof q.reward === 'number' ? (
                <>
                  +{q.reward} <Coin small />
                </>
              ) : (
                q.reward
              )}
            </span>
          </div>
        ))}
      </div>

      <p className="tiny" style={{ marginTop: 14, textAlign: 'center' }}>
        Coins earned here are spent in Rewards — on blindboxes, inflight meals and merchandise.
      </p>
    </>
  )
}
