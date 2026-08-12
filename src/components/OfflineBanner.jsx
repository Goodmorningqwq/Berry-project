import { useStore } from '../state/store.jsx'

/**
 * In-flight notice. Berry stays playable with no connection; what stops is the
 * economy — nothing is earned or spent until you land, which is what makes the
 * offline period impossible to farm.
 */
export default function OfflineBanner() {
  const { offline } = useStore()
  if (!offline) return null

  return (
    <div className="offline-banner" role="status">
      <span className="offline-banner__icon" aria-hidden="true">
        ✈️
      </span>
      <span>
        <b>In-flight mode</b>
        <span className="tiny">Play all you like — rewards resume when you land</span>
      </span>
    </div>
  )
}
