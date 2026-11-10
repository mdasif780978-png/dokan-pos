---
name: twenty-effects-reel
description: Turn a talking-head clip into a fast "20 video effects in 20 seconds, built by Claude" showcase reel — one new code-built effect every ~1 second (live cursor, clone row, clock dial, keyboard, orbit text, ASCII code body, post wall, letter dive, comment CTA, 3D layer explode, sketch words, blade slice, head stack, rack focus, banknote, voice note, manga impact frame, dolly zoom, newspaper front page, paper tear, particle blow-away) with a persistent "IN THIS VIDEO" chapter panel. Use when the user wants an effects showcase reel, a "N effects in N seconds" video, or to recreate/analyze this style in Remotion or After Effects.
---

# 20 Effects in 20 Seconds — Showcase Reel

Reference analysed: a 26 s, 720×720 (1:1), 30 fps talking-head reel. A man at a dark,
lamp-lit desk talks to camera the whole time; every ~1 s a new effect is applied to the
*same continuous footage*, and a side panel ticks through the list. The point of the video
is "look how many effects code (Claude) can build" + a comment-keyword CTA.

## 1. Global look (applies to every beat)

| Element | Spec |
|---|---|
| Canvas | 1080×1080 (or 720×720), 30 fps, ~26 s |
| Base footage | One uncut talking-head take. Effects sit **on top of / around** it; the audio never cuts. |
| Chapter panel | Right side, ~28 % width, full height minus margins. Dark forest green `#1F3A2E`, 1 px lighter border, 10 px radius. Header `IN THIS VIDEO` (mono, tiny, tracked) + counter `07 / 20` right-aligned. 21 rows: `01 Live cursor … 20 Blow away` (the CTA row "Comment drop" has a `•` instead of a number). Active row = white pill, dark text. Footer button `+ 40 more effects`: green, turns **gold `#C9A24A`** after the CTA beat. |
| Hook title | 0–1.7 s only: two white rounded "sticker" lines top-left: `20 video effects in 20 seconds` / `built by **Claude**`. |
| Rhythm | 0.8–1.3 s per effect, hard switch on a speech beat. CTA beat holds ~4 s. Full-frame takeovers (dial, letter dive, banknote, impact, newspaper) break the pattern. |
| Sound | One SFX per effect (whoosh, camera-shutter, gear-tick, clean-ding, keyboard clicks, paper rip, impact boom, sand hiss). The "Code body" beat literally shows this SFX map as JSON. |
| Colour | Warm, low-key footage; overlays use cream `#F1EBDD`, ink black, forest green, gold. Serif display (e.g. Instrument Serif / Playfair) + clean sans (Inter) + mono (JetBrains Mono). |

## 2. Beat sheet (timecodes from the reference)

