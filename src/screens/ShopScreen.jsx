import { useState } from 'react'
import { useStore, BLINDBOX_COST, holdsVoucher } from '../state/store.jsx'
import { useToast } from '../components/Toast.jsx'
import Berry from '../components/Berry.jsx'
import Celebration from '../components/Celebration.jsx'
import OddsSheet from '../components/OddsSheet.jsx'
import { Coin, Empty } from '../components/ui.jsx'
import { ITEMS_BY_ID, RARITY_LABEL } from '../data/items.js'
import { REDEMPTION_WINDOW, REWARDS, REWARD_KINDS, REWARDS_BY_ID } from '../data/rewards.js'
import { prettyDate } from '../state/store.jsx'

function Reveal({ pull, onClose }) {
  const item = ITEMS_BY_ID[pull.itemId]
  // A 10% Epic should feel like a 10% Epic.
  const intensity = pull.duplicate
    ? 'normal'
    : item.rarity === 'epic'
      ? 'epic'
      : item.rarity === 'rare'
        ? 'bonus'
        : 'normal'

  return (
    <div className="reveal" onClick={onClose}>
      <div className="reveal__card" onClick={(e) => e.stopPropagation()}>
        <Celebration intensity={intensity} />
        <div style={{ position: 'relative', zIndex: 1 }}>
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
  const { state, dispatch, offline } = useStore()
  const toast = useToast()
  const [shaking, setShaking] = useState(false)
  const [kind, setKind] = useState(REWARD_KINDS[0].id)
  const [oddsOpen, setOddsOpen] = useState(false)

  const free = state.blindboxTickets > 0
  const canOpen = (free || state.coins >= BLINDBOX_COST) && !offline

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
    if (offline) {
      toast('Vouchers are issued when you’re back online', '✈️')
      return
    }
    if (state.coins < reward.cost) {
      toast('Not enough berry coins yet', '🪙')
      return
    }
    if (holdsVoucher(state, reward.id)) {
      toast('You already hold this voucher — use it first', '🎟️')
      return
    }
    dispatch({ type: 'REDEEM_REWARD', rewardId: reward.id })
    toast(`${reward.name} — voucher issued`, reward.emoji)
  }

  /** Using a voucher is what frees its slot, so it works in flight too. */
  const useVoucher = (v, reward) => {
    if (v.used) return
    dispatch({ type: 'USE_VOUCHER', voucherId: v.id })
    toast(`${reward.name} marked as used`, '✅')
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
          {offline ? (
            '✈️ Available when you land'
          ) : free ? (
            `Open free blindbox (${state.blindboxTickets})`
          ) : (
            <>
              Open for <Coin /> {BLINDBOX_COST}
            </>
          )}
        </button>
        {offline ? (
          <p className="tiny" style={{ marginTop: 8 }}>
            ✈️ Blindboxes open again when you land.
          </p>
        ) : (
          !canOpen && (
            <p className="tiny" style={{ marginTop: 8 }}>
              You need {BLINDBOX_COST - state.coins} more coins — play a round in Play &amp; earn.
            </p>
          )
        )}
        <button className="checkin-reveal__odds" onClick={() => setOddsOpen(true)}>
          View odds
        </button>
      </div>

      <OddsSheet open={oddsOpen} onClose={() => setOddsOpen(false)} />

      <h3 className="section-title">Redeem your coins</h3>
      <p className="tiny" style={{ marginTop: -4 }}>
        {offline
          ? '✈️ Vouchers are issued by UO, so redeeming needs a connection. Codes you already hold still work onboard.'
          : `${REDEMPTION_WINDOW}.`}
      </p>

      <div className="tabs tabs--scroll" style={{ marginTop: 10 }}>
        {REWARD_KINDS.map((k) => (
          <button key={k.id} aria-selected={kind === k.id} onClick={() => setKind(k.id)}>
            {k.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        {REWARDS.filter((r) => r.kind === kind).map((r) => {
          // Capped at one outstanding voucher each, so holding one blocks the
          // next until it's used.
          const held = holdsVoucher(state, r.id)
          const affordable = state.coins >= r.cost && !offline && !held
          return (
            <button
              key={r.id}
              className="reward-row"
              onClick={() => redeem(r)}
              style={affordable ? undefined : { opacity: 0.6 }}
            >
              <div className="reward-row__emoji">{r.emoji}</div>
              <div className="reward-row__body">
                <div className="reward-row__name">
                  {r.name}
                  {r.bestValue && !held && <span className="reward-row__best">Best value</span>}
                </div>
                <p className="tiny">{held ? 'In your vouchers — use it to redeem again' : r.detail}</p>
              </div>
              <span className={`chip ${held ? 'chip--out' : 'chip--gold'}`}>
                {held ? (
                  'Held'
                ) : (
                  <>
                    <Coin small /> {r.cost}
                  </>
                )}
              </span>
            </button>
          )
        })}
      </div>

      <h3 className="section-title">
        My vouchers <small>{state.vouchers.filter((v) => !v.used).length} to use</small>
      </h3>

      {state.vouchers.length === 0 ? (
        <Empty emoji="🎟️" title="No vouchers yet" hint="Redeem coins above and they land here." />
      ) : (
        <div>
          {state.vouchers.map((v) => {
            const reward = REWARDS_BY_ID[v.rewardId]
            return (
              <button
                className={`voucher ${v.used ? 'voucher--used' : ''}`}
                key={v.id}
                onClick={() => useVoucher(v, reward)}
                disabled={v.used}
              >
                <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 600 }}>
                  {reward.emoji} {reward.name}
                </div>
                <div className="voucher__code">{v.code}</div>
                <div style={{ fontSize: 10.5, opacity: 0.75, marginTop: 4 }}>
                  {v.used
                    ? `Used ${prettyDate(v.usedAt ?? v.issuedAt)}`
                    : `Issued ${prettyDate(v.issuedAt)} · tap when you use it onboard`}
                </div>
                {v.used && <span className="voucher__stamp">Used</span>}
              </button>
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
