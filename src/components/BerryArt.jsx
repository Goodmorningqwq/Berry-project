/**
 * Berry's props, drawn to sit over the official sprite.
 *
 * Each entry is `{ anchor, Behind?, Front? }`:
 *   `anchor` — 'head' or 'neck'; picks which of the look's anchor points the
 *              drawing is mapped onto (see src/data/looks.js)
 *   `Behind` — renders *under* the sprite. This is what puts a neck pillow
 *              behind Berry's head instead of across his face.
 *   `Front`  — renders over the sprite.
 *
 * Drawings use the same reference frame as the old vector Berry: a 200-wide
 * viewBox with the head centred at (100, 84), r≈52, and the neck at (100, 140).
 * Style follows the sprite: heavy black ink outline, flat fills, no gradients.
 */

const INK = '#141414'
const ink = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' }

/* ------------------------------------------------------------------ */
/* Hats                                                                */
/* ------------------------------------------------------------------ */

const CaptainCap = () => (
  <g {...ink}>
    <path d="M52 48 Q100 12 148 48 L148 56 L52 56 Z" fill="#2B2F45" />
    <rect x="46" y="50" width="108" height="14" rx="7" fill="#1E2135" />
    <path d="M40 64 Q100 80 160 64 L160 71 Q100 88 40 71 Z" fill="#0F1220" />
    <circle cx="100" cy="42" r="10" fill="#F5C542" />
    <path d="M94 42 h12 M100 36 v12" strokeWidth="2.5" />
  </g>
)

const Beanie = () => (
  <g {...ink}>
    <path d="M50 54 Q100 6 150 54 Z" fill="#6D1E7A" />
    <rect x="46" y="46" width="108" height="18" rx="9" fill="#8E44AD" />
    <circle cx="100" cy="14" r="12" fill="#E8A0C8" />
  </g>
)

const PartyHat = () => (
  <g {...ink}>
    <path d="M100 0 L126 56 L74 56 Z" fill="#E8548C" />
    <path d="M84 42 h32" stroke="#F7C948" strokeWidth="5" />
    <path d="M88 26 h24" stroke="#F7C948" strokeWidth="5" />
    <circle cx="100" cy="2" r="8" fill="#7BD4C4" />
  </g>
)

const Headphones = () => (
  <g {...ink}>
    <path d="M46 78 Q100 8 154 78" fill="none" strokeWidth="13" />
    <path d="M46 78 Q100 8 154 78" fill="none" stroke="#3B2A57" strokeWidth="8" />
    <rect x="30" y="64" width="28" height="38" rx="13" fill="#8E44AD" />
    <rect x="142" y="64" width="28" height="38" rx="13" fill="#8E44AD" />
    <rect x="37" y="73" width="14" height="20" rx="7" fill="#C9A6E0" strokeWidth="2" />
    <rect x="149" y="73" width="14" height="20" rx="7" fill="#C9A6E0" strokeWidth="2" />
  </g>
)

const Takoyaki = () => (
  <g {...ink}>
    <circle cx="100" cy="30" r="28" fill="#C98A4B" />
    <path d="M74 26 Q100 46 126 26 Q120 46 100 48 Q80 46 74 26 Z" fill="#7A4A21" />
    <path d="M80 16 q10 9 20 0 q10 9 20 0" fill="none" stroke="#F2E6C9" strokeWidth="3.5" />
    <path d="M90 6 q10 -9 20 0" fill="none" stroke="#3C8C40" strokeWidth="5" />
  </g>
)

const Conical = () => (
  <g {...ink}>
    <path d="M100 0 L166 62 L34 62 Z" fill="#E3C87F" />
    <path d="M56 46 h88 M70 30 h60 M84 16 h32" stroke="#B9974A" strokeWidth="2.5" />
    <path d="M70 62 q30 16 60 0" fill="none" stroke="#D46FA8" strokeWidth="5" />
  </g>
)

const Ramen = () => (
  <g {...ink}>
    <path d="M66 32 h68 l-9 30 h-50 z" fill="#F5F1E6" />
    <ellipse cx="100" cy="32" rx="34" ry="9" fill="#E8B44A" />
    <path d="M82 28 q9 -11 18 0 q9 -11 18 0" fill="none" stroke="#F7DFA5" strokeWidth="3.5" />
    <circle cx="114" cy="30" r="6" fill="#FBEFD5" strokeWidth="2.5" />
    <path d="M74 48 h52" stroke="#C43C3C" strokeWidth="3" />
  </g>
)

