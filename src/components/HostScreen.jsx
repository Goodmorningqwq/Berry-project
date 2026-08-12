import Berry from './Berry.jsx'

/**
 * The HK Express app as the demo's starting point.
 *
 * The screenshot is the screen — rendered at natural aspect so it scrolls like
 * a real page — with one live element drawn on top: a "Fly with Berry" row
 * styled like the host app's own list rows, sitting at the head of "Get
 * Prepared For Your Trip".
 *
 * The rect below was measured off the source image (942x2048): the list rows
 * run x 36→905 and the first row spans y 1188→1300. Percentages keep it
 * aligned at any width.
 */

const ENTRY_RECT = {
  left: `${(36 / 942) * 100}%`,
  width: `${(869 / 942) * 100}%`,
  top: `${(1188 / 2048) * 100}%`,
  height: `${(112 / 2048) * 100}%`
}

/** Just under the entry row, so the hint points at the thing to tap. */
const HINT_TOP = `${((1188 + 112 + 14) / 2048) * 100}%`

export default function HostScreen({ onOpen }) {
  return (
    <div className="host">
      <div className="host__page">
        <img className="host__shot" src="/host/uo-home.jpg" alt="HK Express app home screen" />

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

        <p className="host__hint" style={{ top: HINT_TOP }}>
          Tap to open the extension
        </p>
      </div>
    </div>
  )
}
