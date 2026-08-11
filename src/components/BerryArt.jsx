/**
 * Berry's wardrobe, drawn as SVG layers over the base bear.
 *
 * Every entry is a component that renders inside Berry's 200x240 viewBox and
 * receives `{ clip }` — the id of a clipPath matching the body silhouette, so
 * outfits never spill past Berry's outline.
 *
 * Shared geometry (keep in sync with Berry.jsx):
 *   head   cx 100  cy 84   r 52
 *   body   cx 100  cy 172  rx 44  ry 46
 */

/* ------------------------------------------------------------------ */
/* Outfits                                                             */
/* ------------------------------------------------------------------ */

function Tee({ clip }) {
  return (
    <g clipPath={`url(#${clip})`}>
      <rect x="50" y="136" width="100" height="82" fill="#8E44AD" />
      <rect x="50" y="136" width="100" height="10" fill="#7A3697" />
      <text x="100" y="182" textAnchor="middle" fontSize="26" fill="#fff" fontWeight="700">
        UO
      </text>
    </g>
  )
}

function Crew({ clip }) {
  return (
    <>
      <g clipPath={`url(#${clip})`}>
        <rect x="50" y="136" width="100" height="82" fill="#6D1E7A" />
        <path d="M76 136 L100 162 L124 136 Z" fill="#fff" />
        <rect x="50" y="192" width="100" height="6" fill="#4B0B57" />
      </g>
      {/* neckerchief */}
      <path d="M84 138 L100 156 L116 138 Q100 148 84 138 Z" fill="#E8A0C8" />
      <circle cx="100" cy="150" r="5" fill="#D46FA8" />
    </>
  )
}

function Pilot({ clip }) {
  return (
    <>
      <g clipPath={`url(#${clip})`}>
        <rect x="50" y="136" width="100" height="82" fill="#F7F8FC" />
        <rect x="50" y="196" width="100" height="24" fill="#2B2F45" />
        <rect x="98" y="136" width="4" height="60" fill="#E2E4EE" />
      </g>
      <path d="M92 138 L100 150 L108 138 Z" fill="#2B2F45" />
      <path d="M100 150 L106 176 L100 184 L94 176 Z" fill="#2B2F45" />
      {/* epaulettes */}
      <rect x="56" y="142" width="18" height="8" rx="3" fill="#2B2F45" />
      <rect x="126" y="142" width="18" height="8" rx="3" fill="#2B2F45" />
      <rect x="59" y="144" width="3" height="4" fill="#F5C542" />
      <rect x="65" y="144" width="3" height="4" fill="#F5C542" />
      <rect x="132" y="144" width="3" height="4" fill="#F5C542" />
      <rect x="138" y="144" width="3" height="4" fill="#F5C542" />
    </>
  )
}

function Hoodie({ clip }) {
  return (
    <>
      {/* hood behind the head */}
      <path d="M56 128 Q100 108 144 128 L144 148 Q100 132 56 148 Z" fill="#5B2C8D" />
      <g clipPath={`url(#${clip})`}>
        <rect x="50" y="136" width="100" height="82" fill="#7B4BB5" />
        <path d="M72 200 h56 v18 h-56 z" fill="#6A3EA1" />
        <path d="M86 140 q14 18 28 0" fill="none" stroke="#5B2C8D" strokeWidth="3" />
      </g>
      <circle cx="88" cy="158" r="3" fill="#EFE6FA" />
      <circle cx="112" cy="158" r="3" fill="#EFE6FA" />
    </>
  )
}

function Aloha({ clip }) {
  return (
    <g clipPath={`url(#${clip})`}>
      <rect x="50" y="136" width="100" height="82" fill="#FDF3E0" />
      {[
        [68, 152],
        [96, 146],
        [124, 156],
        [78, 180],
        [110, 184],
        [134, 198],
        [62, 202]
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <ellipse rx="7" ry="3.5" fill="#3FAF7D" transform="rotate(-25)" />
          <ellipse rx="7" ry="3.5" fill="#2F9A6A" transform="rotate(35)" />
        </g>
      ))}
      <rect x="97" y="136" width="6" height="82" fill="#EFE0C6" />
    </g>
  )
}

function Raincoat({ clip }) {
  return (
    <>
      <path d="M54 126 Q100 104 146 126 L146 150 Q100 130 54 150 Z" fill="#F2B31D" />
      <g clipPath={`url(#${clip})`}>
        <rect x="50" y="136" width="100" height="82" fill="#FFC93C" />
        <rect x="96" y="136" width="8" height="82" fill="#E8A800" />
        <rect x="50" y="204" width="100" height="6" fill="#E8A800" />
      </g>
      <circle cx="100" cy="166" r="3" fill="#B47F00" />
      <circle cx="100" cy="184" r="3" fill="#B47F00" />
    </>
  )
}

