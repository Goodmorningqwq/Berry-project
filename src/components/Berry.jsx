import { useId } from 'react'
import { ITEMS_BY_ID } from '../data/items.js'
import { ART_BY_SLOT } from './BerryArt.jsx'

/**
 * The bear himself.
 *
 * Layer order matters: legs → arms → body → outfit → ears → head → face →
 * accessory → hat. Everything lives in a 200x240 viewBox so the wardrobe art
 * in BerryArt.jsx can use absolute coordinates.
 */

const FUR = '#C7C9D6'
const FUR_DARK = '#AEB1C3'
const MUZZLE = '#EDEEF4'
const NOSE = '#6D2E8C'
const INNER_EAR = '#C39BD8'

function Eyes({ mood }) {
  if (mood === 'sleepy') {
    return (
      <g stroke="#3B2A57" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M70 86 q10 8 20 0" />
        <path d="M110 86 q10 8 20 0" />
      </g>
    )
  }
  if (mood === 'happy') {
    return (
      <g stroke="#3B2A57" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M70 90 q10 -12 20 0" />
        <path d="M110 90 q10 -12 20 0" />
      </g>
    )
  }
  if (mood === 'excited') {
    return (
      <g fill="#3B2A57">
        {[80, 120].map((cx) => (
          <path
            key={cx}
            d={`M${cx} 76 L${cx + 4} 84 L${cx + 12} 88 L${cx + 4} 92 L${cx} 100 L${cx - 4} 92 L${cx - 12} 88 L${cx - 4} 84 Z`}
          />
        ))}
      </g>
    )
  }
  return (
    <g className="berry-eyes">
      <ellipse cx="80" cy="88" rx="7" ry="8" fill="#3B2A57" />
      <ellipse cx="120" cy="88" rx="7" ry="8" fill="#3B2A57" />
      <circle cx="82.5" cy="85" r="2.4" fill="#fff" />
      <circle cx="122.5" cy="85" r="2.4" fill="#fff" />
    </g>
  )
}

export default function Berry({
  equipped = {},
  mood = 'idle',
  size = 200,
  animate = true,
  className = ''
}) {
  const uid = useId().replace(/:/g, '')
  const clip = `berry-body-${uid}`

  const layer = (slot) => {
    const item = ITEMS_BY_ID[equipped[slot]]
    if (!item) return null
    const Art = ART_BY_SLOT[slot]?.[item.art]
    return Art ? <Art clip={clip} /> : null
  }

  const blushing = mood === 'happy' || mood === 'excited'

  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={size * 1.2}
      className={`berry ${animate ? 'berry--animate' : ''} ${className}`}
      role="img"
      aria-label="Berry the bear"
    >
      <defs>
        <clipPath id={clip}>
          <ellipse cx="100" cy="172" rx="44" ry="46" />
        </clipPath>
      </defs>

      {/* legs */}
      <ellipse cx="79" cy="213" rx="17" ry="12" fill={FUR_DARK} />
      <ellipse cx="121" cy="213" rx="17" ry="12" fill={FUR_DARK} />

      {/* arms, tucked behind the body so only the paws show */}
      <ellipse cx="58" cy="168" rx="15" ry="27" fill={FUR_DARK} transform="rotate(-8 58 168)" />
      <ellipse cx="142" cy="168" rx="15" ry="27" fill={FUR_DARK} transform="rotate(8 142 168)" />

      {/* body */}
      <ellipse cx="100" cy="172" rx="44" ry="46" fill={FUR} />
      <ellipse cx="100" cy="178" rx="27" ry="30" fill={MUZZLE} opacity="0.55" />

      {layer('outfit')}

      {/* ears */}
      <g>
        <circle cx="60" cy="46" r="25" fill={FUR} />
        <circle cx="140" cy="46" r="25" fill={FUR} />
        <circle cx="60" cy="46" r="13" fill={INNER_EAR} />
        <circle cx="140" cy="46" r="13" fill={INNER_EAR} />
      </g>

      {/* head */}
      <circle cx="100" cy="84" r="52" fill={FUR} />
      <ellipse cx="100" cy="104" rx="26" ry="20" fill={MUZZLE} />

      {blushing && (
        <g fill="#F2A0BE" opacity="0.65">
          <ellipse cx="62" cy="104" rx="11" ry="7" />
          <ellipse cx="138" cy="104" rx="11" ry="7" />
        </g>
      )}

      <Eyes mood={mood} />

      {/* nose + mouth */}
      <path d="M92 98 q8 -6 16 0 q0 9 -8 12 q-8 -3 -8 -12 z" fill={NOSE} />
      <path
        d={mood === 'sleepy' ? 'M94 116 q6 4 12 0' : 'M88 114 q6 8 12 1 q6 7 12 -1'}
        fill="none"
        stroke={NOSE}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {layer('accessory')}
      {layer('hat')}
    </svg>
  )
}
