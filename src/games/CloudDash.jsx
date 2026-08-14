import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Berry from '../components/Berry.jsx'
import { Coin } from '../components/ui.jsx'
import { LeaderboardSlice } from '../components/Leaderboard.jsx'

/**
 * Tap-to-fly. Berry falls under gravity, a tap flaps him upward, and he
 * threads gaps between clouds while collecting coins.
 *
 * The simulation lives in a ref and the loop writes a fresh snapshot to state
 * once per frame; Berry's SVG is memoised so only the wrapper transform moves.
 */

const GRAVITY = 0.52
const FLAP = -8.2
const BERRY_SIZE = 46
const BERRY_X = 62
const OBSTACLE_W = 56
const GAP = 168
const SPAWN_EVERY = 1500 // ms
const BASE_SPEED = 2.9
const ROUND_MS = 40000

export default function CloudDash({ equipped, offline, gameId, bestScore = 0, onExit, onFinish }) {
  const fieldRef = useRef(null)
  const [size, setSize] = useState({ w: 360, h: 480 })
  const [phase, setPhase] = useState('ready') // ready | running | over
  const [frame, setFrame] = useState({ y: 200, rot: 0, obstacles: [], coins: [], score: 0, left: ROUND_MS })

  const sim = useRef({
    y: 200,
    vy: 0,
    obstacles: [],
    coins: [],
    score: 0,
    elapsed: 0,
    sinceSpawn: SPAWN_EVERY,
    nextId: 1
  })
  const raf = useRef(0)
  const last = useRef(0)

  const berryEl = useMemo(
    () => <Berry equipped={equipped} mood="excited" size={BERRY_SIZE} animate={false} />,
    [equipped]
  )

  useEffect(() => {
    const measure = () => {
      const el = fieldRef.current
      if (el) setSize({ w: el.clientWidth, h: el.clientHeight })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const reset = useCallback(() => {
    sim.current = {
      y: size.h / 2 - BERRY_SIZE / 2,
      vy: 0,
      obstacles: [],
      coins: [],
      score: 0,
      elapsed: 0,
      sinceSpawn: SPAWN_EVERY,
      nextId: 1
    }
    setFrame({ y: sim.current.y, rot: 0, obstacles: [], coins: [], score: 0, left: ROUND_MS })
  }, [size.h])

  const flap = useCallback(() => {
    if (phase === 'ready') {
      reset()
      setPhase('running')
      sim.current.vy = FLAP
      return
    }
    if (phase === 'running') sim.current.vy = FLAP
  }, [phase, reset])

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        flap()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flap])

  useEffect(() => {
    if (phase !== 'running') return
    last.current = performance.now()

    const step = (now) => {
      const dtMs = Math.min(40, now - last.current)
      last.current = now
      const dt = dtMs / 16.667
      const s = sim.current
      const { w, h } = size

      s.elapsed += dtMs
      const speed = (BASE_SPEED + s.elapsed / 22000) * dt

      s.vy += GRAVITY * dt
      s.y += s.vy * dt

      // spawn
      s.sinceSpawn += dtMs
      if (s.sinceSpawn >= SPAWN_EVERY) {
        s.sinceSpawn = 0
        const margin = 70
        const gapY = margin + GAP / 2 + Math.random() * Math.max(10, h - GAP - margin * 2)
        const id = s.nextId++
        s.obstacles.push({ id, x: w + OBSTACLE_W, gapY })
        s.coins.push({ id: `c${id}`, x: w + OBSTACLE_W + OBSTACLE_W / 2 - 12, y: gapY - 12, taken: false })
      }

      s.obstacles.forEach((o) => (o.x -= speed))
      s.coins.forEach((c) => (c.x -= speed))
      s.obstacles = s.obstacles.filter((o) => o.x > -OBSTACLE_W - 10)
      s.coins = s.coins.filter((c) => c.x > -40 && !c.taken)

      // coin pickup
      const bx = BERRY_X
      const by = s.y
      for (const c of s.coins) {
        if (!c.taken && bx < c.x + 24 && bx + BERRY_SIZE > c.x && by < c.y + 24 && by + BERRY_SIZE > c.y) {
          c.taken = true
          s.score += 1
        }
      }

      // collision
      let dead = s.y < -10 || s.y + BERRY_SIZE > h
      for (const o of s.obstacles) {
        const overlapX = bx + BERRY_SIZE - 8 > o.x && bx + 8 < o.x + OBSTACLE_W
        if (!overlapX) continue
        const inGap = by + 6 > o.gapY - GAP / 2 && by + BERRY_SIZE - 6 < o.gapY + GAP / 2
        if (!inGap) dead = true
      }

      const timeUp = s.elapsed >= ROUND_MS

      setFrame({
        y: s.y,
        rot: Math.max(-26, Math.min(70, s.vy * 5)),
        obstacles: s.obstacles.map((o) => ({ ...o })),
        coins: s.coins.map((c) => ({ ...c })),
        score: s.score,
        left: Math.max(0, ROUND_MS - s.elapsed)
      })

      if (dead || timeUp) {
        setPhase('over')
        return
      }
      raf.current = requestAnimationFrame(step)
    }

    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [phase, size])

  const reward = Math.min(40, 10 + frame.score * 2)

  return (
    <div className="game-shell">
      <div className="game-shell__bar">
        <button onClick={onExit} aria-label="Quit game">
          ← Quit
        </button>
        <span>Cloud Dash</span>
        <span>
          {frame.score} <span style={{ opacity: 0.7 }}>coins</span>
        </span>
      </div>

      <div className="game-shell__body">
        <div
          className="dash-field"
          ref={fieldRef}
          onPointerDown={(e) => {
            e.preventDefault()
            flap()
          }}
        >
          <div className="dash-hud">
            <span>⏱ {Math.ceil(frame.left / 1000)}s</span>
            <span>Best gap: keep tapping!</span>
          </div>

          {frame.obstacles.map((o) => (
            <div key={o.id}>
              <div
                className="dash-obstacle"
                style={{ left: o.x, top: -40, width: OBSTACLE_W, height: o.gapY - GAP / 2 + 40 }}
              />
              <div
                className="dash-obstacle"
                style={{
                  left: o.x,
                  top: o.gapY + GAP / 2,
                  width: OBSTACLE_W,
                  height: Math.max(0, size.h - (o.gapY + GAP / 2)) + 40
                }}
              />
            </div>
          ))}

          {frame.coins.map((c) => (
            <div key={c.id} className="dash-coin" style={{ left: c.x, top: c.y, width: 24, height: 24 }}>
              B
            </div>
          ))}

          <div
            className="dash-berry"
            style={{
              left: BERRY_X,
              top: frame.y,
              transform: `rotate(${frame.rot}deg)`
            }}
          >
            {berryEl}
          </div>

          {phase === 'ready' && (
            <div className="dash-overlay">
              <div className="dash-overlay__card">
                <div style={{ fontSize: 34 }}>☁️</div>
                <h3 style={{ marginTop: 8 }}>Cloud Dash</h3>
                <p className="muted" style={{ marginTop: 8 }}>
                  Tap anywhere to flap. Thread the clouds, grab coins, survive 40 seconds.
                </p>
                <button className="btn btn--primary btn--block" style={{ marginTop: 16 }} onClick={flap}>
                  Tap to start
                </button>
              </div>
            </div>
          )}

          {phase === 'over' && (
            <div className="dash-overlay">
              <div className="dash-overlay__card">
                <div style={{ fontSize: 34 }}>{frame.score >= 5 ? '🎉' : '💫'}</div>
                <h3 style={{ marginTop: 8 }}>
                  {frame.left <= 0 ? 'Round complete!' : 'Berry needs a rest'}
                </h3>
                <p className="muted" style={{ marginTop: 6 }}>
                  {frame.score} coins collected in the air
                </p>
                {offline ? (
                  <p className="tiny" style={{ marginTop: 14 }}>
                    ✈️ No coins or ranking in flight — your rewarded plays are waiting for you when
                    you land.
                  </p>
                ) : (
                  <>
                    <div style={{ marginTop: 14, fontSize: 22, fontWeight: 800 }}>
                      <Coin /> +{reward}
                    </div>
                    <LeaderboardSlice
                      gameId={gameId}
                      score={frame.score}
                      isBest={frame.score > bestScore}
                    />
                  </>
                )}
                <button
                  className="btn btn--gold btn--block"
                  style={{ marginTop: 16 }}
                  onClick={() => onFinish(reward, frame.score)}
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
    </div>
  )
}