const StrawHat = () => (
  <g {...ink}>
    <ellipse cx="100" cy="56" rx="66" ry="15" fill="#EBD9A4" />
    <path d="M68 56 Q100 10 132 56 Z" fill="#DFC98A" />
    <path d="M70 50 q30 13 60 0" fill="none" stroke="#E8A0C8" strokeWidth="8" />
    <circle cx="130" cy="47" r="7" fill="#F58AB0" />
  </g>
)

/* Japan's exclusive: a hachimaki, drawn from the official render. The band
   follows the top of the head rather than sitting flat, so it reads as tied on
   rather than stuck on. */
const Hachimaki = () => (
  <g {...ink}>
    <path d="M46 62 Q100 34 154 62 L152 78 Q100 52 48 78 Z" fill="#FBFBFB" />
    <circle cx="100" cy="60" r="10" fill="#E02B20" />
  </g>
)

/* Korea's exclusive: a gat. The brim is drawn wider than the head so the
   silhouette reads at small sizes, and the crown tapers slightly the way the
   real hat does.

   The official render hangs a ribbon at chest level. That is left off: the gat
   is head-anchored, so it scales with each look's head, and a chest-length
   ribbon would drift on Crew and Pilot Berry whose proportions differ. The
   short tie under the brim keeps the read without the drift. */
const Gat = () => (
  <g {...ink}>
    <path d="M78 46 L84 8 Q100 3 116 8 L122 46 Z" fill="#1B1B1B" />
    <ellipse cx="100" cy="50" rx="70" ry="13" fill="#242424" />
    <path d="M76 46 q24 6 48 0" fill="none" stroke="#3A3A3A" strokeWidth="2.5" />
    <path d="M84 58 l-5 16" fill="none" strokeWidth="4" />
  </g>
)

const Bandana = () => (
  <g {...ink}>
    <path d="M46 46 Q100 16 154 46 L152 60 Q100 34 48 60 Z" fill="#0E7C7B" />
    {[62, 84, 106, 128].map((x) => (
      <circle key={x} cx={x} cy="48" r="4" fill="#F2B705" strokeWidth="1.5" />
    ))}
    <path d="M150 52 l22 -8 l-4 16 l16 6 l-30 6 z" fill="#0E7C7B" />
  </g>
)

/* Domed rather than conical, so it doesn't read as the Vietnamese nón lá. */
const Salakot = () => (
  <g {...ink}>
    <ellipse cx="100" cy="54" rx="64" ry="14" fill="#D8B77A" />
    <path d="M46 54 a54 44 0 0 1 108 0 z" fill="#E7CB96" />
    <path d="M62 40 a44 30 0 0 1 76 0" fill="none" stroke="#BE9A57" strokeWidth="2.5" />
    <path d="M74 26 a30 18 0 0 1 52 0" fill="none" stroke="#BE9A57" strokeWidth="2.5" />
    <path d="M100 54 v-42" stroke="#BE9A57" strokeWidth="2.5" />
    <path d="M100 14 l0 -12" strokeWidth="4" />
    <circle cx="100" cy="0" r="7" fill="#C9A227" />
  </g>
)

const PandaHood = () => (
  <g {...ink}>
    <circle cx="54" cy="34" r="24" fill="#1C1C1C" />
    <circle cx="146" cy="34" r="24" fill="#1C1C1C" />
    <path d="M44 56 a56 44 0 0 1 112 0 l0 12 q-56 -22 -112 0 z" fill="#FAFAFA" />
    <path d="M56 50 a44 30 0 0 1 88 0" fill="none" stroke="#D6D6D6" strokeWidth="3" />
    <circle cx="54" cy="34" r="10" fill="#3A3A3A" strokeWidth="2" />
    <circle cx="146" cy="34" r="10" fill="#3A3A3A" strokeWidth="2" />
  </g>
)

/* ------------------------------------------------------------------ */
/* Face props (head-anchored)                                          */
/* ------------------------------------------------------------------ */

/* Star lenses, from the official render. Each star is one path rotated into
   place, so the two lenses stay identical. */
