# Recording the demo clips

The five clips in `demo-media/` were recorded by hand against the deployed app and cropped down to
the phone frame. This is the workflow for replacing them.

There used to be a scripted runner that drove the app through each clip on a timer. It was removed
once the clips were shot — the buttons sat in the presenter panel where a judge might open them, and
the recordings they produced are already in the deck.

## Recording

1. Open the app — `npm run dev`, or the deployed build at <https://berryuo.vercel.app>.
2. Size the browser and **keep that size for every clip**, because the crop is measured once and
   reused across all of them.
3. Record the browser window in OBS, one file per clip.
4. Use the presenter panel (⚙, bottom right) for anything that needs time to pass: *Next day*,
   *Simulate flight*, *Skip 5 months*, *In-flight mode*.

Two things worth doing deliberately:

- **Close the presenter panel before the part you want to keep.** One take was spoiled by six
  seconds of the panel sitting open mid-clip, and it had to be spliced out afterwards.
- **Let the shot settle at both ends.** A second of stillness before and after gives something to
  trim into.

## Converting

`tools/make-clips.sh` does the crop and the export. Measure the crop once per recording session
rather than assuming the last one still applies — it depends entirely on the browser window.

```bash
tools/make-clips.sh probe clip-1.mkv
```

That writes a still to `demo-media/probe.png` and prints the source geometry. Read the app column
off it, then build each clip:

```bash
tools/make-clips.sh build clip-1.mkv 1 360:606:460:98
```

The crop is `W:H:X:Y`. `360:606:460:98` was correct for a 1280×720 capture with the browser at the
size used in August — the app column is 360px wide, and the phone frame runs from y=98 to y=704.

Each build writes `demo-media/demo-N.mp4` and `demo-N.gif`. The GIF is two-pass with a per-clip
palette; a single global palette turns Berry's flat fills muddy.

## What is in demo-media now

`berry`, `play`, `collection`, `rewards` and `trips` — named by the screen each one opens on, with
the August set kept in `demo-media/archive-2026-08-13/`. `demo-script.txt` alongside them has the
spoken script for each, timed to its runtime.
