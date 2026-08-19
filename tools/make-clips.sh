#!/usr/bin/env bash
# Turn OBS screen recordings of the auto-demo into the deck's clips.
#
#   tools/make-clips.sh probe  clip-3.mkv
#   tools/make-clips.sh build  clip-3.mkv 3 360:720:460:24
#
# `probe` dumps a still and prints the source geometry so the crop can be read
# off it. The crop depends on the browser window, so it is never assumed —
# check it once per recording session, then reuse it for all six.
#
# `build` writes demo-media/demo-N.mp4 and demo-N.gif. The GIF is two-pass with
# a per-clip palette; a single global palette turns Berry's flat fills muddy.
set -euo pipefail

OUT=demo-media
mode=${1:?usage: probe|build}
src=${2:?source recording}

case "$mode" in
  probe)
    ffprobe -v error -select_streams v:0 \
      -show_entries stream=width,height,r_frame_rate,duration \
      -of default=noprint_wrappers=1 "$src"
    mkdir -p "$OUT"
    ffmpeg -y -v error -ss 2 -i "$src" -frames:v 1 "$OUT/probe.png"
    echo "still written to $OUT/probe.png — read the crop off it"
    ;;

  build)
    n=${3:?clip number}
    crop=${4:?crop as W:H:X:Y}
    mkdir -p "$OUT"

    # Even dimensions, or H.264 refuses the odd one.
    ffmpeg -y -v error -i "$src" \
      -vf "crop=$crop,scale=trunc(iw/2)*2:trunc(ih/2)*2" \
      -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 20 -preset slow -an \
      -movflags +faststart "$OUT/demo-$n.mp4"

    # 15fps keeps the GIFs small enough to sit six-to-a-deck while staying
    # smooth enough for the card flips.
    pal=$(mktemp -u).png
    filters="fps=15,crop=$crop,scale=360:-1:flags=lanczos"
    ffmpeg -y -v error -i "$src" -vf "$filters,palettegen=max_colors=128" "$pal"
    ffmpeg -y -v error -i "$src" -i "$pal" \
      -lavfi "$filters[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" \
      "$OUT/demo-$n.gif"
    rm -f "$pal"

    ls -lh "$OUT/demo-$n.mp4" "$OUT/demo-$n.gif" | awk '{print $5, $9}'
    ;;

  *) echo "unknown mode: $mode" >&2; exit 1 ;;
esac
