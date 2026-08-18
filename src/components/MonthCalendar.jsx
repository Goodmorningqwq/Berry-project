import { MILESTONE_DAYS, TICKET_STREAK_BONUS } from '../state/store.jsx'
import { CHECK_IN_CALENDAR, CYCLE_LENGTH, rewardForStreak } from '../data/checkin.js'
import { BASIC_ITEMS_BY_ID, ITEMS_BY_ID, MILESTONE_ITEM_ID } from '../data/items.js'
import { Coin, Modal } from './ui.jsx'

/**
 * The full run to the 30-day milestone, opened by tapping the week strip on
 * Home.
 *
 * The seven-day strip answers "what do I get tomorrow"; this answers "is the
 * exclusive worth chasing", which is the question that actually drives a
 * 30-day streak. Everything derives from `rewardForStreak`, so the two views
 * can't disagree — the strip is just the first seven cells of this.
 */
export default function MonthCalendar({ open, streak = 0, onClose }) {
  const days = Array.from({ length: MILESTONE_DAYS }, (_, i) => i + 1)
  const totalCoins = days.reduce((sum, d) => sum + rewardForStreak(d).coins, 0)
  const blindboxes = days.filter((d) => rewardForStreak(d).blindbox).length
  const tickets = days.filter((d) => d % TICKET_STREAK_BONUS === 0).length
  const treats = days.filter((d) => rewardForStreak(d).treat).length
  const milestoneItem = ITEMS_BY_ID[MILESTONE_ITEM_ID]

  return (
    <Modal open={open} onClose={onClose} label="30-day check-in calendar">
      <h3 style={{ fontSize: 17 }}>The 30-day run</h3>
      <p className="muted" style={{ marginTop: 4 }}>
        The {CYCLE_LENGTH}-day cycle repeats, and nothing about it is random — every day pays exactly
        what it says here.
      </p>

      <div className="month-grid">
        {days.map((day) => {
          const reward = rewardForStreak(day)
          const treat = reward.treat ? BASIC_ITEMS_BY_ID[reward.treat] : null
          const done = day <= streak
          const isNext = day === streak + 1
          const milestone = day === MILESTONE_DAYS
          const ticket = day % TICKET_STREAK_BONUS === 0
          return (
            <div
              key={day}
              className={`month-day ${done ? 'month-day--done' : ''} ${
                isNext ? 'month-day--next' : ''
              } ${reward.peak ? 'month-day--peak' : ''} ${milestone ? 'month-day--milestone' : ''}`}
              title={`Day ${day}`}
            >
              <span className="month-day__num">{day}</span>
              <span className="month-day__coins">{reward.coins}</span>
              <span className="month-day__bonus">
                {milestone ? '👑' : reward.blindbox ? '🎁' : treat ? treat.emoji : ''}
                {ticket && !milestone ? '🎟️' : ''}
              </span>
            </div>
          )
        })}
      </div>

      <div className="month-legend">
        <span>
          <b className="month-swatch month-swatch--done" /> collected
        </span>
        <span>
          <b className="month-swatch month-swatch--next" /> next up
        </span>
        <span>⭐ big coin day</span>
        <span>🎁 blindbox</span>
        <span>🎟️ bonus ticket</span>
        <span>👑 exclusive</span>
      </div>

      <h4 className="section-title">A full 30 days pays</h4>
      <div className="odds-row">
        <div className="odds-row__head">
          <span>
            <Coin small /> Berry coins
          </span>
          <b>{totalCoins.toLocaleString()}</b>
        </div>
        <p className="tiny">
          {CHECK_IN_CALENDAR.reduce((s, d) => s + d.coins, 0)} a week, every week — day 5 is always
          the biggest.
        </p>
      </div>
      <div className="odds-row">
        <div className="odds-row__head">
          <span>🎁 Free blindboxes</span>
          <b>{blindboxes}</b>
        </div>
        <p className="tiny">One at the end of each full week.</p>
      </div>
      <div className="odds-row">
        <div className="odds-row__head">
          <span>🎟️ Bonus play tickets</span>
          <b>{tickets}</b>
        </div>
        <p className="tiny">
          One for every {TICKET_STREAK_BONUS} days in a row, on top of the three you get daily.
        </p>
      </div>
      <div className="odds-row">
        <div className="odds-row__head">
          <span>🍪 Treats for Berry</span>
          <b>{treats}</b>
        </div>
        <p className="tiny">Fed to Berry — every 5 earns another free blindbox.</p>
      </div>
      <div className="odds-row">
        <div className="odds-row__head">
          <span>👑 {milestoneItem?.name ?? 'Exclusive look'}</span>
          <b>day {MILESTONE_DAYS}</b>
        </div>
        <p className="tiny">
          Guaranteed at {MILESTONE_DAYS} consecutive check-ins. Miss a day and the streak restarts
          from day 1.
        </p>
      </div>

      <button className="btn btn--ghost btn--block" style={{ marginTop: 14 }} onClick={onClose}>
        Close
      </button>
    </Modal>
  )
}
