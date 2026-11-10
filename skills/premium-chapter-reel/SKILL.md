---
name: premium-chapter-reel
description: Edit a raw talking-head clip into a clean, premium 9:16 Instagram/TikTok reel in the "5 keys" chapter style — two-font captions in a blurred lower third, gradient rhombus chapter badges, frosted UI pop-ups and counters, a speaker+text+visual hook, and full-screen animations with nose-tracking punch-ins and out-of-screen zoom-outs — built in Remotion. Also includes a library of 20 code-built effects (live cursor, clone row, day dial, predict keys, orbit ring, code body, post wall, letter dive, comment-drop CTA, layer explode, sketch words, blade slice, head stack, rack focus, banknote, voice note, impact frame, dolly zoom, newspaper front page, paper tear, particle blow-away) and an "N effects in N seconds" showcase mode with a chapter panel. Use when the user wants a premium/clean chapter-based reel, a "Joseph style" edit, an effects showcase reel or any of those effects, or wants to plan-then-build an AI edit scene by scene. Always cuts first, then has the USER plan each scene in a planning doc before building.
---

# Premium Chapter Reel (5-keys style) + Effects Library

Turn a raw talking-head video into a clean, premium, chapter-based 9:16 reel.
Style learned from Joseph | Video Editing ("How to Edit Premium Instagram Reels Using ONLY Claude", Nov 2026).

This skill has **two output modes**:
- **Chapter reel** (default) — the 5-keys workflow below.
- **Effects showcase** — "20 video effects in 20 seconds": one uncut take, a new code-built effect every ~1 s, an "IN THIS VIDEO" chapter panel and a comment-keyword CTA. Follow `references/effects-showcase.md`.

The 20 effects (codes **E00–E20** in `references/scene-library.md`) are also **Key 6** and can be offered as Design A–D options in a normal chapter reel.

**Golden rule: the human plans, Claude builds.** Never invent the edit on your own — AI-planned edits look generic. Claude suggests options; the user chooses. The skill decides *how it looks*; the plan decides *what is shown*.

---

## Workflow (always in this order)

### Step 1 — Raw cut
1. Transcribe the raw video **word by word** with timestamps (Whisper or similar).
2. Find silences (> ~0.25 s), repeated takes, false starts, filler ("um", "so like").
3. Keep the **last** good take of any repeated line.
4. Cut tight (2–3 frames of air before/after words). Export `raw-cut.mp4` + `transcript.json`.
5. **Pre-processing** (do it once, reuse it in every scene):
   - Person alpha matte per frame (RobustVideoMatting / rembg) → PNG sequence or ProRes 4444. Needed by S08, F01 and every effect marked **M**.
   - Face landmarks (MediaPipe) → per-frame nose, head centre and head scale, smoothed with a 5-frame moving average (**F**).
   - Audio amplitude per frame (**A**) for waveforms and voice notes.
   - Ask whether a 2 s **clean plate** of the empty set exists (**P**); E17 Dolly zoom and E20 Blow away need it.
6. Show the user the cut list before rendering if more than ~15% of the clip is removed.

### Step 2 — Planning document (the real trick)
Build `planning-doc.html` from the raw-cut transcript using `references/planning-doc-template.md`:
- One row per spoken line: segment code (`L01`, `L02`…), timecode range, the script line, a play button.
- Next to it: an **empty notes box** for the user + **4 recommended designs (A–D)** chosen from `references/scene-library.md` that fit what's being said.
- If the line fits one, put a code-built effect (E01–E20) among the four options — e.g. money → E14 Banknote, time → E03 Day dial, "comment X" → E00 Comment drop, the final line → E20 Blow away.
- Hand it to the user and **stop**. Tell them to spend ~15 min thinking from the viewer's side: *"What would make me keep watching here? What can I show that proves this line?"*

### Step 3 — Build
For every row: read the user's note/choice (WHAT) → look up the matching recipe in `scene-library.md` and the rules below (HOW) → gather assets (logos, screen recordings, images) → build in Remotion. Ask for any asset you can't find instead of faking it (no fake logos, no fake reviews).

### Step 4 — Review rounds (1–2 minimum)
Render a draft, then take the user's change list (speed, scale, swap design, remove element) and apply all fixes in one pass. Expect fixes like "speed up the slide-down", "scale chapter 3 up", "this design is wrong, make it a one-line text scene".