function Kimono({ clip }) {
  return (
    <g clipPath={`url(#${clip})`}>
      <rect x="50" y="136" width="100" height="82" fill="#F3E9EE" />
      <path d="M50 136 L100 172 L100 218 L50 218 Z" fill="#D9557E" />
      <path d="M150 136 L100 172 L100 218 L150 218 Z" fill="#C4436B" />
      <path d="M74 136 L100 166 L126 136 Z" fill="#fff" />
      <rect x="50" y="176" width="100" height="16" fill="#6D1E7A" />
      <rect x="50" y="182" width="100" height="3" fill="#F5C542" />
      {[
        [70, 204],
        [92, 210],
        [124, 202],
        [136, 212]
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} rx="2" ry="4" fill="#FFD9E6" transform={`rotate(${a}) translate(0 -3)`} />
          ))}
        </g>
      ))}
    </g>
  )
}

function Hanbok({ clip }) {
  return (
    <g clipPath={`url(#${clip})`}>
      <rect x="50" y="136" width="100" height="82" fill="#5B7FD4" />
      <path d="M50 136 h100 v34 h-100 z" fill="#FBEFF5" />
      <path d="M74 136 L100 162 L126 136 Z" fill="#E86FA0" />
      <rect x="50" y="166" width="100" height="8" fill="#E86FA0" />
      <path d="M100 174 q-6 20 -2 44" stroke="#4A6BBC" strokeWidth="3" fill="none" />
      <path d="M100 174 q10 20 8 44" stroke="#4A6BBC" strokeWidth="3" fill="none" />
    </g>
  )
}

function Batik({ clip }) {
  return (
    <g clipPath={`url(#${clip})`}>
      <rect x="50" y="136" width="100" height="82" fill="#0E7C7B" />
      {[142, 160, 178, 196, 214].map((y, r) =>
        [58, 78, 98, 118, 138].map((x) => (
          <circle key={`${x}-${y}`} cx={x + (r % 2 ? 10 : 0)} cy={y} r="4" fill="#F2B705" opacity="0.85" />
        ))
      )}
      <rect x="96" y="136" width="8" height="82" fill="#0A605F" />
    </g>
  )
}

