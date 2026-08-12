import { useCallback, useEffect, useRef, useState } from 'react'
import { MILESTONE_DAYS } from '../state/store.jsx'
import { CHECK_IN_CALENDAR, rewardForStreak } from '../data/checkin.js'
import { BASIC_ITEMS_BY_ID, ITEMS_BY_ID } from '../data/items.js'
import Berry from './Berry.jsx'
import Celebration from './Celebration.jsx'
import OddsSheet from './OddsSheet.jsx'
import { Coin } from './ui.jsx'

/**
 * The daily check-in payoff, in two beats: what you just earned, then what
 * tomorrow pays.
 *
 * Beat one is staged — anticipate, burst, settle — because the anticipation is
 * where a reward moment actually lands. Tapping anywhere skips to the settled
 * state, so a presenter is never waiting on an animation mid-sentence.
 */

const COUNT_MS = 900
const ANTICIPATE_MS = 480
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

  const [phase, setPhase] = useState(reduced ? 'settled' : 'anticipate')
  const [step, setStep] = useState('reward')
  const [oddsOpen, setOddsOpen] = useState(false)
  const timer = useRef(null)

  const settled = phase === 'settled'
  const coins = useCountUp(result.coins, !reduced && settled)

  useEffect(() => {
    if (reduced) return
    timer.current = setTimeout(() => setPhase('settled'), ANTICIPATE_MS)
    return () => clearTimeout(timer.current)
  }, [reduced])

  useEffect(() => () => clearTimeout(timer.current), [])

  /** Any tap during the build-up jumps straight to the payoff. */
  const skip = useCallback(() => {
    if (phase !== 'settled') {
      clearTimeout(timer.current)
      setPhase('settled')
    }
  }, [phase])

  /* Bigger rewards get a bigger celebration. */
  const intensity = result.milestone
    ? 'epic'
    : result.bonus?.type === 'blindbox' || result.peak
      ? 'bonus'
      : 'normal'

  const bonuses = []
  if (result.bonus?.type === 'blindbox') {
    bonuses.push({ key: 'box', emoji: '🎉', title: 'Free blindbox', detail: 'Your day 7 reward' })
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

  /* ---- what tomorrow pays, straight off the calendar ---- */
  const nextDay = result.day + 1
  const nextReward = rewardForStreak(nextDay)
  const nextTreat = nextReward.treat ? BASIC_ITEMS_BY_ID[nextReward.treat] : null
  const nextIsMilestone = nextDay === MILESTONE_DAYS
  const daysToMilestone = Math.max(0, MILESTONE_DAYS - result.day)
  const milestoneItem = ITEMS_BY_ID['pilot']

  return (
    <div className="reveal" onClick={settled && step === 'tomorrow' ? onCollect : skip}>
      <div
        className={`reveal__card checkin-reveal checkin-reveal--${phase}`}
        onClick={(e) => {
          e.stopPropagation()
          skip()
        }}
      >
        {settled && step === 'reward' && <Celebration intensity={intensity} />}

        <div className="checkin-reveal__steps">
          {/* Step 1 — what you just earned */}
          <div
            className={`checkin-reveal__step ${
              step === 'reward' ? 'checkin-reveal__step--in' : 'checkin-reveal__step--past'
            }`}
            aria-hidden={step !== 'reward'}
          >
            <span className="checkin-reveal__day">🔥 Day {result.day}</span>

            <div className={`checkin-reveal__berry ${settled ? 'checkin-reveal__berry--land' : ''}`}>
              <Berry
                equipped={equipped}
                mood="happy"
                size={112}
                animate={false}
                effect={settled ? 'hearts' : null}
              />
            </div>

            {settled ? (
              <>
                <div className="checkin-reveal__coins">
                  <Coin />
                  <span>+{coins}</span>
                </div>
                <p className="muted">{result.peak ? 'berry coins — the week’s best day!' : 'berry coins'}</p>

                {bonuses.length > 0 && (
                  <div className="checkin-reveal__bonuses">
                    {bonuses.map((b, i) => (
                      <BonusRow key={b.key} {...b} delay={0.45 + i * 0.16} />
                    ))}
                  </div>
                )}

                <button
                  className="btn btn--gold btn--block"
                  style={{ marginTop: 18 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setStep('tomorrow')
                  }}
                >
                  Collect
                </button>
              </>
            ) : (
              <p className="checkin-reveal__teasing">Opening your reward…</p>
            )}
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
                title={`+${nextReward.coins} berry coins`}
                detail={nextReward.peak ? 'The week’s biggest coin day' : 'Guaranteed'}
                delay={0.06}
              />
              {nextReward.blindbox && (
                <BonusRow
                  emoji="🎁"
                  title="Free blindbox"
                  detail="Guaranteed — it’s day 7"
                  delay={0.18}
                />
              )}
              {nextTreat && (
                <BonusRow
                  emoji={nextTreat.emoji}
                  title={nextTreat.name}
                  detail="A treat for Berry — guaranteed"
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

            <button
              className="btn btn--primary btn--block"
              style={{ marginTop: 16 }}
              onClick={(e) => {
                e.stopPropagation()
                onCollect()
              }}
            >
              Done
            </button>
            <button
              className="checkin-reveal__odds"
              onClick={(e) => {
                e.stopPropagation()
                setOddsOpen(true)
              }}
            >
              See the full {CHECK_IN_CALENDAR.length}-day calendar
            </button>
          </div>
        </div>
      </div>

      <OddsSheet open={oddsOpen} onClose={() => setOddsOpen(false)} />
    </div>
  )
}
