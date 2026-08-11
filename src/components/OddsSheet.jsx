import {
  BLINDBOX_COST,
  BLINDBOX_STREAK_DAY,
  CHECK_IN_COINS,
  MILESTONE_DAYS,
  RARITY_ODDS,
  TREAT_CHANCE
} from '../state/store.jsx'
import { BASIC_ITEMS, BLINDBOX_POOL, ITEMS_BY_ID, MILESTONE_ITEM_ID, RARITY_LABEL } from '../data/items.js'
import { Modal } from './ui.jsx'

/**
 * Full disclosure of every random drop in the app.
 *
 * Everything here reads from the same constants and pools the rolls use, so a
 * change to the odds or the item list can't leave this screen lying.
 */

const pct = (n) => `${Math.round(n * 100)}%`

export default function OddsSheet({ open, onClose }) {
  const milestoneItem = ITEMS_BY_ID[MILESTONE_ITEM_ID]

  return (
    <Modal open={open} onClose={onClose} label="Drop rates">
      <h3 style={{ fontSize: 17 }}>Drop rates</h3>
      <p className="muted" style={{ marginTop: 4 }}>
        Every random reward in Fly with Berry, and exactly how likely it is.
      </p>

      <h4 className="section-title">
        Berry Blindbox <small>{BLINDBOX_COST} coins</small>
      </h4>

      {RARITY_ODDS.map(({ rarity, chance }) => {
        const items = BLINDBOX_POOL.filter((i) => i.rarity === rarity)
        return (
          <div className="odds-row" key={rarity}>
            <div className="odds-row__head">
              <span className={`rarity rarity--${rarity}`} style={{ position: 'static' }}>
                {RARITY_LABEL[rarity]}
              </span>
              <b>{pct(chance)}</b>
            </div>
            <p className="tiny">
              {items.length} item{items.length === 1 ? '' : 's'} ·{' '}
              {items.map((i) => i.name).join(', ')}
            </p>
          </div>
        )
      })}

      <p className="tiny" style={{ marginTop: 10 }}>
        Within a rarity, anything you don’t own yet comes first. If you already own everything in
        that tier you get a duplicate and 20 coins back.
      </p>

      <h4 className="section-title">Daily check-in</h4>

      <div className="odds-row">
        <div className="odds-row__head">
          <span>
            <span className="coin-icon coin-icon--sm">B</span> {CHECK_IN_COINS} berry coins
          </span>
          <b>100%</b>
        </div>
        <p className="tiny">Paid every single day you check in.</p>
      </div>

      <div className="odds-row">
        <div className="odds-row__head">
          <span>🎁 Free blindbox</span>
          <b>100%</b>
        </div>
        <p className="tiny">
          Guaranteed on every {BLINDBOX_STREAK_DAY}th day of your streak. Those days pay no treat.
        </p>
      </div>

      <div className="odds-row">
        <div className="odds-row__head">
          <span>🍪 A treat for Berry</span>
          <b>{pct(TREAT_CHANCE)}</b>
        </div>
        <p className="tiny">
          On all other days. Split evenly —{' '}
          {BASIC_ITEMS.map((i) => `${i.emoji} ${i.name} ${pct(TREAT_CHANCE / BASIC_ITEMS.length)}`).join(
            ' · '
          )}
        </p>
      </div>

      <div className="odds-row">
        <div className="odds-row__head">
          <span>👑 {milestoneItem?.name ?? 'Exclusive look'}</span>
          <b>100%</b>
        </div>
        <p className="tiny">
          Guaranteed at {MILESTONE_DAYS} consecutive check-ins. Miss a day and the streak restarts.
        </p>
      </div>

      <button className="btn btn--ghost btn--block" style={{ marginTop: 14 }} onClick={onClose}>
        Close
      </button>
    </Modal>
  )
}