const STAR = 'M0 -22 L6 -7 L22 -7 L9 3 L14 18 L0 9 L-14 18 L-9 3 L-22 -7 L-6 -7 Z'

const Sunnies = () => (
  <g {...ink}>
    <path d="M92 84 h16" strokeWidth="5" />
    <g transform="translate(73 85)">
      <path d={STAR} fill="#2BC4D8" transform="scale(1.18)" />
      <path d={STAR} fill="#3B2B8F" strokeWidth="2" />
    </g>
    <g transform="translate(127 85)">
      <path d={STAR} fill="#2BC4D8" transform="scale(1.18)" />
      <path d={STAR} fill="#3B2B8F" strokeWidth="2" />
    </g>
  </g>
)

const Snorkel = () => (
  <g {...ink}>
    <rect x="54" y="66" width="92" height="36" rx="14" fill="#9BE0D4" fillOpacity="0.75" />
    <path d="M146 98 q16 -8 14 -34 l0 -18" fill="none" stroke="#F2B31D" strokeWidth="9" />
    <path d="M146 98 q16 -8 14 -34 l0 -18" fill="none" strokeWidth="3" />
  </g>
)

/* ------------------------------------------------------------------ */
/* Neck props                                                          */
/* ------------------------------------------------------------------ */

/* The pillow's back arc goes under the sprite; only the two arms that come
   forward around Berry's neck render on top of him. */
const NeckPillowBehind = () => (
  <g {...ink}>
    <path d="M40 142 a62 44 0 0 1 120 0 l0 16 l-120 0 z" fill="#7BD4C4" />
    <path d="M56 130 a46 30 0 0 1 88 0" fill="none" stroke="#4FB3A0" strokeWidth="3" />
  </g>
)

const NeckPillowFront = () => (
  <g {...ink}>
    <path d="M40 138 q4 34 30 36 q16 2 18 -14 q-26 -6 -30 -30 z" fill="#7BD4C4" />
    <path d="M160 138 q-4 34 -30 36 q-16 2 -18 -14 q26 -6 30 -30 z" fill="#7BD4C4" />
    <path d="M52 148 q6 18 20 22" fill="none" stroke="#4FB3A0" strokeWidth="2.5" />
    <path d="M148 148 q-6 18 -20 22" fill="none" stroke="#4FB3A0" strokeWidth="2.5" />
  </g>
)

/* UO purple in the official render, not the pink this used to be. */
const ScarfBehind = () => (
  <g {...ink}>
    <path d="M54 126 q46 30 92 0 l0 20 q-46 28 -92 0 z" fill="#7B2D9E" />
  </g>
)

const ScarfFront = () => (
  <g {...ink}>
    <path d="M112 142 l18 52 l-20 5 l-10 -50 z" fill="#5F1F7D" />
    {/* fringe at the tail, as drawn */}
    <g stroke="#3F1456" strokeWidth="3">
      {[0, 5, 10, 15].map((d) => (
        <path key={d} d={`M${111 + d} ${191 + d * 0.3} l2 12`} />
      ))}
    </g>
    <ellipse cx="100" cy="146" rx="16" ry="11" fill="#9040B4" />
  </g>
)

const GarlandBehind = () => (
  <g {...ink}>
    <path d="M58 128 q42 -18 84 0" fill="none" strokeWidth="7" stroke="#3C8C40" />
  </g>
)

