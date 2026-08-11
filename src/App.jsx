import { useEffect, useRef, useState } from 'react'
import { useStore } from './state/store.jsx'
import { Icons } from './components/ui.jsx'
import Berry from './components/Berry.jsx'
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

function Intro({ onStart }) {
  return (
    <div className="intro">
      <span className="intro__badge">HK Express · Concept</span>
      <Berry mood="happy" size={168} equipped={{ outfit: 'tee-basic' }} />
      <h1>Fly with Berry</h1>
      <p>
        Your travel buddy inside the UO app. Check in daily, play, collect stamps from every
        destination — and turn it all into real inflight rewards.
      </p>
      <button className="btn btn--gold btn--lg" onClick={onStart}>
        Meet Berry
      </button>
    </div>
  )
}

function TopBar() {
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
  const { state, dispatch } = useStore()
  const bodyRef = useRef(null)

  const active = TABS.find((t) => t.id === state.screen) ?? TABS[0]
  const Screen = active.Screen

  // Every tab should start at the top, the way a native app behaves.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [state.screen])

  if (!state.seenIntro) {
    return (
      <div className="app">
        <Intro onStart={() => dispatch({ type: 'SEEN_INTRO' })} />
      </div>
    )
  }

  return (
    <div className="app">
      <TopBar />

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

      <DemoPanel />
    </div>
  )
}
