import { useState } from 'react'
import { useStore, DAILY_PLAYS_PER_GAME } from '../state/store.jsx'
import { useToast } from '../components/Toast.jsx'
import { Coin } from '../components/ui.jsx'
import Leaderboard from '../components/Leaderboard.jsx'
import CloudDash from '../games/CloudDash.jsx'
import BaggageMatch from '../games/BaggageMatch.jsx'
import CandyRush from '../games/CandyRush.jsx'

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
  },
  {
    id: 'candyrush',
    name: 'Candy Rush',
    blurb: 'Swap UO treats to line up 3 or more — cascades pay a combo multiplier.',
    emoji: '🧋',
    tint: '#fdeaf3',
    Component: CandyRush
  }
]

const TABS = [
  { id: 'games', label: 'Games' },
  { id: 'board', label: 'Leaderboard' }
]

export default function PlayScreen() {
  const { state, dispatch, playsLeft, checkedInToday, today, offline } = useStore()
  const toast = useToast()
  const [active, setActive] = useState(null)
  const [tab, setTab] = useState('games')

  const game = GAMES.find((g) => g.id === active)

  const finish = (amount, score = 0) => {
    if (offline) {
      // Play stays free in the air — no coins, no allowance burnt, and no rank
      // posted, since spending a rewarded play for nothing would be worse than
      // blocking it outright.
      toast('No coins or ranking in flight — your plays are saved for landing', '✈️')
      setActive(null)
      return
    }
    dispatch({ type: 'EARN_COINS', amount })
    dispatch({ type: 'RECORD_PLAY', gameId: active })
    dispatch({ type: 'SUBMIT_SCORE', gameId: active, score })
    toast(`+${amount} berry coins earned`, '🪙')
    setActive(null)
  }

  if (game) {
    const G = game.Component
    return (
      <G
        equipped={state.equipped}
        offline={offline}
        gameId={game.id}
        bestScore={state.bestScores[game.id] ?? 0}
        onExit={() => setActive(null)}
        onFinish={finish}
      />
    )
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

      <div className="tabs" style={{ marginTop: 12 }}>
        {TABS.map((t) => (
          <button key={t.id} aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'board' && <Leaderboard />}

      {tab === 'games' && (
        <>
      <div style={{ marginTop: 16 }}>
        {GAMES.map((g) => {
          const left = playsLeft(g.id)
          // Offline the games stay open — they just don't pay.
          const locked = left === 0 && !offline
          return (
            <button
              key={g.id}
              className="game-card"
              onClick={() => setActive(g.id)}
              disabled={locked}
              style={locked ? { opacity: 0.55 } : undefined}
            >
              <div className="game-card__art" style={{ background: g.tint }}>
                {g.emoji}
              </div>
              <div className="game-card__body">
                <div className="game-card__title">{g.name}</div>
                <p className="muted" style={{ marginTop: 2 }}>
                  {g.blurb}
                </p>
                <span className={`chip ${left === 0 || offline ? 'chip--out' : 'chip--gold'}`}>
                  {offline
                    ? '✈️ Free to play · no coins'
                    : left === 0
                      ? 'Back tomorrow'
                      : `${left} rewarded play${left > 1 ? 's' : ''} left`}
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
      )}
    </>
  )
}
