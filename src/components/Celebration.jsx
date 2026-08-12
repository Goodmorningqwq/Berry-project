import { useMemo } from 'react'

/**
 * The reward burst shared by the check-in and blindbox reveals.
 *
 * Three layers, all GPU-only (transform/opacity):
 *  - god rays: a conic gradient on a *square* element, radially masked so it
 *    fades to nothing before the card edge. The previous version stretched a
 *    conic gradient across the whole card, which turned each ray into a giant
 *    skewed wedge — the reason this needed rebuilding.
 *  - bloom: a single white flash on the payoff frame
 *  - confetti: DOM particles given random vectors through custom properties
 *
 * Confetti is hand-rolled rather than pulling in a library: the app has no
 * dependencies beyond React and has to run offline.
 */

const TIERS = {
  normal: { rays: 10, confetti: 14, flash: false, ray: 'var(--purple-300)', size: 1 },
  bonus: { rays: 12, confetti: 26, flash: true, ray: 'var(--gold)', size: 1.15 },
  epic: { rays: 14, confetti: 40, flash: true, ray: 'var(--gold)', size: 1.35 }
}

const CONFETTI_COLORS = {
  normal: ['#9046B8', '#C4A2D3', '#EAD9F3'],
  bonus: ['#F5B72A', '#9046B8', '#FFE9A8'],
  epic: ['#F5B72A', '#9046B8', '#E8548C', '#FFFFFF']
}

export default function Celebration({ intensity = 'normal', active = true }) {
  const tier = TIERS[intensity] ?? TIERS.normal
  const colors = CONFETTI_COLORS[intensity] ?? CONFETTI_COLORS.normal

  // Fixed per mount so a re-render doesn't reshuffle mid-flight.
  const pieces = useMemo(
    () =>
      Array.from({ length: tier.confetti }, (_, i) => ({
        id: i,
        x: (Math.random() * 2 - 1) * 150,
        y: -40 - Math.random() * 170,
        rot: (Math.random() * 2 - 1) * 420,
        delay: Math.random() * 0.22,
        scale: 0.6 + Math.random() * 0.7,
        color: colors[i % colors.length],
        round: Math.random() > 0.6
      })),
    [tier.confetti, colors]
  )

  if (!active) return null

  return (
    <div className="celebration" aria-hidden="true">
      <span
        className="celebration__rays"
        style={{
          '--ray-color': tier.ray,
          '--ray-scale': tier.size,
          '--ray-step': `${360 / tier.rays}deg`,
          '--ray-width': `${360 / tier.rays / 2.4}deg`
        }}
      />
      {tier.flash && <span className="celebration__bloom" />}
      <div className="celebration__confetti">
        {pieces.map((p) => (
          <span
            key={p.id}
            className={`celebration__piece ${p.round ? 'celebration__piece--round' : ''}`}
            style={{
              '--x': `${p.x}px`,
              '--y': `${p.y}px`,
              '--r': `${p.rot}deg`,
              '--s': p.scale,
              background: p.color,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}
