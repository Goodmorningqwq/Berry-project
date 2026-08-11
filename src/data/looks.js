/**
 * Berry's full-body looks — the official character sprites.
 *
 * A flat sprite in a fixed pose can't take a clothing layer, so outfits are
 * whole-sprite swaps and the hat/accessory props are SVG overlays anchored to
 * the sprite.
 *
 * Anchors are normalised (0–1) against the sprite box:
 *   `head` — centre of the head, plus `scale`: how much bigger this sprite's
 *            head is than the base art the props were drawn against
 *   `neck` — where a collar, scarf or neck pillow should sit
 *
 * The prop art is drawn in a 200-wide viewBox with its head centred at
 * (100, 84) and its neck at (100, 140); Berry.jsx maps those two reference
 * points onto the anchors below, so one drawing lands correctly on every pose.
 */

export const LOOKS = [
  {
    id: 'everyday',
    name: 'Everyday Berry',
    sprite: '/berry/berry-default.png',
    aspect: 765 / 948,
    head: { x: 0.487, y: 0.3, scale: 1.32 },
    neck: { x: 0.5, y: 0.565 }
  },
  {
    id: 'crew',
    name: 'UO Cabin Crew Berry',
    sprite: '/berry/berry-crew.png',
    aspect: 792 / 936,
    head: { x: 0.482, y: 0.294, scale: 1.16 },
    neck: { x: 0.44, y: 0.56 }
  },
  {
    id: 'pilot',
    name: 'UO Pilot Berry',
    sprite: '/berry/berry-pilot.png',
    aspect: 757 / 936,
    head: { x: 0.51, y: 0.278, scale: 1.19 },
    neck: { x: 0.51, y: 0.53 }
  }
]

export const LOOKS_BY_ID = Object.fromEntries(LOOKS.map((l) => [l.id, l]))

export const DEFAULT_LOOK = 'everyday'

/** Reference points in the prop art's own coordinate system. */
export const ART_HEAD = { x: 100, y: 84 }
export const ART_NECK = { x: 100, y: 140 }
export const ART_WIDTH = 200