### Step 5 — Sound design + music
1. Build a **cue sheet**: every on-screen event, its frame, and the SFX it gets.
2. Place SFX (pop for badges/text pops, whoosh for slides/zooms, ding/cash for notifications, tick for counters, riser into reverb moments, low boom on full-screen text).
3. Check levels: voice −6 to −3 dB peak, SFX under voice, music −22 to −18 dB with ducking under speech.
4. Add music, render `master.mp4`.

---

## Global design system

**Canvas**: 1080×1920, 30 fps.
**Fonts**: `Creato Display` (Regular/Bold) for normal text · `Apple Garamond` Italic for special words. Fallbacks: `Inter` / `Cormorant Garamond Italic`.
**Colors**:
- White `#FFFFFF` text; near-black `#0B0B10` dark surfaces
- Accent gradient: electric cyan `#2EC5FF` → royal blue `#2340FF` (alt: violet `#7B3CFF`)
- Deep background gradient: royal/indigo `#1A2DB8` → `#070B2E` with vignette
- Glass: `rgba(20,20,28,0.55)` + `backdrop-filter: blur(24px)` + 1 px `rgba(255,255,255,0.18)` stroke, radius 28–36 px
- Success green `#3DDC84` for money values; inactive gray ring `#3A3A44`
**Motion**: ease-out for entrances (`cubic-bezier(0.16,1,0.3,1)`), springs only for badges (damping ~12). Clean, never shaky or glitchy. Most entrances 10–15 frames.

---

## Key 1 — Captions
- Split the frame into thirds. Add a **dark gradient + background blur** over the lower third (blur 20–30 px, black 0→55% upward fade).
- Caption sits in that lower box, centered, below the chin.
- **Placement method**: first place 1–2 *special* words in Apple Garamond Italic (larger, ~1.4× the sans), then fill the gaps around them with the rest of the sentence in Creato Display. Sans ~52–66 px.
- Max ~6 words per caption block; hard switch between blocks.
- **Animation (pop-up blur fade)**: from y+24 px, opacity 0, blur 8 px → y 0, opacity 1, blur 0 over 10–15 frames, ease-out.

## Key 2 — UI listicle chapters
- **Badge**: rhombus (square rotated 45°, ~150 px), cyan→blue gradient fill, thin white stroke at ~40% opacity, white sans number centered (not rotated).
- **Preview**: when the speaker says "three steps", pop all badges in a horizontal row at chest level, staggered 4–6 frames, scale 80%→100% with a spring + pop SFX.
- **Re-use**: each time a chapter starts, show that badge near the shoulder/chest with the chapter name beside it in the two-font caption style ("Step 1 — Become a *viral* editor").
- **Outro recap**: chapter names return as small glass pills in the lower third.

## Key 3 — UI pops & counters (pick by what the script says)
| Script says… | Use |
|---|---|
| Compares two things / before vs after | Object left, object right, clean thin arrow between |
| Names a software, brand, event, money | iOS-style glass notification: logo left, title + 1-line text, value badge (`+$1,204.00` green); slides down 12–16 frames |
| A number, %, time, timer | Circular ring: gray track, gradient foreground stroke drawing on, big number counting up in center |
| Lists several things | Blurred glass square; items appear row by row (5–8 frame stagger) with small icons |

## Key 4 — Hook (first 1–3 s) = Speaker + Text + Visual
1. **Speaker**: reframe so the eyes sit on the upper-third line.
2. **Text**: ask "what in this line makes someone want to watch?" — emphasize exactly that with the two-font caption.
3. **Visual**: ask "what can I show that supports the text?" — a money notification, the 3 chapter badges, a timer, the thing being promised. It must appear within 1–2 s.

## Key 5 — Full-screen animations (≈ half the edit, most impact)
- **Listicle journey**: a timeline with UI chapter cards; text and elements slide past as the camera travels point to point.
- **Single-element scene**: one hero element fills the screen (screen recording, app UI, sample edit) on the deep blue gradient, floating with soft shadow + edge glow.
- **Full-screen text**: 1–3 words centered on a flat contrasting color (e.g. white on royal blue), two-font style, hit with a low boom.
- **Out-of-screen zoom-out**: the A-roll shrinks into a floating 9:16 card on the canvas, revealing other cards (other edits, examples) around it; then pan sideways (e.g. raw clip → arrow → finished edit).
- **Pattern-interrupt punch-in**: when a line breaks the pattern ("The problem is…"), track the speaker's **nose tip to frame center**, punch in ~130–150%, desaturate to B&W, add reverb on the voice. Snap back to color on the next chapter.

