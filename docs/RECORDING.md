# Recording the six demo clips

The app records itself. You start OBS, click a clip in the presenter panel, and
don't touch anything — the script navigates, checks in, plays a full round of
Baggage Match and buys a room background on a fixed timer. Every clip resets the
save first, so they can be shot in any order and a retake is identical to the
take it replaces.

## Setup, once

1. `npm run dev`, open <http://localhost:5173> in the browser.
2. Size the browser so the app column is fully visible with a little margin.
   **Keep this window size for all six** — the crop is measured once and reused.
3. In OBS, capture the browser window. Any resolution is fine; 1280×720 is what
   the August set used.

## Each clip

1. Hit record.
2. Click **⚙** (bottom right) → the clip under **🎬 Record clips**.
3. The panel closes, waits 1.2s, then the app takes over. Hands off the mouse
   and keyboard — a stray click can land on the app and desync the script.
4. Wait for the app to stop moving. Every clip ends on a **1.5s still frame**.
5. Stop recording. Save as `clip-1.mkv` … `clip-6.mkv` in the project root.

Esc aborts a clip. If a step can't find what it needs the clip stops and a red
banner explains why — that's a bug to report, not a recording to keep.

## The six

| # | Title | ~s | What it shows |
| --- | --- | --- | --- |
| 1 | Entry & check-in | 16 | The HK Express home screen, the Fly with Berry tile, the push-in, a check-in reveal, and the 30-day calendar |
| 2 | Berry's room | 12 | Tap-to-talk, feeding a treat, and the room re-theming |
| 3 | Play & earn | 18 | Ticket pips, the suitcase cards, a full 8-pair clear, the payout, a ticket spent |
| 4 | Collection | 16 | Landing in Tokyo, the stamp and the Japan exclusive, then the wardrobe equipping it and a new room |
| 5 | Rewards | 17 | The four coupon ladders with *Best value*, buying a room background, and the merch tier |
| 6 | In-flight & expiry | 22 | In-flight mode, play still free, redemption locked, back online, and when the coins expire |

## After

Drop the six files in the project root and say so — the crop is confirmed
against one probe frame first, then all six convert to `demo-media/demo-N.mp4`
and `.gif`:

```bash
tools/make-clips.sh probe clip-1.mkv
```

## When the app changes again

Update `src/dev/demoScript.js` and reshoot. The clips are plain data — a list of
`tap`/`wait`/`act` steps against `data-demo` names — so a new screen is a few
lines, not a re-learned performance. Grep for `data-demo` to see every hook the
scripts can reach.
