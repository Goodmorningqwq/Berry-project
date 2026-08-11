import { useEffect, useRef, useState } from 'react'
import { MILESTONE_DAYS } from '../state/store.jsx'
import { BASIC_ITEMS_BY_ID, ITEMS_BY_ID } from '../data/items.js'
import Berry from './Berry.jsx'
import { Coin } from './ui.jsx'

/**
 * The daily check-in payoff.
 *
 * Renders straight from the reducer's `lastCheckInResult`, so what's shown is
 * exactly what was awarded. Only transform and opacity are animated, and the
 * coin count is driven by requestAnimationFrame rather than a timer, so the
 * whole thing stays on the compositor.
 */

const COUNT_MS = 900
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

function useCountUp(target, enabled) {
  const [value, setValue] = useState(enabled ? 0 : target)
  const raf = useRef(0)

  useEffect(() => {
    if (!enabled) {
      setValue(target)
      return
    }
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / COUNT_MS)
      setValue(Math.round(easeOut(t) * target))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, enabled])

  return value
}

export default function CheckInReveal({ result, equipped, onCollect }) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const coins = useCountUp(result.coins, !reduced)

  const bonuses = []
  if (result.bonus?.type === 'blindbox') {
    bonuses.push({ key: 'box', emoji: '🎉', title: 'Free blindbox', detail: '7-day streak bonus' })
  }
  if (result.bonus?.type === 'item') {
    const item = BASIC_ITEMS_BY_ID[result.bonus.id]
    if (item) {
      bonuses.push({ key: 'item', emoji: item.emoji, title: item.name, detail: 'A treat for Berry' })
    }
  }
  if (result.milestone) {
    const item = ITEMS_BY_ID[result.milestone]
    bonuses.push({
      key: 'milestone',
      emoji: '👑',
      title: item?.name ?? 'Exclusive unlocked',
      detail: `${MILESTONE_DAYS}-day check-in exclusive`
    })
  }

  return (
    <div className="reveal" onClick={onCollect}>
      <div className="reveal__card checkin-reveal" onClick={(e) => e.stopPropagation()}>
        <div className="reveal__burst" aria-hidden="true" />

        <div className="checkin-reveal__body">
          <span className="checkin-reveal__day">🔥 Day {result.day}</span>

          <div className="checkin-reveal__berry">
            <Berry equipped={equipped} mood="happy" size={124} animate={false} effect="hearts" />
          </div>

          <div className="checkin-reveal__coins">
            <Coin />
            <span>+{coins}</span>
          </div>
          <p className="muted">berry coins</p>

          {bonuses.length > 0 && (
            <div className="checkin-reveal__bonuses">
              {bonuses.map((b, i) => (
                <div
                  className="checkin-reveal__bonus"
                  key={b.key}
                  style={{ animationDelay: `${0.5 + i * 0.18}s` }}
                >
                  <span className="checkin-reveal__bonus-emoji">{b.emoji}</span>
                  <span>
                    <b>{b.title}</b>
                    <span className="tiny">{b.detail}</span>
                  </span>
                </div>
              ))}
            </div>
          )}

          <button className="btn btn--gold btn--block" style={{ marginTop: 18 }} onClick={onCollect}>
            Collect
          </button>
        </div>
      </div>
    </div>
  )
}
