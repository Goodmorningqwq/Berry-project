import { useState } from 'react'
import { useStore } from '../state/store.jsx'
import { BOARDS_BY_ID, GAME_BOARDS, rankBoard, rankSlice } from '../data/leaderboard.js'
import { Modal } from './ui.jsx'

/**
 * Per-game rankings, in two shapes:
 *
 *  - `compact` — the slice around the player, shown on a game's result card
 *  - full      — the whole board with a game selector, on the Play screen
 *
 * Both derive from `rankBoard`, so there's one ranking implementation.
 */

function Rows({ rows, board }) {
  return (
    <div className="lb">
      {rows.map((row) => (
        <div key={row.id} className={`lb__row ${row.isPlayer ? 'lb__row--you' : ''}`}>
          <span className="lb__rank">{row.rank}</span>
          <span className="lb__name">
            {row.name}
            {row.isPlayer && <span className="lb__you">YOU</span>}
          </span>
          <span className="lb__score">{board.format(row.score)}</span>
        </div>
      ))}
    </div>
  )
}

/** The strip shown straight after a round. */
export function LeaderboardSlice({ gameId, score, isBest }) {
  const { state } = useStore()
  const board = BOARDS_BY_ID[gameId]
  if (!board) return null

  // Rank this round's score, not the stored best — the card is about what just
  // happened.
  const rows = rankBoard(gameId, state.guest.name, Math.max(score, state.bestScores[gameId] ?? 0))
  const me = rows.find((r) => r.isPlayer)

  return (
    <div className="lb-slice">
      <div className="lb-slice__head">
        <span>
          Rank <b>#{me.rank}</b> of {rows.length}
        </span>
        {isBest && <span className="chip chip--gold">New personal best</span>}
      </div>
      <Rows rows={rankSlice(rows, 2)} board={board} />
    </div>
  )
}

/** The full board, with its own game selector. */
export default function Leaderboard() {
  const { state, dispatch } = useStore()
  const [gameId, setGameId] = useState(GAME_BOARDS[0].id)
  const [renaming, setRenaming] = useState(false)
  const [draft, setDraft] = useState(state.guest.name)

  const board = BOARDS_BY_ID[gameId]
  const rows = rankBoard(gameId, state.guest.name, state.bestScores[gameId] ?? 0)
  const me = rows.find((r) => r.isPlayer)

  const save = () => {
    dispatch({ type: 'RENAME_GUEST', name: draft })
    setRenaming(false)
  }

  return (
    <>
      <div className="tabs" style={{ marginTop: 12 }}>
        {GAME_BOARDS.map((g) => (
          <button key={g.id} aria-selected={gameId === g.id} onClick={() => setGameId(g.id)}>
            {g.emoji} {g.name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="lb-me">
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>
              You’re #{me.rank} in {board.name}
            </div>
            <p className="tiny">
              Playing as <b>{state.guest.name}</b> ·{' '}
              {state.bestScores[gameId] ? board.format(state.bestScores[gameId]) : 'no score yet'}
            </p>
          </div>
          <button
            className="btn btn--ghost"
            onClick={() => {
              setDraft(state.guest.name)
              setRenaming(true)
            }}
          >
            Rename
          </button>
        </div>
      </div>

      <Rows rows={rows} board={board} />

      <p className="tiny" style={{ marginTop: 12, textAlign: 'center' }}>
        Sample players shown for the demo — in the real app this board is live across everyone flying
        with Berry.
      </p>

      <Modal open={renaming} onClose={() => setRenaming(false)} label="Change your name">
        <h3 style={{ fontSize: 17 }}>Change your name</h3>
        <p className="muted" style={{ marginTop: 4 }}>
          This is the name shown on the leaderboards.
        </p>
        <input
          className="lb-input"
          value={draft}
          maxLength={20}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          aria-label="Your display name"
        />
        <button className="btn btn--primary btn--block" style={{ marginTop: 12 }} onClick={save}>
          Save
        </button>
        <button
          className="btn btn--ghost btn--block"
          style={{ marginTop: 8 }}
          onClick={() => setRenaming(false)}
        >
          Cancel
        </button>
      </Modal>
    </>
  )
}
