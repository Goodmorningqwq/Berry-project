/**
 * Per-game leaderboards.
 *
 * The three games score on completely different scales, so each keeps its own
 * board rather than being forced onto a shared number.
 *
 * The rival roster is **fixed, not generated**. A board that reshuffles on
 * every reload looks broken in a demo, and hand-tuned scores can be checked for
 * plausibility — random ones can't. In production these rows come from a
 * service; here they are openly sample data.
 */

export const GAME_BOARDS = [
  {
    id: 'clouddash',
    name: 'Cloud Dash',
    emoji: '☁️',
    unit: 'coins',
    /** How a score reads in a row, e.g. "18 coins". */
    format: (v) => `${v} coins`
  },
  {
    id: 'baggagematch',
    name: 'Baggage Match',
    emoji: '🧳',
    unit: 'seconds to spare',
    format: (v) => (v > 0 ? `${v}s to spare` : 'not solved')
  },
  {
    id: 'candyrush',
    name: 'Candy Rush',
    emoji: '🧋',
    unit: 'points',
    format: (v) => `${v.toLocaleString()} pts`
  }
]

export const BOARDS_BY_ID = Object.fromEntries(GAME_BOARDS.map((b) => [b.id, b]))

/**
 * Sample rivals. Scores are tuned to each game's real range so a first-time
 * player lands mid-table with room to climb, rather than bottom or top.
 */
export const RIVALS = [
  { id: 'r01', name: 'Mango Wong', clouddash: 24, baggagematch: 47, candyrush: 2840 },
  { id: 'r02', name: 'Kelvin C.', clouddash: 21, baggagematch: 44, candyrush: 2610 },
  { id: 'r03', name: 'siusiu_88', clouddash: 20, baggagematch: 41, candyrush: 2380 },
  { id: 'r04', name: 'Rachel Ho', clouddash: 18, baggagematch: 39, candyrush: 2150 },
  { id: 'r05', name: 'jetlag.jo', clouddash: 17, baggagematch: 37, candyrush: 1990 },
  { id: 'r06', name: 'Marcus Tan', clouddash: 16, baggagematch: 35, candyrush: 1820 },
  { id: 'r07', name: 'Yuki 雪', clouddash: 15, baggagematch: 33, candyrush: 1700 },
  { id: 'r08', name: 'Priya N.', clouddash: 14, baggagematch: 31, candyrush: 1560 },
  { id: 'r09', name: 'window.seat', clouddash: 13, baggagematch: 30, candyrush: 1430 },
  { id: 'r10', name: 'Anson Lau', clouddash: 12, baggagematch: 28, candyrush: 1310 },
  { id: 'r11', name: 'Bella 🐻', clouddash: 11, baggagematch: 26, candyrush: 1180 },
  { id: 'r12', name: 'Danny Ip', clouddash: 10, baggagematch: 24, candyrush: 1060 },
  { id: 'r13', name: 'noodle_fan', clouddash: 9, baggagematch: 22, candyrush: 940 },
  { id: 'r14', name: 'Grace Sy', clouddash: 8, baggagematch: 20, candyrush: 830 },
  { id: 'r15', name: 'Tommy 阿仔', clouddash: 7, baggagematch: 18, candyrush: 720 },
  { id: 'r16', name: 'Elaine K.', clouddash: 6, baggagematch: 16, candyrush: 610 },
  { id: 'r17', name: 'roamer_hk', clouddash: 5, baggagematch: 13, candyrush: 500 },
  { id: 'r18', name: 'Victor Ng', clouddash: 4, baggagematch: 11, candyrush: 390 },
  { id: 'r19', name: 'mimi.travels', clouddash: 3, baggagematch: 8, candyrush: 270 },
  { id: 'r20', name: 'Sam 森', clouddash: 2, baggagematch: 5, candyrush: 150 }
]

/**
 * Merges the player into a game's board and ranks everyone.
 *
 * The player always appears, even on a score of 0 and even before they've
 * played — otherwise there'd be nothing to point at on stage.
 */
export function rankBoard(gameId, playerName, playerScore = 0) {
  const rows = RIVALS.map((r) => ({
    id: r.id,
    name: r.name,
    score: r[gameId] ?? 0,
    isPlayer: false
  }))

  rows.push({ id: 'player', name: playerName, score: playerScore, isPlayer: true })

  // Ties go to the rival, so a player matching a score sits just below them —
  // beating someone should require actually beating them.
  rows.sort((a, b) => b.score - a.score || (a.isPlayer ? 1 : -1))

  return rows.map((row, i) => ({ ...row, rank: i + 1 }))
}

/** The player's row plus `spread` neighbours either side, for the result card. */
export function rankSlice(rows, spread = 2) {
  const index = rows.findIndex((r) => r.isPlayer)
  const start = Math.max(0, index - spread)
  return rows.slice(start, index + spread + 1)
}