## Key 6 — Code-built effects (E-codes)
Twenty short (0.8–1.5 s) effects made entirely in code, learned from the reel "20 video effects in 20 seconds, built by Claude". Full recipes are in `references/scene-library.md` → *Code-built effects*.

| Code | Effect | Best for | Needs |
|---|---|---|---|
| E00 | Comment drop (CTA) | "comment X to get…" | — |
| E01 | Live cursor | hook, "AI did this" | F |
| E02 | Clone row | "everyone", scale | M |
| E03 | Day dial (full screen) | time, every day | M F |
| E04 | Predict keys | typing, search, prompts | — |
| E05 | Orbit ring | circling a key term | M F |
| E06 | Code body | code, behind the scenes | M |
| E07 | Post wall | streaks, consistency | M |
| E08 | Letter dive (full screen) | "dive in", transition | — |
| E09 | Layer explode | how it's made | — |
| E10 | Sketch words | ideas, drafts | M |
| E11 | Blade slice | cut, two sides | — |
| E12 | Head stack | overload, piling up | F |
| E13 | Rack focus | focus, soft moment | — |
| E14 | Banknote (full screen) | money, value | F |
| E15 | Voice note | messages, DMs | A |
| E16 | Impact frame (full screen) | the hardest word | — |
| E17 | Dolly zoom | realisation, tension | M P |
| E18 | Press front (full screen) | recap, announcement | — |
| E19 | Paper tear | leave a paper scene | — |
| E20 | Blow away | outro | M P |

Needs: **M** person matte · **F** face track · **P** clean plate · **A** audio amplitude.

Rules for E-codes:
- In a chapter reel use **at most one E-code per 5–6 s**; they are spice, and the Joseph look (glass, blue gradient, two-font captions) stays the base.
- Restyle every effect to the global design system (fonts, glass, cyan→blue accent) unless the user asks for the original cream/green/gold look.
- Anything that goes *behind* the speaker must use the matte; never fake it with a flat overlay. With no clean plate, offer another effect instead of E17/E20.
- Numbers on screen (E07 posts, E14 banknote) come from the user. Never invent them.

---

## Pacing rules
- Something changes on screen every 1.5–3 s.
- Full-screen scenes ≈ 50% of runtime; A-roll with captions/pops the rest.
- Never stack more than 2 overlay elements on A-roll at once.
- Every visual must prove or illustrate the exact words being said at that moment.

## Remotion notes
- One `<Sequence>` per planning-doc row; components: `Caption`, `ChapterBadge`, `GlassNotification`, `RingCounter`, `GlassList`, `CompareArrow`, `FullScreenText`, `ZoomOutCanvas`, `NoseTrackPunch`, plus one component per E-code (`LiveCursor`, `CloneRow`, `DayDial`, `PredictKeys`, `OrbitRing`, `CodeBody`, `PostWall`, `LetterDive`, `CommentDrop`, `LayerExplode`, `SketchWords`, `BladeSlice`, `HeadStack`, `RackFocus`, `Banknote`, `VoiceNote`, `ImpactFrame`, `DollyZoom`, `PressFront`, `PaperTear`, `BlowAway`) and `ChapterPanel` for showcase mode.
- Layer order when an effect wraps the speaker: clean plate/background → behind-head elements → person matte → front elements → UI overlays → panel → captions.
- Showcase mode: one `effects.ts` array `{code, label, from, durationInFrames, sfx}` drives the panel, the sequences, the cue sheet and the Press front copy.
- Nose tracking: run face landmarks (MediaPipe) on the raw cut, export per-frame nose x/y, smooth with a 5-frame moving average, then translate/scale the video so the nose stays centered.
- Background blur: `filter: blur()` on a duplicated, cropped video layer masked to the lower third (cheaper than `backdrop-filter` in renders).

See `references/scene-library.md` for full recipes (S, F, O and E codes), `references/effects-showcase.md` for the 20-effects-in-20-seconds format, `references/planning-doc-template.md` for the planning doc, `references/train-any-style.md` to build a skill like this for any other editor's style, and `references/example-script.md` for a worked example.
