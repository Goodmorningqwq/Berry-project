import { useState } from 'react'
import { useStore } from '../state/store.jsx'
import { useToast } from '../components/Toast.jsx'
import Berry from '../components/Berry.jsx'
import { Empty, ProgressBar } from '../components/ui.jsx'
import { BY_COUNTRY, DESTINATIONS } from '../data/destinations.js'
import { COSMETICS, ITEMS_BY_ID, RARITY_LABEL, SLOTS } from '../data/items.js'

function Passport() {
  const { state } = useStore()
  const newest = state.stamps[state.stamps.length - 1]

  return (
    <>
      <p className="muted" style={{ marginTop: 12 }}>
        {state.stamps.length} of {DESTINATIONS.length} destinations stamped across the UO network.
        Your first landing in each country also unlocks that country’s exclusive.
      </p>

      {BY_COUNTRY.map((country) => {
        const stamped = country.cities.filter((c) => state.stamps.includes(c.code)).length
        const exclusive = ITEMS_BY_ID[country.reward]
        const unlocked = state.ownedItems.includes(country.reward)

        return (
          <section key={country.id}>
            <h3 className="section-title">
              <span>
                {country.flag} {country.id}
              </span>
              <small>
                {stamped}/{country.cities.length}
              </small>
            </h3>

            {exclusive && (
              <p className="tiny" style={{ marginTop: -4, marginBottom: 8 }}>
                {unlocked ? '✅ Unlocked' : '🔒'} {exclusive.name}
              </p>
            )}

            <div className="stamp-grid">
              {country.cities.map((d) => {
                const earned = state.stamps.includes(d.code)
                return (
                  <div
                    key={d.code}
                    className={`stamp ${earned ? 'stamp--earned' : 'stamp--locked'} ${
                      earned && d.code === newest ? 'stamp--new' : ''
                    }`}
                    style={{ '--hue': d.hue }}
                  >
                    <span className="stamp__ring" />
                    <span className="stamp__emoji">{earned ? d.emoji : '🔒'}</span>
                    <span className="stamp__city">{d.city}</span>
                    <span className="stamp__code">{d.code}</span>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </>
  )
}

function Medals() {
  const { medals, regionBadges } = useStore()

  return (
    <>
      <p className="muted" style={{ marginTop: 12 }}>
        Every medal climbs Copper → Silver → Gold → Diamond as you keep flying with Berry.
      </p>

      <div className="card" style={{ marginTop: 10 }}>
        {medals.map((m) => (
          <div key={m.id} className={`medal-row ${m.current ? 'medal-row--earned' : 'medal-row--locked'}`}>
            <div
              className="medal-row__badge"
              style={m.current ? { background: m.current.color, color: '#fff' } : undefined}
            >
              {m.current ? m.current.emoji : m.emoji}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 13.5 }}>{m.name}</span>
                <span className="tier-chip" style={m.current ? { color: m.current.color } : undefined}>
                  {m.current ? m.current.label : 'Unranked'}
                </span>
              </div>

              <p className="tiny">
                {m.value.toLocaleString()} {m.unit}
              </p>

              <ProgressBar current={m.pct} target={100} />
              <p className="tiny" style={{ marginTop: 3 }}>
                {m.maxed
                  ? '💎 Maxed — nothing left to climb'
                  : `${m.remaining.toLocaleString()} more ${m.unit} until ${m.next.label}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="section-title">
        Region badges <small>{regionBadges.filter((b) => b.earned).length}/{regionBadges.length}</small>
      </h3>

      <div className="card">
        {regionBadges.map((b) => (
          <div key={b.id} className={`medal-row ${b.earned ? 'medal-row--earned' : 'medal-row--locked'}`}>
            <div className="medal-row__badge">{b.earned ? b.emoji : '🔒'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{b.name}</div>
              <p className="tiny">{b.detail}</p>
              {!b.earned && (
                <>
                  <ProgressBar current={b.count} target={b.total} />
                  <p className="tiny" style={{ marginTop: 3 }}>
                    {b.count}/{b.total}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function Wardrobe() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const [slot, setSlot] = useState('look')

  const items = COSMETICS.filter((i) => i.slot === slot)
  const owned = items.filter((i) => state.ownedItems.includes(i.id))
  const locked = items.filter((i) => !state.ownedItems.includes(i.id))

  const toggle = (item) => {
    const wasOn = state.equipped[item.slot] === item.id
    if (wasOn && item.slot === 'look') return // Berry always wears a look
    dispatch({ type: 'EQUIP_ITEM', itemId: item.id })
    toast(wasOn ? `${item.name} put away` : `Berry is wearing ${item.name}`, wasOn ? '👋' : '✨')
  }

  return (
    <>
      <div className="card" style={{ marginTop: 12, textAlign: 'center' }}>
        <Berry equipped={state.equipped} mood="happy" size={150} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {SLOTS.map((s) => {
            const item = ITEMS_BY_ID[state.equipped[s.id]]
            return (
              <span key={s.id} className="chip">
                {s.label}: {item ? item.name : '—'}
                {item && s.id !== 'look' && (
                  <button
                    onClick={() => dispatch({ type: 'UNEQUIP_SLOT', slot: s.id })}
                    aria-label={`Remove ${item.name}`}
                    style={{ marginLeft: 2, fontWeight: 800 }}
                  >
                    ×
                  </button>
                )}
              </span>
            )
          })}
        </div>
      </div>

      <div className="tabs" style={{ marginTop: 12 }}>
        {SLOTS.map((s) => (
          <button key={s.id} aria-selected={slot === s.id} onClick={() => setSlot(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      {owned.length === 0 ? (
        <Empty
          emoji="👕"
          title="Nothing here yet"
          hint="Open a blindbox in Rewards, or land somewhere new to earn a destination exclusive."
        />
      ) : (
        <div className="wardrobe">
          {owned.map((item) => (
            <button
              key={item.id}
              className={`wardrobe-item ${state.equipped[item.slot] === item.id ? 'wardrobe-item--on' : ''}`}
              onClick={() => toggle(item)}
            >
              <span className={`rarity rarity--${item.rarity}`}>{RARITY_LABEL[item.rarity]}</span>
              <div className="wardrobe-item__preview">
                <Berry equipped={{ [item.slot]: item.id }} mood="idle" size={78} animate={false} />
              </div>
              <div className="wardrobe-item__name">{item.name}</div>
            </button>
          ))}
        </div>
      )}

      {locked.length > 0 && (
        <>
          <h3 className="section-title">
            Still to collect <small>{locked.length} left</small>
          </h3>
          <div className="wardrobe">
            {locked.map((item) => (
              <div key={item.id} className="wardrobe-item wardrobe-item--locked">
                <span className={`rarity rarity--${item.rarity}`}>{RARITY_LABEL[item.rarity]}</span>
                <div className="wardrobe-item__preview" style={{ fontSize: 30 }}>
                  🔒
                </div>
                <div className="wardrobe-item__name">{item.name}</div>
                <div className="tiny">
                  {item.source === 'country'
                    ? 'Fly to that country'
                    : item.source === 'milestone'
                      ? '30-day streak'
                      : 'Blindbox'}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

const TABS = [
  { id: 'passport', label: 'Passport', View: Passport },
  { id: 'medals', label: 'Medals', View: Medals },
  { id: 'wardrobe', label: 'Wardrobe', View: Wardrobe }
]

export default function CollectScreen() {
  const [tab, setTab] = useState('passport')
  const View = TABS.find((t) => t.id === tab).View

  return (
    <>
      <div className="screen-head">
        <h2>Collection</h2>
      </div>
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <View />
    </>
  )
}
