/**
 * A scripted, perfect round of Baggage Match, used by the auto-demo.
 *
 * `BaggageMatch` renders every card's face into `.match-card__front` whether the
 * card is up or down — the flip is a CSS transform, not a conditional render —
 * so the faces can be read straight off the DOM and the pairs clicked in order.
 * That gives a fast clean clear that lands on the coin cap, which is what the
 * clip needs to show. It is emphatically not how the game is played.
 *
 * Correct pairs resolve with no lock and no timeout in `flip`, so the beats here
 * only have to outlast a React render. A mismatch would cost 750ms, and there
 * are none.
 */

const cardEls = () => Array.from(document.querySelectorAll('.match-card'))

const faceOf = (el) => el.querySelector('.match-card__front')?.textContent?.trim() ?? ''

/** Index pairs in board order, so the clear reads roughly left-to-right. */
export function findPairs(els) {
  const seen = new Map()
  const pairs = []
  els.forEach((el, i) => {
    const face = faceOf(el)
    if (!face) return
    if (seen.has(face)) {
      pairs.push([seen.get(face), i])
      seen.delete(face)
    } else {
      seen.set(face, i)
    }
  })
  return pairs
}

export async function playBaggageMatch({ wait, tapEl, cancelled }) {
  const els = cardEls()
  if (els.length !== 16) {
    throw new Error(`Baggage Match: expected 16 cards on screen, found ${els.length}`)
  }

  const pairs = findPairs(els)
  if (pairs.length !== 8) {
    throw new Error(`Baggage Match: read ${pairs.length} pairs off the board, expected 8`)
  }

  for (const [a, b] of pairs) {
    if (cancelled()) return
    // Re-query each time: the grid re-renders after every flip.
    await tapEl(cardEls()[a])
    await wait(280)
    await tapEl(cardEls()[b])
    await wait(320)
  }
}
