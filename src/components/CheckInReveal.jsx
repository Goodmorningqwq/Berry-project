import { useEffect, useRef, useState } from 'react'
import {
  BLINDBOX_STREAK_DAY,
  CHECK_IN_COINS,
  MILESTONE_DAYS,
  TREAT_CHANCE
} from '../state/store.jsx'
import { BASIC_ITEMS_BY_ID, ITEMS_BY_ID } from '../data/items.js'
import Berry from './Berry.jsx'
import OddsSheet from './OddsSheet.jsx'
import { Coin } from './ui.jsx'

/**
 * The daily check-in payoff, in two beats: what you just earned, then what
 * tomorrow pays.
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
  const settle = useRef(0)

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

    // rAF stops in a backgrounded tab, which would strand the counter partway.
    // Timers keep running, so this guarantees it always lands on the real total.
    settle.current = setTimeout(() => setValue(target), COUNT_MS + 150)

    return () => {
      cancelAnimationFrame(raf.current)
      clearTimeout(settle.current)
    }
  }, [target, enabled])

  return value
}

function BonusRow({ emoji, title, detail, delay }) {
  return (
    <div className="checkin-reveal__bonus" style={{ animationDelay: `${delay}s` }}>
      <span className="checkin-reveal__bonus-emoji">{emoji}</span>
      <span>
        <b>{title}</b>
        <span className="tiny">{detail}</span>
      </span>
    </div>
  )
}

export default function CheckInReveal({ result, equipped, onCollect }) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const [step, setStep] = useState('reward')
  const [oddsOpen, setOddsOpen] = useState(false)
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

  /* ---- what tomorrow pays ---- */
  const nextDay = result.day + 1
  const nextIsBlindbox = nextDay % BLINDBOX_STREAK_DAY === 0
  const nextIsMilestone = nextDay === MILESTONE_DAYS
  const daysToMilestone = Math.max(0, MILESTONE_DAYS - result.day)
  const milestoneItem = ITEMS_BY_ID['pilot']

  return (
    <div className="reveal" onClick={step === 'tomorrow' ? onCollect : undefined}>
      <div className="reveal__card checkin-reveal" onClick={(e) => e.stopPropagation()}>
        <div className="reveal__burst" aria-hidden="true" />

        <div className="checkin-reveal__steps">
          {/* Step 1 — what you just earned */}
          <div
            className={`checkin-reveal__step ${
              step === 'reward' ? 'checkin-reveal__step--in' : 'checkin-reveal__step--past'
            }`}
            aria-hidden={step !== 'reward'}
          >
            <span className="checkin-reveal__day">🔥 Day {result.day}</span>

            <div className="checkin-reveal__berry">
              <Berry equipped={equipped} mood="happy" size={112} animate={false} effect="hearts" />
            </div>

            <div className="checkin-reveal__coins">
              <Coin />
              <span>+{coins}</span>
            </div>
            <p className="muted">berry coins</p>

            {bonuses.length > 0 && (
              <div className="checkin-reveal__bonuses">
                {bonuses.map((b, i) => (
                  <BonusRow key={b.key} {...b} delay={0.5 + i * 0.18} />
                ))}
              </div>
            )}

            <button
              className="btn btn--gold btn--block"
              style={{ marginTop: 18 }}
              onClick={() => setStep('tomorrow')}
            >
              Collect
            </button>
          </div>

          {/* Step 2 — what's waiting tomorrow */}
          <div
            className={`checkin-reveal__step ${
              step === 'tomorrow' ? 'checkin-reveal__step--in' : 'checkin-reveal__step--next'
            }`}
            aria-hidden={step !== 'tomorrow'}
          >
            <span className="checkin-reveal__day">🔥 Day {nextDay} tomorrow</span>

            <h3 className="checkin-reveal__title">Check in tomorrow!</h3>
            <p className="muted" style={{ marginTop: 4 }}>
              {nextIsMilestone
                ? 'One more day and the exclusive is yours.'
                : 'Berry will be waiting. Here’s what’s in it for you.'}
            </p>

            <div className="checkin-reveal__bonuses">
              <BonusRow
                emoji="🪙"
                title={`+${CHECK_IN_COINS} berry coins`}
                detail="Guaranteed, every day"
                delay={0.06}
              />
              {nextIsBlindbox ? (
                <BonusRow
                  emoji="🎁"
                  title="Free blindbox"
                  detail="Guaranteed — it’s a 7-day streak day"
                  delay={0.18}
                />
              ) : (
                <BonusRow
                  emoji="🍪"
                  title="A treat for Berry"
                  detail={`${Math.round(TREAT_CHANCE * 100)}% chance`}
                  delay={0.18}
                />
              )}
              {nextIsMilestone && (
                <BonusRow
                  emoji="👑"
                  title={milestoneItem?.name ?? 'Exclusive look'}
                  detail={`${MILESTONE_DAYS}-day check-in exclusive`}
                  delay={0.3}
                />
              )}
            </div>

            {daysToMilestone > 0 && (
              <p className="tiny" style={{ marginTop: 12 }}>
                {daysToMilestone} more {daysToMilestone === 1 ? 'day' : 'days'} in a row unlocks{' '}
                <b>{milestoneItem?.name ?? 'the exclusive look'}</b>
              </p>
            )}

            <button className="btn btn--primary btn--block" style={{ marginTop: 16 }} onClick={onCollect}>
              Done
            </button>
            <button className="checkin-reveal__odds" onClick={() => setOddsOpen(true)}>
              View odds
            </button>
          </div>
        </div>
      </div>

      <OddsSheet open={oddsOpen} onClose={() => setOddsOpen(false)} />
    </div>
  )
}
