import {
  BLINDBOX_COST,
  DAILY_TICKETS,
  COIN_EXPIRY_DAYS,
  VOUCHER_EXPIRY_DAYS,
  FEEDS_PER_TICKET,
  MILESTONE_DAYS,
  RARITY_ODDS,
  TICKET_CAP,
  TICKET_STREAK_BONUS
} from '../state/store.jsx'
import { CHECK_IN_CALENDAR, WEEKLY_COINS } from '../data/checkin.js'
import {
  BASIC_ITEMS_BY_ID,
  BLINDBOX_POOL,
  ITEMS_BY_ID,
  MILESTONE_ITEM_ID,
  RARITY_LABEL
} from '../data/items.js'
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

      <h4 className="section-title">
        Daily check-in <small>{WEEKLY_COINS} coins a week</small>
      </h4>
      <p className="tiny" style={{ marginTop: -4, marginBottom: 8 }}>
        Nothing here is random — the 7-day cycle always pays the same thing on the same day.
      </p>

      {CHECK_IN_CALENDAR.map((entry) => {
        const treat = entry.treat ? BASIC_ITEMS_BY_ID[entry.treat] : null
        return (
          <div className="odds-row" key={entry.day}>
            <div className="odds-row__head">
              <span>
                Day {entry.day}
                {entry.peak && ' ⭐'}
              </span>
              <b>
                <span className="coin-icon coin-icon--sm">B</span> {entry.coins}
                {entry.blindbox && ' + 🎁'}
                {treat && ` + ${treat.emoji}`}
              </b>
            </div>
            <p className="tiny">
              {entry.blindbox
                ? 'Free blindbox — the reward for a full week'
                : treat
                  ? `${treat.name} for Berry`
                  : entry.peak
                    ? 'The week’s biggest coin day'
                    : 'Berry coins'}
            </p>
          </div>
        )
      })}

      <div className="odds-row">
        <div className="odds-row__head">
          <span>👑 {milestoneItem?.name ?? 'Exclusive look'}</span>
          <b>100%</b>
        </div>
        <p className="tiny">
          Guaranteed at {MILESTONE_DAYS} consecutive check-ins. Miss a day and the streak restarts.
        </p>
      </div>

      <h4 className="section-title">
        Play tickets <small>{DAILY_TICKETS} a day</small>
      </h4>
      <div className="odds-row">
        <div className="odds-row__head">
          <span>🎟️ Daily tickets</span>
          <b>{DAILY_TICKETS}</b>
        </div>
        <p className="tiny">
          One ticket opens any minigame, and coins are paid on how well you play. Leaving without
          collecting hands the ticket back. Tickets refresh each day; unused ones don’t carry over.
        </p>
      </div>
      <div className="odds-row">
        <div className="odds-row__head">
          <span>🔥 Streak bonus</span>
          <b>+1 every {TICKET_STREAK_BONUS}</b>
        </div>
        <p className="tiny">
          Every {TICKET_STREAK_BONUS} check-ins in a row earns a bonus ticket. You can hold up to{' '}
          {TICKET_CAP} at once.
        </p>
      </div>

      <h4 className="section-title">
        Expiry <small>six months</small>
      </h4>
      <div className="odds-row">
        <div className="odds-row__head">
          <span>🪙 Berry coins</span>
          <b>{COIN_EXPIRY_DAYS} days</b>
        </div>
        <p className="tiny">
          Your balance lapses after {COIN_EXPIRY_DAYS} days with no earning or spending. Any coins in
          or out pushes the date back a full six months, so an active account never loses anything.
        </p>
      </div>
      <div className="odds-row">
        <div className="odds-row__head">
          <span>🎟️ Vouchers</span>
          <b>{VOUCHER_EXPIRY_DAYS} days</b>
        </div>
        <p className="tiny">
          Counted from the day it's issued, and shown on the voucher. An expired voucher frees its
          slot, so you can always redeem that reward again.
        </p>
      </div>

      <h4 className="section-title">Feeding Berry</h4>
      <div className="odds-row">
        <div className="odds-row__head">
          <span>🎁 Free blindbox</span>
          <b>every {FEEDS_PER_TICKET}</b>
        </div>
        <p className="tiny">
          Feeding doesn’t pay coins — every {FEEDS_PER_TICKET} treats you feed Berry earns a free
          blindbox instead.
        </p>
      </div>

      <button className="btn btn--ghost btn--block" style={{ marginTop: 14 }} onClick={onClose}>
        Close
      </button>
    </Modal>
  )
}
