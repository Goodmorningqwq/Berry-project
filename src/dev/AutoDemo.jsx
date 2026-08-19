import { useCallback, useEffect, useRef, useState } from 'react'
import { useStore } from '../state/store.jsx'
import { CLIPS_BY_ID } from './demoScript.js'

/**
 * Runs a demo clip so the app drives itself while someone records the screen.
 *
 * Nothing of this component is visible during a clip except the tap ripple —
 * no status chip, no progress bar — because anything else would land in the
 * capture. `body.demo-recording` also hides the presenter FAB for the duration.
 *
 * If a step cannot resolve its target the clip **aborts and says so on screen**.
 * The person recording is watching OBS, not the console, and a runner that
 * silently skipped a step would hand them a take that looked fine to the script
 * and was useless on video.
 *
 * Triggered by a `berry:run-clip` window event, the same way the presenter panel
 * reopens the release notes. Esc aborts.
 */

const RIPPLE_MS = 620

export default function AutoDemo() {
  const { dispatch } = useStore()
  const [ripples, setRipples] = useState([])
  const [error, setError] = useState(null)
  const cancelled = useRef(false)
  const running = useRef(false)
  const rippleId = useRef(0)

  const wait = useCallback(
    (ms) =>
      new Promise((resolve) => {
        setTimeout(resolve, ms)
      }),
    []
  )

  const ripple = useCallback((x, y) => {
    const id = ++rippleId.current
    setRipples((rs) => [...rs, { id, x, y }])
    setTimeout(() => setRipples((rs) => rs.filter((p) => p.id !== id)), RIPPLE_MS)
  }, [])

  /**
   * A point inside `el` that a finger could actually hit — one that is on
   * screen and not covered by the fixed header, the nav or an overlay.
   *
   * Dead centre is not enough on its own: a tall game card or wardrobe tile can
   * have its middle under the nav bar while most of it is plainly tappable.
   * Sample a few spots and take the first that really lands on the element.
   */
  const hitPoint = useCallback((el) => {
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) return null
    for (const fy of [0.5, 0.3, 0.7, 0.15]) {
      for (const fx of [0.5, 0.25, 0.75]) {
        const x = r.left + r.width * fx
        const y = r.top + r.height * fy
        if (x < 1 || y < 1 || x > window.innerWidth - 1 || y > window.innerHeight - 1) continue
        const hit = document.elementFromPoint(x, y)
        if (hit && (hit === el || el.contains(hit))) return { x, y }
      }
    }
    return null
  }, [])

  const tapEl = useCallback(
    async (el) => {
      if (!el) throw new Error('tap: element vanished before it could be clicked')

      // `.click()` fires on a covered element regardless of what is on top of
      // it, so a clip can read as correct to the script while an overlay sits
      // over the whole recording. Insist on a point that is genuinely hittable.
      let p = hitPoint(el)
      if (!p) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        await wait(450)
        p = hitPoint(el)
      }
      if (!p) {
        const r = el.getBoundingClientRect()
        const over = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
        throw new Error(`tap: nothing hittable — covered by ${over?.className || over?.tagName || 'nothing'}`)
      }

      ripple(p.x, p.y)
      await wait(140) // let the ripple land before the screen changes under it
      el.click()
    },
    [hitPoint, ripple, wait]
  )

  const tap = useCallback(
    async (name) => {
      const el = document.querySelector(`[data-demo="${name}"]`)
      if (!el) throw new Error(`no element with data-demo="${name}" on screen`)
      if (el.disabled) throw new Error(`[data-demo="${name}"] is disabled — the seed is wrong`)
      await tapEl(el)
    },
    [tapEl]
  )

  const scroll = useCallback(
    async (name) => {
      const el = document.querySelector(`[data-demo="${name}"]`)
      if (!el) throw new Error(`no element with data-demo="${name}" to scroll to`)
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      await wait(600)
    },
    [wait]
  )

  const runClip = useCallback(
    async (id) => {
      const clip = CLIPS_BY_ID[id]
      if (!clip || running.current) return

      running.current = true
      cancelled.current = false
      setError(null)
      document.body.classList.add('demo-recording')

      const ctx = { dispatch, wait, tap, tapEl, scroll, cancelled: () => cancelled.current }

      try {
        // Whatever was left open from poking around — a sheet, a reveal — would
        // sit over the whole recording, and RESET won't close it because that
        // state lives in the components, not the store. Both kinds of overlay
        // close on a backdrop click, so no Escape (which would abort the clip).
        for (let i = 0; i < 4; i++) {
          const overlay = document.querySelector('.modal, .reveal')
          if (!overlay) break
          overlay.click()
          await wait(200)
        }

        // Every clip starts from the same place, so order never matters and a
        // retake is identical to the take it replaces.
        dispatch({ type: 'RESET' })
        clip.seed.forEach((action) => dispatch(action))
        await wait(700) // let the seeded state paint before the first beat

        for (const step of clip.steps) {
          if (cancelled.current) break
          await step(ctx)
        }
      } catch (err) {
        setError(`Clip ${clip.id} — ${clip.title}: ${err.message}`)
      } finally {
        document.body.classList.remove('demo-recording')
        running.current = false
      }
    },
    [dispatch, wait, tap, tapEl, scroll]
  )

  useEffect(() => {
    const onRun = (e) => runClip(e.detail?.id)
    window.addEventListener('berry:run-clip', onRun)
    return () => window.removeEventListener('berry:run-clip', onRun)
  }, [runClip])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && running.current) cancelled.current = true
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {ripples.map((p) => (
        <span key={p.id} className="demo-tap" style={{ left: p.x, top: p.y }} aria-hidden="true" />
      ))}

      {error && (
        <div className="demo-error" role="alert">
          <b>Clip aborted</b>
          <span>{error}</span>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
    </>
  )
}
