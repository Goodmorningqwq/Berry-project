import { useEffect, useRef, useState } from 'react'
import { useStore } from './state/store.jsx'
import { Icons } from './components/ui.jsx'
import HostScreen from './components/HostScreen.jsx'
import OfflineBanner from './components/OfflineBanner.jsx'
import { useToast } from './components/Toast.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import PlayScreen from './screens/PlayScreen.jsx'
import CollectScreen from './screens/CollectScreen.jsx'
import ShopScreen from './screens/ShopScreen.jsx'
import TripsScreen from './screens/TripsScreen.jsx'
import DemoPanel from './dev/DemoPanel.jsx'

const TABS = [
  { id: 'home', label: 'Berry', Icon: Icons.home, Screen: HomeScreen },
  { id: 'play', label: 'Play', Icon: Icons.play, Screen: PlayScreen },
  { id: 'collect', label: 'Collection', Icon: Icons.collect, Screen: CollectScreen },
  { id: 'shop', label: 'Rewards', Icon: Icons.shop, Screen: ShopScreen },
  { id: 'trips', label: 'Trips', Icon: Icons.trips, Screen: TripsScreen }
]

function TopBar({ onBack }) {
  const { state, checkedInToday } = useStore()
  const [bump, setBump] = useState(false)
  const prevCoins = useRef(state.coins)

  useEffect(() => {
    if (state.coins !== prevCoins.current) {
      prevCoins.current = state.coins
      setBump(true)
      const t = setTimeout(() => setBump(false), 500)
      return () => clearTimeout(t)
    }
  }, [state.coins])

  return (
    <header className="topbar">
      <div className="topbar__row">
        <div className="topbar__brand">
          <button className="topbar__back" onClick={onBack} aria-label="Back to HK Express">
            ‹
          </button>
          Fly with Berry <span className="tag">UO</span>
        </div>
        <div className="topbar__stats">
          <span className={`pill pill--flame ${checkedInToday ? '' : 'pill--dim'}`}>
            🔥 {state.streak}
          </span>
          <span className={`pill pill--coin ${bump ? 'coin-bump' : ''}`}>
            <span className="coin-icon">B</span>
            {state.coins.toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  )
}

export default function App() {
  const { state, dispatch, offline } = useStore()
  const toast = useToast()
  const bodyRef = useRef(null)
  const wasOffline = useRef(offline)
  // 'in' while the extension pushes over the host app, 'out' while it leaves.
  const [pushPhase, setPushPhase] = useState(null)
  const pushTimer = useRef(null)

  const active = TABS.find((t) => t.id === state.screen) ?? TABS[0]
  const Screen = active.Screen

  // Every tab should start at the top, the way a native app behaves.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [state.screen])

  useEffect(() => () => clearTimeout(pushTimer.current), [])

  // Real connectivity is pushed into the store so the reducer's offline gate
  // stays pure — pulling wifi behaves exactly like the presenter's toggle.
  useEffect(() => {
    const sync = () => dispatch({ type: 'SET_NETWORK', online: navigator.onLine })
    sync()
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return () => {
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }, [dispatch])

  useEffect(() => {
    if (wasOffline.current && !offline) toast('Back online — rewards are available again', '📶')
    wasOffline.current = offline
  }, [offline, toast])

  const openBerry = () => {
    setPushPhase('in')
    dispatch({ type: 'SEEN_INTRO' })
    clearTimeout(pushTimer.current)
    pushTimer.current = setTimeout(() => setPushPhase(null), 420)
  }

  const backToHost = () => {
    setPushPhase('out')
    clearTimeout(pushTimer.current)
    // Let the slide finish before the host screen takes over.
    pushTimer.current = setTimeout(() => {
      dispatch({ type: 'GO_HOST' })
      setPushPhase(null)
    }, 300)
  }

  if (!state.seenIntro) {
    return (
      <div className="app">
        <HostScreen onOpen={openBerry} />
      </div>
    )
  }

  return (
    <div className="app">
      {/* The host screen stays behind for the length of the transition, so the
          extension reads as pushing in over the app rather than replacing it. */}
      {pushPhase && (
        <div className="app__host-under" aria-hidden="true">
          <HostScreen onOpen={() => {}} />
        </div>
      )}

      <div className={`app__shell ${pushPhase ? `app__shell--${pushPhase}` : ''}`}>
        <TopBar onBack={backToHost} />
        <OfflineBanner />

        <main className="app__body" ref={bodyRef}>
          <div className="fade-in" key={active.id}>
            <Screen />
          </div>
        </main>

        <nav className="nav">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`nav__item ${state.screen === id ? 'nav__item--active' : ''}`}
              onClick={() => dispatch({ type: 'NAVIGATE', screen: id })}
              aria-current={state.screen === id ? 'page' : undefined}
            >
              <Icon />
              {label}
              {id === 'shop' && state.blindboxTickets > 0 && (
                <span className="nav__badge">{state.blindboxTickets}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <DemoPanel />
    </div>
  )
}
