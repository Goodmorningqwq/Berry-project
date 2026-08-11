import { useState } from 'react'
import { useStore, BLINDBOX_COST } from '../state/store.jsx'
import { useToast } from '../components/Toast.jsx'
import Berry from '../components/Berry.jsx'
import { Coin, Empty } from '../components/ui.jsx'
import { ITEMS_BY_ID, RARITY_LABEL } from '../data/items.js'
import { REDEMPTION_WINDOW, REWARDS, REWARD_KINDS, REWARDS_BY_ID } from '../data/rewards.js'
import { prettyDate } from '../state/store.jsx'

function Reveal({ pull, onClose }) {
  const item = ITEMS_BY_ID[pull.itemId]
  return (
    <div className="reveal" onClick={onClose}>
      <div className="reveal__card" onClick={(e) => e.stopPropagation()}>
        <div className="reveal__burst" aria-hidden="true" />
        <div style={{ position: 'relative' }}>
          <span className={`rarity rarity--${item.rarity}`} style={{ position: 'static' }}>
            {RARITY_LABEL[item.rarity]}
          </span>
          <Berry equipped={{ [item.slot]: item.id }} mood="excited" size={150} animate={false} />
          <h3 style={{ marginTop: 4 }}>{item.name}</h3>
          <p className="muted" style={{ marginTop: 6 }}>
            {pull.duplicate
              ? `Berry already had this one — here’s ${pull.refund} coins back instead.`
              : 'Added to Berry’s wardrobe.'}
          </p>
          <button className="btn btn--primary btn--block" style={{ marginTop: 16 }} onClick={onClose}>
            Nice!
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ShopScreen() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const [shaking, setShaking] = useState(false)
  const [kind, setKind] = useState('meal')

  const free = state.blindboxTickets > 0
  const canOpen = free || state.coins >= BLINDBOX_COST

  const openBox = () => {
    if (!canOpen || shaking) return
    setShaking(true)
    // Let the box rattle before the reducer decides what fell out.
    setTimeout(() => {
      dispatch({ type: 'OPEN_BLINDBOX' })
      setShaking(false)
    }, 700)
  }

  const redeem = (reward) => {
    if (state.coins < reward.cost) {
      toast('Not enough berry coins yet', '🪙')
      return
    }
    dispatch({ type: 'REDEEM_REWARD', rewardId: reward.id })
    toast(`${reward.name} — voucher issued`, reward.emoji)
  }

  return (
    <>
      <div className="screen-head">
        <h2>Rewards</h2>
        <p className="muted" style={{ marginTop: 4 }}>
          Berry coins become outfits, inflight meals and merchandise.
        </p>
      </div>

      <div className="blindbox" style={{ marginTop: 14 }}>
        <div className={`box-art ${shaking ? 'box-art--shake' : ''}`}>
          <div className="box-art__base" />
          <div className="box-art__ribbon" />
          <div className="box-art__lid" />
        </div>
        <h3>Berry Blindbox</h3>
        <p className="muted" style={{ marginTop: 6 }}>
          A random outfit, hat or accessory. Duplicates refund 20 coins.
        </p>
        <button
          className={`btn btn--block btn--lg ${free ? 'btn--gold' : 'btn--primary'}`}
          style={{ marginTop: 14 }}
          onClick={openBox}
          disabled={!canOpen || shaking}
        >
          {free ? (
            `Open free blindbox (${state.blindboxTickets})`
          ) : (
            <>
              Open for <Coin /> {BLINDBOX_COST}
            </>
          )}
        </button>
        {!canOpen && (
          <p className="tiny" style={{ marginTop: 8 }}>
            You need {BLINDBOX_COST - state.coins} more coins — play a round in Play &amp; earn.
          </p>
        )}
      </div>

      <h3 className="section-title">Redeem your coins</h3>
      <p className="tiny" style={{ marginTop: -4 }}>
        {REDEMPTION_WINDOW}.
      </p>

      <div className="tabs" style={{ marginTop: 10 }}>
        {REWARD_KINDS.map((k) => (
          <button key={k.id} aria-selected={kind === k.id} onClick={() => setKind(k.id)}>
            {k.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        {REWARDS.filter((r) => r.kind === kind).map((r) => {
          const affordable = state.coins >= r.cost
          return (
            <button
              key={r.id}
              className="reward-row"
              onClick={() => redeem(r)}
              style={affordable ? undefined : { opacity: 0.6 }}
            >
              <div className="reward-row__emoji">{r.emoji}</div>
              <div className="reward-row__body">
                <div className="reward-row__name">{r.name}</div>
                <p className="tiny">{r.detail}</p>
              </div>
              <span className="chip chip--gold">
                <Coin small /> {r.cost}
              </span>
            </button>
          )
        })}
      </div>

      <h3 className="section-title">
        My vouchers <small>{state.vouchers.length}</small>
      </h3>

      {state.vouchers.length === 0 ? (
        <Empty emoji="🎟️" title="No vouchers yet" hint="Redeem coins above and they land here." />
      ) : (
        <div>
          {state.vouchers.map((v) => {
            const reward = REWARDS_BY_ID[v.rewardId]
            return (
              <div className="voucher" key={v.id}>
                <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>
                  {reward.emoji} {reward.name}
                </div>
                <div className="voucher__code">{v.code}</div>
                <div style={{ fontSize: 10.5, opacity: 0.75, marginTop: 4 }}>
                  Issued {prettyDate(v.issuedAt)} · show at check-in or onboard
                </div>
              </div>
            )
          })}
        </div>
      )}

      {state.lastPull && (
        <Reveal pull={state.lastPull} onClose={() => dispatch({ type: 'CLEAR_PULL' })} />
      )}
    </>
  )
}
