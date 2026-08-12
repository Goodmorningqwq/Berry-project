import { useCallback, useEffect, useRef, useState } from 'react'
import { Coin } from '../components/ui.jsx'

/**
 * Candy Rush — a UO-themed match-3.
 *
 * Input is tap-to-select then tap-an-adjacent-tile. Dragging is unreliable on
 * touch and hopeless when someone is demoing on a projector, so tap-tap is the
 * primary interaction; a drag gesture is accepted as a shortcut.
 *
 * The board runs on a move budget rather than a clock, so a presenter is never
 * fighting a timer mid-sentence.
 */

const SIZE = 7
const TILES = ['✈️', '🧳', '🎫', '☕', '🍪', '🧋']
const MOVES = 20
const BASE_POINTS = 10

const idx = (r, c) => r * SIZE + c
const rowOf = (i) => Math.floor(i / SIZE)
const colOf = (i) => i % SIZE
const adjacent = (a, b) =>
  Math.abs(rowOf(a) - rowOf(b)) + Math.abs(colOf(a) - colOf(b)) === 1

const randomTile = () => TILES[Math.floor(Math.random() * TILES.length)]

/** Indices belonging to any horizontal or vertical run of 3+. */
function findMatches(grid) {
  const hits = new Set()

  for (let r = 0; r < SIZE; r++) {
    let run = 1
    for (let c = 1; c <= SIZE; c++) {
      const same = c < SIZE && grid[idx(r, c)] && grid[idx(r, c)] === grid[idx(r, c - 1)]
      if (same) {
        run++
      } else {
        if (run >= 3) for (let k = c - run; k < c; k++) hits.add(idx(r, k))
        run = 1
      }
    }
  }

  for (let c = 0; c < SIZE; c++) {
    let run = 1
    for (let r = 1; r <= SIZE; r++) {
      const same = r < SIZE && grid[idx(r, c)] && grid[idx(r, c)] === grid[idx(r - 1, c)]
      if (same) {
        run++
      } else {
        if (run >= 3) for (let k = r - run; k < r; k++) hits.add(idx(k, c))
        run = 1
      }
    }
  }

  return hits
}

/** Gravity, then refill the gaps from the top. */
function collapse(grid) {
  const next = [...grid]
  for (let c = 0; c < SIZE; c++) {
    let write = SIZE - 1
    for (let r = SIZE - 1; r >= 0; r--) {
      const v = next[idx(r, c)]
      if (v) {
        next[idx(write, c)] = v
        write--
      }
    }
    for (let r = write; r >= 0; r--) next[idx(r, c)] = randomTile()
  }
  return next
}

const swapped = (grid, a, b) => {
  const next = [...grid]
  ;[next[a], next[b]] = [next[b], next[a]]
  return next
}

/** Is there any swap left that would score? Otherwise the board is dead. */
function hasLegalMove(grid) {
  for (let i = 0; i < grid.length; i++) {
    const right = colOf(i) < SIZE - 1 ? i + 1 : null
    const down = rowOf(i) < SIZE - 1 ? i + SIZE : null
    for (const j of [right, down]) {
      if (j === null) continue
      if (findMatches(swapped(grid, i, j)).size > 0) return true
    }
  }
  return false
}

/** A starting board with nothing already matched and at least one move on it. */
function freshGrid() {
  for (let attempt = 0; attempt < 60; attempt++) {
    let grid = Array.from({ length: SIZE * SIZE }, randomTile)
    let guard = 0
    while (findMatches(grid).size > 0 && guard++ < 40) {
      findMatches(grid).forEach((i) => {
        grid[i] = randomTile()
      })
    }
    if (findMatches(grid).size === 0 && hasLegalMove(grid)) return grid
  }
  return Array.from({ length: SIZE * SIZE }, randomTile)
}