| # | t (s) | Effect | What you see | How to build |
|---|---|---|---|---|
| 01 | 0.0–1.2 | **Live cursor** | A macOS cursor labelled "Claude" flies in, draws a selection box with handles + live `291 × 452` size tag around the man, as if resizing him. | SVG cursor + name pill on spring path; animated bounding rect with 8 handle squares; dimension label updates per frame. Optional: scale the footage slightly with the box. |
| 02 | 1.2–2.3 | **Clone row** | 6 copies of him appear left/right, smaller and blurrier with distance, all talking in sync. | Person matte (rembg / RVM / Runway roto) → duplicate layer N times at x-offsets, scale 0.6→0.35, blur + darken by depth, stagger entrance 2 frames. |
| 03 | 2.3–3.2 | **Day dial** | Cream printed clock face sweeps in; his head is the hub; words "day" sit between numerals; a hand rotates. | Wipe in a circular SVG dial (numerals 1–12, radial "day" text); centre = head-tracked point; person matte composited above the dial; rotate hand + slight dial spin. |
| 04 | 3.3–4.4 | **Predict keys** | iOS keyboard slides up bottom-left, types "Predict keys" with 3 predictive suggestions changing (k / keys / keep). | HTML/SVG iOS keyboard; type 1 char per 2 frames, highlight pressed key; suggestion bar updates; text field with blinking caret. Key-click SFX. |
| 05 | 4.6–5.5 | **Orbit ring** | Serif letters "ORBIT RING" circle around his head, passing **behind** then **in front**. | Text on an ellipse; split into back half (under person matte) and front half (above). Rotate angle over time; letter scale/opacity by z-depth. |
| 06 | 5.6–6.4 | **Code body** | His body is re-drawn from scrolling source code (JSON of the effects/SFX), red tinted; background becomes code rain. | ASCII/text-mosaic shader: sample footage luminance per cell, draw characters from a code string, colour = source pixel. Background = dim scrolling code. |
| 07 | 6.6–7.5 | **Post wall** | A GitHub-style contribution grid fills behind him with a counter: `DAY 564 · 1,711 POSTS`. | Grid of squares behind the matte; fill cells sequentially with greens/golds; animated counter with tabular numerals. |
| 08 | 7.6–8.4 | **Letter dive** | Full-frame cream card, huge serif "d…" then "dive."; footage visible *inside* the letters; camera dives into a letter back to the scene. | Text as alpha mask over footage on cream bg; scale up 1→40× into a letter counter (the dot/bowl) so the footage fills frame. |
| • | 8.6–12.6 | **Comment drop** (CTA) | Big white "EDIT" lands, an Instagram comment box types it, posts; a reply thread stacks ("EDIT to get access to these + 40 more"), heart count ticks up. Captions build: `Comment EDIT` / `to get access to these` / `+ 40 more effects`. Footer button turns gold. | Fake comment UI cards (avatar, handle, "now", heart). Type → press Post → card drops in with spring; stack 2 cards; caption pills build line by line on word timing. |
| 09 | 12.6–13.9 | **Layer explode** | The whole frame tilts into 3D and separates into its real layers: background, him, panel, captions, a waveform layer ("ROOM · TYPE · ME · LIST · SOUND"). | CSS 3D / Three.js: each layer is a plane; rotateY ≈ -35°, translateZ spread; labels on top; then collapse back. |
| 10 | 14.0–14.8 | **Sketch words** | Background turns cream paper; "sketch words" drawn in pencil/red hatching above him. | Person matte over paper texture; SVG text with stroke-dashoffset draw-on + hatch fill pattern revealed by a mask. |
| 11 | 15.0–15.9 | **Blade slice** | A thin white diagonal hairline crosses him; the two halves slide apart and back, he keeps talking. | Duplicate footage twice, clip with complementary polygons along the line, translate each half ±N px along the normal; white 1 px line flash. Swish SFX. |
| 12 | 16.0–16.9 | **Head stack** | Label tiles from the list ("Blade slice", "Press front", "Live cursor"…) drop and pile on his moving head, then tumble off. | Head tracking (MediaPipe face) → anchor; spawn tiles with gravity + simple stacking (or Matter.js); motion-blur the throw-off. |
| 13 | 17.0–17.9 | **Rack focus** | The room/he goes soft and the focus pulls. | Animate gaussian blur on footage (0→12→0 px) with slight scale breathing; keep the panel sharp. |
| 14 | 18.3–19.1 | **Banknote** | Full-frame engraved green banknote; his face in the oval portrait (engraving style); denomination counts `1 → 174,953`; "AI VIDEO EDITING MASTERCLASS — THIS NOTE IS NOT MONEY. THE NUMBER IS REAL." | SVG note frame; portrait = footage through a line-engraving / threshold + green duotone filter in an ellipse mask; counter easing. |
| 15 | 19.3–20.2 | **Voice note** | iMessage voice-note bubble top-right with waveform + play; then "Delivered ✓ / Voice note" pills. | UI bubble; waveform bars driven by real audio amplitude; spring in, then status pills. |
| 16 | 20.3–20.8 | **Impact frame** | Manga-style black & white: high-contrast ink portrait, radial speed lines, giant "IMPACT". | Threshold/posterize footage to 2 tones on cream; radial speed-line SVG; bold condensed text slam with 2-frame shake. Boom SFX. |
| 17 | 21.0–22.4 | **Dolly zoom** | Vertigo effect: background stretches while he stays the same size. | Separate person (matte) and background (inpainted plate, or the clean plate at the end); scale background 1→1.25 while slightly scaling person inversely. |
| 18 | 22.6–23.9 | **Press front** | Full newspaper front page "The Daily Reel — 20 VIDEO EFFECTS in 20 seconds, built by Claude", halftone photo of him (live), columns listing every effect with one-line captions, "Continued in the comments". | Newspaper HTML layout (serif masthead, dateline, 3 columns); centre photo = live footage through a halftone-dot shader. |
| 19 | 24.0–24.3 | **Paper tear** | The newspaper rips away from the edge revealing the live scene. | Torn-edge SVG mask path animated across; paper curl shadow; rip SFX. |
| 20 | 24.3–26.0 | **Blow away** | He disintegrates into dust particles drifting right; empty chair + room remain. | Needs a **clean plate** (shoot 1 s of the empty chair). Sample matte pixels into particles, apply noise-driven velocity left→right with staggered start; reveal clean plate underneath. |

