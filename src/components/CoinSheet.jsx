import {
  COIN_EXPIRY_DAYS,
  coinsExpiring,
  prettyDate,
  useStore
} from '../state/store.jsx'
import { Coin, Modal } from './ui.jsx'

/**
 * What tapping the coin chip opens: the balance, when it runs out, and the one
 * rule people get wrong.
 *
 * The expiry date lives on the Rewards screen too, but the coin count in the
 * header is where you look when you're wondering about your coins — burying the
 * deadline one tab away made it easy to miss.
 */
export default function CoinSheet({ open, onClose }) {
  const { state } = useStore()
  const expiry = coinsExpiring(state)

  return (
    <Modal open={open} onClose={onClose} label="Your berry coins">
      <div style={{ textAlign: 'center', padding: '4px 0 2px' }}>
        <div className="coin-sheet__total">
          <Coin />
          <span>{state.coins.toLocaleString()}</span>
        </div>
        <p className="muted" style={{ marginTop: 2 }}>berry coins</p>
      </div>

      {expiry ? (
        <div className={`odds-row ${expiry.soon ? 'odds-row--warn' : ''}`} style={{ marginTop: 14 }}>
          <div className="odds-row__head">
            <span>{expiry.soon ? '⌛' : '🗓'} Expires</span>
            <b>{prettyDate(expiry.on)}</b>
          </div>
          <p className="tiny">
            {expiry.days} day{expiry.days === 1 ? '' : 's'} left. The clock started when you first
            earned into an empty balance and runs for {COIN_EXPIRY_DAYS} days —{' '}
            <b>earning more doesn’t extend it</b>. Spend the balance down to zero and the next coin
            you earn starts a fresh six months.
          </p>
        </div>
      ) : (
        <div className="odds-row" style={{ marginTop: 14 }}>
          <div className="odds-row__head">
            <span>🗓 Expires</span>
            <b>—</b>
          </div>
          <p className="tiny">
            Nothing to lose yet. The six-month clock starts the moment you earn your first coin.
          </p>
        </div>
      )}

      <div className="odds-row">
        <div className="odds-row__head">
          <span>🏆 Earned all time</span>
          <b>{state.lifetimeCoins.toLocaleString()}</b>
        </div>
        <p className="tiny">
          Lifetime earnings drive the Coin Earner medal and are never reduced by expiry.
        </p>
      </div>

      <button className="btn btn--ghost btn--block" style={{ marginTop: 14 }} onClick={onClose}>
        Close
      </button>
    </Modal>
  )
}