function GoldenWings({ clip }) {
  return (
    <>
      <g clipPath={`url(#${clip})`}>
        <rect x="50" y="136" width="100" height="82" fill="#FFFDF6" />
        <rect x="50" y="198" width="100" height="22" fill="#3B2A57" />
        <rect x="97" y="136" width="6" height="62" fill="#F0E7CE" />
      </g>
      <path d="M92 138 L100 150 L108 138 Z" fill="#3B2A57" />
      <path d="M100 150 L106 174 L100 182 L94 174 Z" fill="#C9A227" />
      {/* wings badge */}
      <g transform="translate(72 166)">
        <path d="M0 0 L-16 -4 L-14 2 L0 4 Z" fill="#F5C542" />
        <path d="M0 0 L16 -4 L14 2 L0 4 Z" fill="#F5C542" />
        <circle cx="0" cy="2" r="4" fill="#F5C542" />
        <circle cx="0" cy="2" r="2" fill="#6D1E7A" />
      </g>
      <rect x="56" y="142" width="18" height="8" rx="3" fill="#C9A227" />
      <rect x="126" y="142" width="18" height="8" rx="3" fill="#C9A227" />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Hats                                                                */
/* ------------------------------------------------------------------ */

function CaptainCap() {
  return (
    <g>
      <path d="M56 46 Q100 18 144 46 L144 54 L56 54 Z" fill="#2B2F45" />
      <rect x="52" y="50" width="96" height="12" rx="6" fill="#1E2135" />
      <path d="M46 62 Q100 76 154 62 L154 68 Q100 84 46 68 Z" fill="#141726" />
      <circle cx="100" cy="42" r="9" fill="#F5C542" />
      <path d="M94 42 h12 M100 36 v12" stroke="#2B2F45" strokeWidth="2" />
    </g>
  )
}

function Beanie() {
  return (
    <g>
      <path d="M54 52 Q100 8 146 52 Z" fill="#6D1E7A" />
      <rect x="50" y="46" width="100" height="16" rx="8" fill="#8E44AD" />
      <circle cx="100" cy="16" r="11" fill="#E8A0C8" />
    </g>
  )
}

function PartyHat() {
  return (
    <g>
      <path d="M100 2 L124 54 L76 54 Z" fill="#E8548C" />
      <path d="M100 2 L112 28 L88 28 Z" fill="#F7C948" />
      <path d="M84 42 h32" stroke="#F7C948" strokeWidth="4" />
      <circle cx="100" cy="2" r="7" fill="#7BD4C4" />
    </g>
  )
}

function Headphones() {
  return (
    <g>
      <path d="M50 76 Q100 12 150 76" stroke="#3B2A57" strokeWidth="11" fill="none" strokeLinecap="round" />
      <rect x="36" y="66" width="24" height="34" rx="11" fill="#8E44AD" />
      <rect x="140" y="66" width="24" height="34" rx="11" fill="#8E44AD" />
      <rect x="42" y="74" width="12" height="18" rx="6" fill="#C9A6E0" />
      <rect x="146" y="74" width="12" height="18" rx="6" fill="#C9A6E0" />
    </g>
  )
}

function Takoyaki() {
  return (
    <g>
      <circle cx="100" cy="34" r="26" fill="#C98A4B" />
      <path d="M76 30 Q100 48 124 30 Q118 46 100 48 Q82 46 76 30 Z" fill="#7A4A21" />
      <path d="M80 22 q10 8 20 0 q10 8 20 0" stroke="#F2E6C9" strokeWidth="3" fill="none" />
      <path d="M92 12 q8 -8 16 0" stroke="#4CAF50" strokeWidth="4" fill="none" />
    </g>
  )
}

function Conical() {
  return (
    <g>
      <path d="M100 4 L162 62 L38 62 Z" fill="#E3C87F" />
      <path d="M100 4 L162 62 L38 62 Z" fill="none" stroke="#C9A94F" strokeWidth="2" />
      <path d="M62 44 h76 M74 30 h52 M86 17 h28" stroke="#C9A94F" strokeWidth="2" />
      <path d="M74 62 q26 14 52 0" stroke="#D46FA8" strokeWidth="4" fill="none" />
    </g>
  )
}

function Ramen() {
  return (
    <g>
      <path d="M70 34 h60 l-8 26 h-44 z" fill="#F5F1E6" />
      <path d="M70 34 h60 v8 h-60 z" fill="#E2DCCB" />
      <ellipse cx="100" cy="34" rx="30" ry="8" fill="#E8B44A" />
      <path d="M84 30 q8 -10 16 0 q8 -10 16 0" stroke="#F7DFA5" strokeWidth="3" fill="none" />
      <circle cx="112" cy="32" r="5" fill="#FBEFD5" />
      <path d="M112 27 a5 5 0 0 1 0 10" fill="#E8A0C8" />
      <path d="M78 46 h44" stroke="#C43C3C" strokeWidth="2" />
    </g>
  )
}

function StrawHat() {
  return (
    <g>
      <ellipse cx="100" cy="56" rx="62" ry="14" fill="#EBD9A4" />
      <path d="M70 56 Q100 12 130 56 Z" fill="#DFC98A" />
      <path d="M72 50 q28 12 56 0" stroke="#E8A0C8" strokeWidth="7" fill="none" />
      <circle cx="128" cy="48" r="6" fill="#F58AB0" />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Accessories                                                         */
/* ------------------------------------------------------------------ */

function Sunnies() {
  return (
    <g>
      <rect x="60" y="76" width="34" height="22" rx="10" fill="#2B2F45" />
      <rect x="106" y="76" width="34" height="22" rx="10" fill="#2B2F45" />
      <rect x="94" y="84" width="12" height="5" fill="#2B2F45" />
      <path d="M64 82 l10 4" stroke="#7C8199" strokeWidth="3" strokeLinecap="round" />
      <path d="M110 82 l10 4" stroke="#7C8199" strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

function NeckPillow() {
  return (
    <g>
      <path
        d="M62 130 a38 30 0 0 1 76 0 a14 12 0 0 1 -18 6 a26 20 0 0 0 -40 0 a14 12 0 0 1 -18 -6 z"
        fill="#7BD4C4"
      />
      <path d="M70 126 a30 22 0 0 1 60 0" fill="none" stroke="#5FBBA9" strokeWidth="3" />
    </g>
  )
}

function Camera() {
  return (
    <g>
      <path d="M64 132 Q100 156 136 132" stroke="#8E5A2B" strokeWidth="5" fill="none" />
      <rect x="82" y="150" width="36" height="26" rx="6" fill="#3B2A57" />
      <circle cx="100" cy="163" r="9" fill="#8E44AD" />
      <circle cx="100" cy="163" r="4" fill="#D6BCE8" />
      <rect x="86" y="146" width="10" height="6" rx="2" fill="#5B4A78" />
    </g>
  )
}

function Scarf() {
  return (
    <g>
      <path d="M62 130 q38 26 76 0 l0 14 q-38 24 -76 0 z" fill="#C43C6B" />
      <path d="M118 142 l14 44 l-16 4 l-8 -42 z" fill="#A82F58" />
      <path d="M118 182 l16 -4 l3 10 l-17 4 z" fill="#8E2549" />
    </g>
  )
}

function BubbleTea() {
  return (
    <g transform="translate(150 158)">
      <path d="M-11 -18 h22 l-3 34 h-16 z" fill="#E4C9A8" opacity="0.85" />
      <path d="M-10 0 h20 l-2 16 h-16 z" fill="#C79A6B" />
      <rect x="-13" y="-22" width="26" height="6" rx="3" fill="#F2E4D2" />
      <rect x="2" y="-40" width="4" height="22" rx="2" fill="#E8548C" transform="rotate(12)" />
      {[
        [-5, 10],
        [2, 12],
        [6, 7],
        [-1, 6]
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" fill="#3B2A57" />
      ))}
    </g>
  )
}

function Garland() {
  return (
    <g>
      {[
        [66, 132],
        [76, 146],
        [90, 154],
        [110, 154],
        [124, 146],
        [134, 132]
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              rx="3"
              ry="5"
              fill={i % 2 ? '#F7C948' : '#F58AB0'}
              transform={`rotate(${a}) translate(0 -4)`}
            />
          ))}
          <circle r="2" fill="#fff" />
        </g>
      ))}
    </g>
  )
}

function Lantern() {
  return (
    <g transform="translate(152 150)">
      <path d="M0 -30 v10" stroke="#8E5A2B" strokeWidth="2" />
      <ellipse rx="15" ry="19" fill="#E8544A" />
      <rect x="-15" y="-22" width="30" height="5" rx="2" fill="#C9A227" />
      <rect x="-15" y="17" width="30" height="5" rx="2" fill="#C9A227" />
      <path d="M-7 -17 v34 M7 -17 v34" stroke="#C43C3C" strokeWidth="1.5" />
      <path d="M0 22 v10" stroke="#F5C542" strokeWidth="3" />
    </g>
  )
}

function Snorkel() {
  return (
    <g>
      <rect x="60" y="70" width="80" height="30" rx="12" fill="#7BD4C4" opacity="0.55" />
      <rect x="60" y="70" width="80" height="30" rx="12" fill="none" stroke="#2E9E8C" strokeWidth="4" />
      <path d="M140 96 q14 -6 12 -30 l0 -14" stroke="#F2B31D" strokeWidth="7" fill="none" strokeLinecap="round" />
    </g>
  )
}

function Fins() {
  return (
    <g>
      <ellipse cx="66" cy="216" rx="22" ry="10" fill="#2E9E8C" transform="rotate(-14 66 216)" />
      <ellipse cx="134" cy="216" rx="22" ry="10" fill="#2E9E8C" transform="rotate(14 134 216)" />
    </g>
  )
}

/* ------------------------------------------------------------------ */

export const OUTFIT_ART = {
  tee: Tee,
  crew: Crew,
  pilot: Pilot,
  hoodie: Hoodie,
  aloha: Aloha,
  raincoat: Raincoat,
  kimono: Kimono,
  hanbok: Hanbok,
  batik: Batik,
  goldenWings: GoldenWings
}

export const HAT_ART = {
  captainCap: CaptainCap,
  beanie: Beanie,
  partyHat: PartyHat,
  headphones: Headphones,
  takoyaki: Takoyaki,
  conical: Conical,
  ramen: Ramen,
  strawHat: StrawHat
}

export const ACCESSORY_ART = {
  sunnies: Sunnies,
  neckPillow: NeckPillow,
  camera: Camera,
  scarf: Scarf,
  bubbleTea: BubbleTea,
  garland: Garland,
  lantern: Lantern,
  snorkel: Snorkel,
  fins: Fins
}

export const ART_BY_SLOT = {
  outfit: OUTFIT_ART,
  hat: HAT_ART,
  accessory: ACCESSORY_ART
}
