import { Modal } from './ui.jsx'

/**
 * The "what's new" sheet, shown once after an update.
 *
 * Which releases to show is decided in App — this only renders what it's
 * handed, so it can also be opened on demand from the presenter panel with the
 * full list.
 */
export default function PatchNotes({ open, releases, onClose }) {
  if (!releases?.length) return null
  const multiple = releases.length > 1

  return (
    <Modal open={open} onClose={onClose} label="What's new in Fly with Berry">
      <h3 style={{ fontSize: 17 }}>What's new</h3>
      <p className="muted" style={{ marginTop: 4 }}>
        {multiple
          ? `${releases.length} updates since you were last here.`
          : 'Berry has been busy since your last visit.'}
      </p>

      {releases.map((r) => (
        <div key={r.id} className="patch-note">
          <div className="patch-note__head">
            <b>{r.title}</b>
            <span className="tiny">v{r.id}</span>
          </div>
          <ul className="patch-note__list">
            {r.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      ))}

      <button className="btn btn--primary btn--block" style={{ marginTop: 14 }} onClick={onClose}>
        Got it
      </button>
    </Modal>
  )
}
