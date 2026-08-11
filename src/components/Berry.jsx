import { ITEMS_BY_ID } from '../data/items.js'
import { ART_HEAD, ART_NECK, ART_WIDTH, DEFAULT_LOOK, LOOKS_BY_ID } from '../data/looks.js'
import { ACCESSORY_ART, HAT_ART } from './BerryArt.jsx'

/**
 * Berry, rendered from the official sprite with SVG props layered over it.
 *
 * Props can declare a `Behind` part that renders *under* the sprite — that's
 * what puts the neck pillow behind his head instead of across his face.
 */

const MOOD_CLASS = {
  sleepy: 'berry--sleepy',
  happy: 'berry--happy',
  excited: 'berry--happy'
}

/** Maps the prop art's reference point onto this look's anchor. */
function anchorTransform(anchor, ref, viewWidth, viewHeight, scale) {
  const x = anchor.x * viewWidth
  const y = anchor.y * viewHeight
  return `translate(${x - ref.x * scale} ${y - ref.y * scale}) scale(${scale})`
}

export default function Berry({
  equipped = {},
  mood = 'idle',
  size = 200,
  animate = true,
  effect = null,
  className = ''
}) {
  const look = LOOKS_BY_ID[equipped.look] ?? LOOKS_BY_ID[DEFAULT_LOOK]

  const viewWidth = ART_WIDTH
  const viewHeight = Math.round(ART_WIDTH / look.aspect)
  const scale = look.head.scale

  const headTransform = anchorTransform(look.head, ART_HEAD, viewWidth, viewHeight, scale)
  const neckTransform = anchorTransform(look.neck, ART_NECK, viewWidth, viewHeight, scale)

  const hat = ITEMS_BY_ID[equipped.hat]
  const accessory = ITEMS_BY_ID[equipped.accessory]
  const arts = [accessory ? ACCESSORY_ART[accessory.art] : null, hat ? HAT_ART[hat.art] : null]

  // Each drawing declares whether it hangs off the head or the neck, so a face
  // prop in the accessory slot (sunglasses, snorkel) still lands on the face.
  const layer = (art, part, key) => {
    const Part = art?.[part]
    if (!Part) return null
    return (
      <g key={key} transform={art.anchor === 'head' ? headTransform : neckTransform}>
        <Part />
      </g>
    )
  }

  const overlay = (part) => (
    <svg
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      className="berry__layer"
      aria-hidden="true"
      focusable="false"
    >
      {arts.map((art, i) => layer(art, part, i))}
    </svg>
  )

  return (
    <div
      className={`berry ${animate ? 'berry--animate' : ''} ${MOOD_CLASS[mood] ?? ''} ${className}`}
      style={{ width: size, height: size / look.aspect }}
      role="img"
      aria-label={`Berry the bear wearing ${look.name}`}
    >
      {overlay('Behind')}
      <img className="berry__sprite" src={look.sprite} alt="" draggable="false" />
      {overlay('Front')}

      {effect === 'hearts' && (
        <div className="berry__hearts" aria-hidden="true">
          {['💜', '💛', '💜'].map((h, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.14}s` }}>
              {h}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
