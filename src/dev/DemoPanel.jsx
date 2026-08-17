import { useState } from 'react'
import { useStore, MILESTONE_DAYS, prettyDate, STORAGE_KEY } from '../state/store.jsx'
import { useToast } from '../components/Toast.jsx'
import { Modal } from '../components/ui.jsx'
import { BY_COUNTRY, DESTINATIONS_BY_CODE } from '../data/destinations.js'

/**
 * Presenter controls. Nothing here exists in the real product — it's the
 * shortcut set that makes a 30-day habit loop demoable in five minutes.
 */
export default function DemoPanel() {
  const { state, dispatch, today, checkedInToday, offline } = useStore()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [flying, setFlying] = useState(false)

  const advance = (days) => {
    dispatch({ type: 'ADVANCE_DAY', days })
    toast(`Jumped forward ${days} day${days > 1 ? 's' : ''}`, '⏩')
  }

  const primeMilestone = () => {
    dispatch({ type: 'DEMO_SET_STREAK', days: MILESTONE_DAYS - 1 })
    dispatch({ type: 'NAVIGATE', screen: 'home' })
    setOpen(false)
    toast(`Streak set to ${MILESTONE_DAYS - 1} — check in to unlock the exclusive`, '🔥')
  }

  const grant = (amount) => {
    dispatch({ type: 'DEMO_GRANT_COINS', amount })
    toast(`+${amount} berry coins granted`, '🪙')
  }

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    dispatch({ type: 'RESET' })
    setOpen(false)
    toast('Demo reset to first run', '↺')
  }

  const fly = (code) => {
    dispatch({ type: 'COMPLETE_FLIGHT', code })
    const dest = DESTINATIONS_BY_CODE[code]
    setFlying(false)
    setOpen(false)
    dispatch({ type: 'NAVIGATE', screen: 'collect' })
    toast(`Landed in ${dest.city}`, '🛬')
  }

  return (
    <>
      <button
        className="demo-fab"
        onClick={() => setOpen(true)}
        aria-label="Presenter controls"
        title="Presenter controls"
      >
        ⚙
      </button>

      <Modal open={open} onClose={() => setOpen(false)} label="Presenter controls">
        <div className="demo-panel">
          <h3 style={{ fontSize: 17 }}>Presenter controls</h3>
          <p className="muted" style={{ marginTop: 4 }}>
            Demo-only shortcuts. None of this ships in the real app.
          </p>

          <div className="demo-panel__grid">
            <button className="demo-btn" onClick={() => advance(1)}>
              ⏭ Next day
              <small>Re-arms check-in and game plays</small>
            </button>
            <button className="demo-btn" onClick={() => advance(7)}>
              ⏩ Skip a week
              <small>Breaks the streak — shows the reset</small>
            </button>
            <button className="demo-btn" onClick={primeMilestone}>
              🔥 Day {MILESTONE_DAYS - 1} streak
              <small>Check in to land the 30-day reward</small>
            </button>
            <button className="demo-btn" onClick={() => setFlying((f) => !f)}>
              🛬 Simulate flight
              <small>Stamp + destination exclusive</small>
            </button>
            <button
              className={`demo-btn ${offline ? 'demo-btn--on' : ''}`}
              onClick={() => {
                dispatch({ type: 'TOGGLE_OFFLINE' })
                // Coming back online is announced by App's own reconnect toast.
                if (!offline) toast('In-flight mode on', '✈️')
              }}
            >
              ✈️ In-flight mode: {offline ? 'ON' : 'off'}
              <small>Play keeps working, earning stops</small>
            </button>
            <button className="demo-btn" onClick={() => grant(15000)}>
              🪙 Grant 15,000 coins
              <small>HK$150 — reaches the top redemption tier</small>
            </button>
            <button
              className="demo-btn"
              onClick={() => {
                dispatch({ type: 'DEMO_GRANT_ITEMS' })
                toast('Treats added to Berry’s stash', '🍪')
              }}
            >
              🍪 Give treats
              <small>So Feed Berry can be shown on cue</small>
            </button>
            <button className="demo-btn demo-btn--danger" onClick={reset}>
              ↺ Reset demo
              <small>Back to a clean first run</small>
            </button>
          </div>

          {flying && (
            <div className="picker-scroll">
              {BY_COUNTRY.map((country) => (
                <div key={country.id}>
                  <p className="picker-group">
                    {country.flag} {country.id}
                  </p>
                  <div className="destination-picker">
                    {country.cities.map((d) => (
                      <button key={d.code} onClick={() => fly(d.code)}>
                        <span style={{ fontSize: 18 }}>{d.emoji}</span>
                        <span>
                          {d.city}
                          <br />
                          <span className="tiny">
                            {state.stamps.includes(d.code) ? 'Stamped' : d.code}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="demo-panel__state">
            <div>
              Today <b>{prettyDate(today)}</b>
            </div>
            <div>
              Day offset <b>+{state.dayOffset}</b>
            </div>
            <div>
              Streak <b>{state.streak}</b> (best {state.bestStreak})
            </div>
            <div>
              Checked in <b>{checkedInToday ? 'yes' : 'no'}</b>
            </div>
            <div>
              Coins <b>{state.coins}</b>
            </div>
            <div>
              Lifetime <b>{state.lifetimeCoins}</b>
            </div>
            <div>
              Stamps <b>{state.stamps.length}</b>
            </div>
            <div>
              Cosmetics <b>{state.ownedItems.length}</b>
            </div>
          </div>

          <button className="btn btn--ghost btn--block" style={{ marginTop: 12 }} onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      </Modal>
    </>
  )
}