The newspaper's own captions (useful as one-line descriptions): *Live cursor – a cursor named Claude
moves the man. Clone row – six more, all talking. Day dial – the head is the hub, the room a
printed clock face. Predict keys – a keyboard types the name, three real suggestions. Orbit ring –
type goes round the head, behind it and in front. Code body – the code that made this reel.
Layer explode – the frame in its real sheets. Sketch words – one word drawn in pencil. Blade
slice – one white hairline, two halves slide apart, still talking. Head stack – tiles pile on a
moving head. Rack focus – the room goes soft.*

## 3. Step-by-step workflow

1. **Shoot**: 25–30 s locked-off talking head, script that names each effect as it appears
   ("…clone row, day dial, predict keys…"). Record **2 s of the empty set** at the end (clean plate for blow away / dolly zoom).
2. **Transcribe** with word timestamps (Whisper `--word_timestamps`). Each effect starts on the word that names it.
3. **Pre-process** once, reuse everywhere:
   - Person alpha matte per frame (RobustVideoMatting / rembg / Runway). Save as PNG sequence or a ProRes 4444.
   - Face/head track (MediaPipe Face Landmarker) → JSON of head centre + scale per frame.
   - Audio amplitude per frame (for waveforms).
4. **Build** in Remotion (recommended, it's all code — matches the "built by Claude" premise):
   - `<Composition width=1080 height=1080 fps=30>`; base `<OffthreadVideo>` always on.
   - `effects.ts` = array `{id, label, from, durationInFrames, sfx}`; drives both the chapter panel and a `<Sequence>` per effect.
   - Layer order: background/plate → back-of-head elements → person matte → front elements → UI overlays → chapter panel → captions.
   - Full-frame takeover beats (Day dial, Letter dive, Banknote, Impact, Press front) cover the panel.
5. **Sound**: one SFX per effect at `from`, −12 dB under the voice; music bed optional (reference has none audible above VO).
6. **Render** `npx remotion render`; export 1:1 and 9:16 (pad panel to bottom for vertical).

## 4. Ready-to-use prompt

When the user just wants the prompt, give them this (fill the brackets):

```
Build a Remotion project (1080x1080, 30fps) from my talking-head clip [clip.mp4], transcript
with word timings [words.json], person matte [matte/], head track [head.json] and clean plate
[plate.png]. Keep the original video and audio uncut. Add a right-side "IN THIS VIDEO" chapter
panel (forest green #1F3A2E, mono header with NN/20 counter, active row as white pill, footer
"+ 40 more effects" turning gold after the CTA). Show the hook stickers "20 video effects in 20
seconds / built by Claude" for the first 1.7s. Then apply one effect per beat, each starting on
the word that names it: 1 Live cursor, 2 Clone row, 3 Day dial, 4 Predict keys, 5 Orbit ring,
6 Code body, 7 Post wall, 8 Letter dive, CTA Comment drop ("Comment [KEYWORD] to get access to
these + 40 more effects" with an Instagram comment UI, ~4s), 9 Layer explode, 10 Sketch words,
11 Blade slice, 12 Head stack, 13 Rack focus, 14 Banknote, 15 Voice note, 16 Impact frame,
17 Dolly zoom, 18 Press front (newspaper front page listing all effects, halftone live photo),
19 Paper tear, 20 Blow away (particle disintegration over the clean plate). Follow the specs in
the beat sheet for each. One SFX per effect. Keep each effect 0.8–1.3s, full-frame takeovers
on 3, 8, 14, 16, 18. Render a preview MP4.
```

## 5. Rules

- Never cut the speaker's audio; effects change, the take continues.
- The panel's active row must match the effect on screen on the exact same frame.
- Effects that put things *behind* him (orbit ring back half, dial, post wall, clone row) require the matte — don't fake them with plain overlays.
- Ask the user for their CTA keyword, list labels and whether they want all 20 or a subset before building.
- Make it original: use the user's own footage, brand colours and copy; the effect *techniques* are generic.
