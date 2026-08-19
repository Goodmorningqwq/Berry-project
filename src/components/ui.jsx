import { useEffect } from 'react'
import Berry from './Berry.jsx'

/** Bottom-sheet modal. Closes on backdrop click and Escape. */
export function Modal({ open, onClose, children, label }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal" data-demo="modal-close" onClick={onClose} role="dialog" aria-modal="true" aria-label={label}>
      <div className="modal__sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal__grip" />
        {children}
      </div>
    </div>
  )
}

/**
 * A room theme has no prop art to hang on Berry, so it previews as the room
 * itself — wall over floor, with the window's sky. Reuses the same `room--<id>`
 * custom properties the real room does, so a swatch can never drift from what
 * equipping it actually looks like.
 */
export function RoomSwatch({ id, locked, size }) {
  return (
    <div
      className={`room-swatch room--${id} ${locked ? 'room-swatch--locked' : ''}`}
      style={size ? { width: size, height: Math.round(size * 0.8) } : undefined}
    >
      <span className="room-swatch__sky" />
    </div>
  )
}

export function Coin({ small }) {
  return <span className={`coin-icon ${small ? 'coin-icon--sm' : ''}`}>B</span>
}

export function CoinAmount({ value, small }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 800 }}>
      <Coin small={small} />
      {value.toLocaleString()}
    </span>
  )
}

export function ProgressBar({ current, target }) {
  const pct = Math.min(100, Math.round((current / target) * 100))
  return (
    <div className="bar">
      <span style={{ width: `${pct}%` }} />
    </div>
  )
}

/**
 * Empty states lead with Berry rather than an icon — a mascot has to live in
 * the interface to read as part of it.
 */
export function Empty({ emoji, title, hint, mood = 'sleepy' }) {
  return (
    <div className="empty">
      <Berry equipped={{ look: 'everyday' }} mood={mood} size={96} animate={false} />
      {emoji && <span className="empty__emoji empty__emoji--badge">{emoji}</span>}
      <b style={{ display: 'block', marginTop: 4 }}>{title}</b>
      {hint && <p style={{ marginTop: 6 }}>{hint}</p>}
    </div>
  )
}

/* ---------------- nav icons ---------------- */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

export const Icons = {
  home: () => (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10.5V20h12v-9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  ),
  play: () => (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="2.5" y="7" width="19" height="11" rx="4.5" />
      <path d="M7 10.5v4M5 12.5h4M15.5 11.5h.01M18 14h.01" />
    </svg>
  ),
  collect: () => (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M5 3.5h11a3 3 0 0 1 3 3V21H8a3 3 0 0 1-3-3z" />
      <path d="M5 17.5h14" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
  shop: () => (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M4 8h16l-1 12H5z" />
      <path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2" />
      <path d="M4 12h16" />
    </svg>
  ),
  trips: () => (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M3 13.5 21 6l-3.5 8.5L21 19 3 13.5z" />
    </svg>
  )
}