export default function CandyRush({ offline, onExit, onFinish }) {
  const [grid, setGrid] = useState(freshGrid)
  const [selected, setSelected] = useState(null)
  const [clearing, setClearing] = useState(() => new Set())
  const [moves, setMoves] = useState(MOVES)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [shake, setShake] = useState(null)
  const [phase, setPhase] = useState('ready') // ready | playing | over

  const lockRef = useRef(false)
  const timers = useRef([])
  // The resolve chain runs inside timeouts, so it needs the live move count
  // rather than the value captured when the swap started.
  const movesRef = useRef(MOVES)

  const later = useCallback((fn, ms) => {
    const t = setTimeout(fn, ms)
    timers.current.push(t)
    return t
  }, [])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  useEffect(() => {
    movesRef.current = moves
  }, [moves])

  /** Clear → collapse → look again, paying a rising multiplier per cascade. */
  const resolve = useCallback(
    (startGrid, chain = 0) => {
      const matches = findMatches(startGrid)

      if (matches.size === 0) {
        setCombo(0)
        let board = startGrid
        if (!hasLegalMove(board)) {
          board = freshGrid()
          setGrid(board)
        }
        lockRef.current = false
        // End the round here, once the cascade has fully settled — the last
        // move's chain should finish paying out before the score is final.
        if (movesRef.current <= 0) setPhase('over')
        return
      }

      const multiplier = chain + 1
      setCombo(multiplier)
      setScore((s) => s + matches.size * BASE_POINTS * multiplier)
      setClearing(matches)

      later(() => {
        const emptied = [...startGrid]
        matches.forEach((i) => {
          emptied[i] = null
        })
        const next = collapse(emptied)
        setClearing(new Set())
        setGrid(next)
        later(() => resolve(next, chain + 1), 190)
      }, 240)
    },
    [later]
  )

  const attemptSwap = useCallback(
    (a, b) => {
      if (lockRef.current || phase !== 'playing' || movesRef.current <= 0) return
      const candidate = swapped(grid, a, b)

      if (findMatches(candidate).size === 0) {
        // Illegal swaps bounce back and cost nothing.
        setShake(a)
        later(() => setShake(null), 320)
        setSelected(null)
        return
      }

      lockRef.current = true
      setSelected(null)
      movesRef.current -= 1
      setMoves((m) => m - 1)
      setGrid(candidate)
      later(() => resolve(candidate, 0), 160)
    },
    [grid, phase, later, resolve]
  )

  const tap = (i) => {
    if (lockRef.current || phase !== 'playing') return
    if (selected === null) {
      setSelected(i)
      return
    }
    if (selected === i) {
      setSelected(null)
      return
    }
    if (adjacent(selected, i)) attemptSwap(selected, i)
    else setSelected(i)
  }

  const start = () => {
    setGrid(freshGrid())
    setSelected(null)
    setClearing(new Set())
    setMoves(MOVES)
    movesRef.current = MOVES
    setScore(0)
    setCombo(0)
    lockRef.current = false
    setPhase('playing')
  }

  const reward = Math.min(40, 10 + Math.floor(score / 120))

  return (
    <div className="game-shell">
      <div className="game-shell__bar">
        <button onClick={onExit} aria-label="Quit game">
          ← Quit
        </button>
        <span>Candy Rush</span>
        <span>{score}</span>
      </div>

      <div className="game-shell__body" style={{ overflowY: 'auto' }}>
        <div className="rush-hud">
          <span>
            <b>{moves}</b> moves left
          </span>
        </div>

        <div className="rush-board">
          {/* Keyed on the multiplier so each cascade remounts it and the pop
              replays. pointer-events:none in CSS — it must never eat a tap. */}
          {combo > 1 && (
            <div
              className={`rush-combo ${combo >= 4 ? 'rush-combo--hot' : ''}`}
              key={combo}
              style={{ '--combo': combo }}
              aria-hidden="true"
            >
              <span className="rush-combo__label">Combo</span>
              <span className="rush-combo__x">×{combo}</span>
            </div>
          )}

          <div className="rush-grid">
            {grid.map((tile, i) => (
              <button
                key={i}
                className={`rush-tile ${selected === i ? 'rush-tile--on' : ''} ${
                  clearing.has(i) ? 'rush-tile--pop' : ''
                } ${shake === i ? 'rush-tile--nope' : ''}`}
                onPointerDown={(e) => {
                  e.preventDefault()
                  tap(i)
                }}
                onPointerEnter={(e) => {
                  // Drag shortcut: holding down and moving onto a neighbour swaps.
                  if (e.buttons === 1 && selected !== null && adjacent(selected, i))
                    attemptSwap(selected, i)
                }}
                aria-label={`Tile ${tile}`}
              >
                {tile}
              </button>
            ))}
          </div>
        </div>

        <p className="tiny" style={{ textAlign: 'center', padding: '0 24px 20px' }}>
          Tap a tile, then tap a neighbour to swap. Line up 3 or more — chain reactions pay a
          multiplier.
        </p>

        {phase === 'ready' && (
          <div className="dash-overlay">
            <div className="dash-overlay__card">
              <div style={{ fontSize: 34 }}>🧋</div>
              <h3 style={{ marginTop: 8 }}>Candy Rush</h3>
              <p className="muted" style={{ marginTop: 8 }}>
                Swap tiles to line up 3 or more UO treats. You get {MOVES} moves — cascades pay a
                rising combo multiplier.
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
              <div style={{ fontSize: 34 }}>{score >= 600 ? '🎉' : '🍬'}</div>
              <h3 style={{ marginTop: 8 }}>Out of moves</h3>
              <p className="muted" style={{ marginTop: 6 }}>
                {score.toLocaleString()} points
              </p>
              {offline ? (
                <p className="tiny" style={{ marginTop: 14 }}>
                  ✈️ No coins in flight — your rewarded plays are waiting for you when you land.
                </p>
              ) : (
                <div style={{ marginTop: 14, fontSize: 22, fontWeight: 800 }}>
                  <Coin /> +{reward}
                </div>
              )}
              <button
                className="btn btn--gold btn--block"
                style={{ marginTop: 16 }}
                onClick={() => onFinish(reward)}
              >
                {offline ? 'Done' : 'Collect'}
              </button>
              <button className="btn btn--ghost btn--block" style={{ marginTop: 8 }} onClick={onExit}>
                Leave without collecting
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
