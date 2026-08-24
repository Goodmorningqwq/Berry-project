import { useState } from 'react'
import Berry from './Berry.jsx'

/**
 * The HK Express app as the demo's starting point.
 *
 * The screenshot is the screen — rendered at natural aspect so it scrolls like
 * a real page — with live elements drawn on top offering two possible entry
 * points into the extension. Both rects were measured off the source image
 * (942x2048); percentages keep them aligned at any width.
 *
 *   list row   x 36→905, y 1188→1300  (first row of "Get Prepared For Your Trip")
 *   tab bar    full width, y 1859→2048
 */

const PCT = (v, total) => `${(v / total) * 100}%`

const ENTRY_RECT = {
  left: PCT(36, 942),
  width: PCT(869, 942),
  top: PCT(1188, 2048),
  height: PCT(112, 2048)
}

const TABBAR_RECT = {
  top: PCT(1859, 2048),
  height: PCT(2048 - 1859, 2048)
}

const PLACEMENT_KEY = 'flywithberry.entry-placement'

const PLACEMENTS = [
  { id: 'both', label: 'Both' },
  { id: 'row', label: 'List row' },
  { id: 'tab', label: 'Tab bar' }
]

/* Small outline icons in the host app's style, for the replacement tab bar. */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

const TabIcons = {
  home: () => (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10.5V20h12v-9.5" />
    </svg>
  ),
  plane: () => (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M3 13.5 21 6l-3.5 8.5L21 19 3 13.5z" />
    </svg>
  ),
  globe: () => (
    <svg viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17" />
    </svg>
  ),
  person: () => (
    <svg viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4" />
    </svg>
  )
}

const HOST_TABS = [
  { id: 'home', label: 'Home', Icon: TabIcons.home, active: true },
  { id: 'book', label: 'Book Flight', Icon: TabIcons.plane },
  { id: 'berry', label: 'Berry', berry: true },
  { id: 'trips', label: 'My Trips', Icon: TabIcons.globe },
  { id: 'account', label: 'Account', Icon: TabIcons.person }
]

export default function HostScreen({ onOpen }) {
  const [placement, setPlacement] = useState(() => {
    try {
      return localStorage.getItem(PLACEMENT_KEY) || 'both'
    } catch {
      return 'both'
    }
  })

  const choose = (id) => {
    setPlacement(id)
    try {
      localStorage.setItem(PLACEMENT_KEY, id)
    } catch {
      /* private mode — the choice just won't persist */
    }
  }

  const showRow = placement === 'both' || placement === 'row'
  const showTab = placement === 'both' || placement === 'tab'

  return (
    <div className="host">
      <div className="host__page">
        <img className="host__shot" src="/host/uo-home.jpg" alt="HK Express app home screen" />

        {showRow && (
          <button className="host__entry" style={ENTRY_RECT} onClick={onOpen}>
            <span className="host__entry-ring" aria-hidden="true" />
            <span className="host__entry-berry" aria-hidden="true">
              <Berry equipped={{ look: 'everyday' }} mood="happy" size={44} animate={false} />
            </span>
            <span className="host__entry-label">
              Fly with Berry
              <span className="host__entry-new">NEW</span>
            </span>
            <span className="host__entry-chevron" aria-hidden="true">
              ›
            </span>
          </button>
        )}

        {/* A live tab bar drawn over the screenshot's own, so Berry can sit in
            the featured centre slot as a fifth tab. */}
        {showTab && (
          <div className="host__tabbar" style={TABBAR_RECT}>
            {HOST_TABS.map((tab) =>
              tab.berry ? (
                <button key={tab.id} className="host__tab host__tab--berry" onClick={onOpen}>
                  <span className="host__tab-ring" aria-hidden="true" />
                  <span className="host__tab-berry" aria-hidden="true">
                    <Berry equipped={{ look: 'everyday' }} mood="happy" size={40} animate={false} />
                  </span>
                  <span className="host__tab-label">{tab.label}</span>
                </button>
              ) : (
                <div
                  key={tab.id}
                  className={`host__tab ${tab.active ? 'host__tab--active' : ''}`}
                  aria-hidden="true"
                >
                  <tab.Icon />
                  <span className="host__tab-label">{tab.label}</span>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Presenter control — not part of the mocked app. */}
      <div className="host__placement" role="group" aria-label="Berry entry point placement">
        <span className="host__placement-label">Entry point</span>
        {PLACEMENTS.map((p) => (
          <button
            key={p.id}
            className={placement === p.id ? 'is-on' : ''}
            onClick={() => choose(p.id)}
            aria-pressed={placement === p.id}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