const GarlandFront = () => (
  <g>
    {[
      [58, 130],
      [70, 146],
      [86, 156],
      [114, 156],
      [130, 146],
      [142, 130]
    ].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`} {...ink} strokeWidth="2">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse
            key={a}
            rx="5"
            ry="8"
            fill={i % 2 ? '#F7C948' : '#F58AB0'}
            transform={`rotate(${a}) translate(0 -6)`}
          />
        ))}
        <circle r="3" fill="#fff" />
      </g>
    ))}
  </g>
)

const CameraBehind = () => (
  <g {...ink}>
    <path d="M62 124 q38 26 76 0" fill="none" stroke="#8E5A2B" strokeWidth="7" />
  </g>
)

const CameraFront = () => (
  <g {...ink}>
    <path d="M64 130 l22 34 M136 130 l-22 34" stroke="#8E5A2B" strokeWidth="6" />
    <rect x="78" y="158" width="44" height="32" rx="8" fill="#3B2A57" />
    <circle cx="100" cy="174" r="11" fill="#8E44AD" />
    <circle cx="100" cy="174" r="5" fill="#D6BCE8" strokeWidth="2" />
    <rect x="83" y="152" width="12" height="8" rx="3" fill="#5B4A78" strokeWidth="2" />
  </g>
)

const ShellNecklaceBehind = () => (
  <g {...ink}>
    <path d="M60 126 q40 -16 80 0" fill="none" strokeWidth="4" stroke="#C9B08A" />
  </g>
)

const ShellNecklaceFront = () => (
  <g {...ink}>
    <path d="M60 128 q40 44 80 0" fill="none" strokeWidth="4" stroke="#C9B08A" />
    {[
      [76, 148, 0.85],
      [100, 158, 1.1],
      [124, 148, 0.85]
    ].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-11 6 a11 11 0 0 1 22 0 z" fill="#FBEFD5" strokeWidth="2.5" />
        <path d="M-5 6 l2 -8 M0 6 v-10 M5 6 l-2 -8" strokeWidth="1.6" />
      </g>
    ))}
  </g>
)

const BubbleTea = () => (
  <g {...ink} transform="translate(158 168)">
    <path d="M-13 -20 h26 l-4 40 h-18 z" fill="#F0DFC8" />
    <path d="M-11 2 h22 l-3 18 h-16 z" fill="#C79A6B" />
    <rect x="-16" y="-26" width="32" height="8" rx="4" fill="#FBF3E8" />
    <rect x="1" y="-48" width="6" height="26" rx="3" fill="#E8548C" transform="rotate(12)" />
    {[
      [-5, 12],
      [3, 14],
      [7, 8],
      [-1, 7]
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="3" fill="#3B2A57" strokeWidth="1.5" />
    ))}
  </g>
)

const Lantern = () => (
  <g {...ink} transform="translate(160 160)">
    <path d="M0 -34 v10" strokeWidth="2.5" />
    <ellipse rx="17" ry="21" fill="#E8544A" />
    <rect x="-17" y="-25" width="34" height="6" rx="3" fill="#C9A227" />
    <rect x="-17" y="19" width="34" height="6" rx="3" fill="#C9A227" />
    <path d="M-8 -19 v38 M8 -19 v38" strokeWidth="1.8" stroke="#C43C3C" />
    <path d="M0 25 v11" stroke="#F5C542" strokeWidth="4" />
  </g>
)

/* ------------------------------------------------------------------ */

export const HAT_ART = {
  captainCap: { anchor: 'head', Front: CaptainCap },
  beanie: { anchor: 'head', Front: Beanie },
  partyHat: { anchor: 'head', Front: PartyHat },
  headphones: { anchor: 'head', Front: Headphones },
  takoyaki: { anchor: 'head', Front: Takoyaki },
  conical: { anchor: 'head', Front: Conical },
  ramen: { anchor: 'head', Front: Ramen },
  strawHat: { anchor: 'head', Front: StrawHat },
  hachimaki: { anchor: 'head', Front: Hachimaki },
  gat: { anchor: 'head', Front: Gat },
  bandana: { anchor: 'head', Front: Bandana },
  salakot: { anchor: 'head', Front: Salakot },
  pandaHood: { anchor: 'head', Front: PandaHood }
}

export const ACCESSORY_ART = {
  sunnies: { anchor: 'head', Front: Sunnies },
  snorkel: { anchor: 'head', Front: Snorkel },
  neckPillow: { anchor: 'neck', Behind: NeckPillowBehind, Front: NeckPillowFront },
  scarf: { anchor: 'neck', Behind: ScarfBehind, Front: ScarfFront },
  garland: { anchor: 'neck', Behind: GarlandBehind, Front: GarlandFront },
  camera: { anchor: 'neck', Behind: CameraBehind, Front: CameraFront },
  shellNecklace: { anchor: 'neck', Behind: ShellNecklaceBehind, Front: ShellNecklaceFront },
  bubbleTea: { anchor: 'neck', Front: BubbleTea },
  lantern: { anchor: 'neck', Front: Lantern }
}

export const ART_BY_SLOT = {
  hat: HAT_ART,
  accessory: ACCESSORY_ART
}
