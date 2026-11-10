# Scene Library — recipes Claude suggests as Designs A–D

Each recipe: **when to use → layout → animation → SFX**. Frames at 30 fps.

## A-roll overlays

### S01 Two-font caption (default on every A-roll line)
- When: always, unless a full-screen scene covers the line.
- Layout: lower-third blur box; 1–2 Garamond italic special words, sans fills gaps.
- Anim: pop-up blur fade, 12 f. · SFX: none (soft tick on special word optional).

### S02 Chapter preview row
- When: "X steps / X things / X reasons".
- Layout: N rhombus badges in a row at chest height, 40 px gaps.
- Anim: staggered spring scale 80→100%, 5 f apart. · SFX: pop per badge.

### S03 Chapter intro badge
- When: "Step one is…", "First…", "Number two…".
- Layout: single badge near shoulder + chapter name in two-font caption beside it.
- Anim: badge spring in, text blur-fades 4 f later. · SFX: pop + soft whoosh.

### S04 Glass notification
- When: brand/app named, money earned, message received, event.
- Layout: top or mid frame, 900 px wide glass card, logo 72 px left, title bold + 1 line text, value badge right.
- Anim: slide down 40 px + fade, 14 f; hold; slide up out 10 f. · SFX: notification ding / cash register.

### S05 Ring counter
- When: percent, number, duration, timer.
- Layout: 420 px ring, 18 px stroke, gray track + gradient arc, number 120 px center.
- Anim: arc draws 0→value and number counts up together over 20–30 f, ease-out. · SFX: rising ticks, ding at end.

### S06 Glass list
- When: listing 3–5 items.
- Layout: glass square ~800 px; rows with small icon + text.
- Anim: card scales 92→100% + fade 10 f; rows stagger 6 f. · SFX: soft pop per row.

### S07 Before → After
- When: comparing two things, transformation.
- Layout: left object, thin white arrow, right object; labels below.
- Anim: left fades in, arrow draws 8 f, right pops. · SFX: whoosh on arrow.

### S08 Pattern-interrupt punch-in
- When: "The problem is…", "But here's the thing…", a shock stat.
- Layout: nose-tracked punch-in 130–150%, full desaturation, slight vignette.
- Anim: hard cut in (0–2 f); snap back on next chapter. · SFX: reverb tail on voice + low hit.

## Full-screen scenes

### F01 Out-of-screen zoom-out
- When: introducing other examples, "everyone else does X".
- Layout: A-roll shrinks to a floating 9:16 card (scale 100→42%) on deep blue gradient; side cards slide in.
- Anim: zoom 20–25 f ease-in-out; side cards drift slowly. · SFX: whoosh out.

### F02 Pan across cards
- When: showing a process (raw → final), a journey.
- Layout: cards in a horizontal row with arrows; camera pans left→right.
- Anim: continuous pan, ease-in-out, ~1.5–2.5 s. · SFX: soft whoosh, pop when final card lands.

### F03 Hero element
- When: a tool, a screen recording, a sample edit, a profile.
- Layout: one card fills ~85% width, soft shadow, 1 px glow edge, blue gradient bg.
- Anim: rise 60 px + fade 15 f; slow push-in 102% during hold. · SFX: whoosh in.

### F04 Quote card
- When: quoting a person/book.
- Layout: big Garamond italic quote, sans attribution; optional portrait (only if user supplies a licensed photo).
- Anim: words blur-fade in by phrase. · SFX: soft swell.

### F05 Full-screen text
- When: the single most important phrase of a section.
- Layout: 1–3 words centered on flat contrasting color, special word in Garamond.
- Anim: hard cut in, slight scale 104→100% over 8 f. · SFX: low boom.

### F06 Listicle timeline
- When: walking through chapters in one move.
- Layout: vertical/horizontal timeline line, chapter cards attached, text slides by.
- Anim: camera tracks along the line; cards pop as reached. · SFX: tick per card.

### F07 Blueprint graph
- When: data, growth, comparison over time.
- Layout: blueprint grid background (thin blue lines), bars or a line chart, small sans labels.
- Anim: grid fades, bars grow 15 f staggered. · SFX: rising tone.

### F08 Radar / network
- When: "clients", "audience", "reach", "people find you".
- Layout: concentric ripples from center, avatar nodes appear on rings.
- Anim: ripples expand continuously; nodes pop staggered. · SFX: sonar ping, pops.

## Outro
### O01 Recap pills
- Chapter names return as glass pills in the lower third, stacking up, then soft fade out with music tail.

## Code-built effects (E-codes)

Learned from the "20 video effects in 20 seconds, built by Claude" reel. Use them one at a time
inside a normal chapter reel (as a Design A–D option when the line fits), or all together in
**Effects Showcase Mode** (`effects-showcase.md`). Each is 0.8–1.5 s unless noted.
Needs column: **M** = person matte, **F** = face/head track, **P** = clean plate, **A** = audio amplitude.

### E00 Comment drop (CTA)
- When: "comment X to get…", any keyword CTA. Hold ~4 s.
- Layout: a big white keyword ("EDIT") lands top-centre; an Instagram-style comment card types it and posts; a reply card stacks under it with a ticking heart count. Two-font caption builds line by line in the lower third: `Comment *EDIT*` / `to get access to these` / `+ 40 more effects`.
- Anim: keyword slams in scale 130→100% over 6 f; typing at 2 f per character; cards drop 30 px with a spring; caption lines blur-fade 8 f apart. · SFX: key clicks, pop on post, soft ding per like.

### E01 Live cursor — needs F
- When: hook, "Claude did this", anything about AI/software controlling the edit.
- Layout: macOS arrow cursor with a name pill ("Claude") flies in and draws a selection box with 8 handles around the speaker, plus a live dimension tag `291 × 452` above the box.
- Anim: cursor follows an eased bezier path in 10 f; the box draws out from the corner; dimensions update every frame as the box resizes; the footage can scale slightly with it. · SFX: mouse click, soft drag tick.

### E02 Clone row — needs M
- When: "everyone", "more of me", scale, team, multiplying output.
- Layout: 6 copies of the matted speaker in a row behind him, scaled 60→35% with distance, blurred and darkened by depth, all talking in sync.
- Anim: clones pop out from behind the speaker, 2 f stagger, ease-out. · SFX: layered whoosh / camera-shutter.

### E03 Day dial — needs M, F (full screen)
- When: time, days, schedules, "every day", deadlines.
- Layout: cream printed clock face (Garamond numerals 1–12, the word "day" set radially between them) fills the frame; the head is the hub; the matte sits above the dial.
- Anim: dial wipes in with a radial reveal in 6 f, hand rotates, the face turns slowly. · SFX: gear tick.

### E04 Predict keys
- When: typing, searching, naming something, prompts.
- Layout: iOS keyboard slides up in the lower area with a text field and 3 predictive suggestions.
- Anim: types 1 character per 2 f, the pressed key highlights, suggestions change per keystroke, caret blinks. · SFX: key clicks.

### E05 Orbit ring — needs M, F
- When: a key term you want to circle round the head; ideas, "around", focus.
- Layout: serif capitals on an ellipse around the head; the back half sits under the matte, the front half above it.
- Anim: rotate the angle continuously; letter scale and opacity follow depth (z). · SFX: airy whoosh loop.

### E06 Code body — needs M
- When: "code", "built with Claude", tech, behind the scenes.
- Layout: the speaker is redrawn as characters from real source (e.g. the reel's own `effects.ts` / SFX map), coloured from the footage; the background becomes dim scrolling code.
- Anim: cells resolve from noise into the person over 6 f; the code scrolls up. · SFX: data chatter / glitch tick (keep it clean, not shaky).

### E07 Post wall — needs M
- When: consistency, streaks, "I posted every day", volume.
- Layout: a contribution-graph grid fills the background behind the matte; mono counter top-right `DAY 564 · 1,711 POSTS` (numbers from the user).
- Anim: cells fill in sequence over ~20 f; the counter counts up with tabular numerals. · SFX: rising ticks → ding.

### E08 Letter dive (full screen)
- When: "dive in", going deeper, a transition into the next chapter.
- Layout: cream card with giant serif text ("dive."), the footage visible only inside the letters.
- Anim: letters type on; then scale ~1→40× into one counter (the inside of a letter) until the footage fills the frame. · SFX: whoosh in + low thump.

### E09 Layer explode
- When: "how it's made", "layers", breakdowns, revealing the edit.
- Layout: the whole frame tilts into 3D and separates into its real layers (background, speaker, panel, captions, waveform), each labelled in mono (`ROOM · ME · LIST · SOUND`).
- Anim: rotateY ≈ −35°, translateZ spread 20 f, hold, collapse back 12 f. · SFX: whoosh out / whoosh in.

### E10 Sketch words — needs M
- When: drafts, ideas, "sketch", handmade or creative lines.
- Layout: the background becomes cream paper; 1–2 words are hand-drawn above the head in pencil outline with red hatching.
- Anim: stroke-dashoffset draw-on 12 f, hatch fill revealed by a mask. · SFX: pencil scribble.

### E11 Blade slice
- When: "cut", splitting, two sides, decisions.
- Layout: one white 1 px diagonal hairline crosses the speaker; the two halves are copies of the footage clipped along the line.
- Anim: the line flashes, the halves slide ±40 px along the normal, then rejoin; the speaker keeps talking. · SFX: blade swish.

### E12 Head stack — needs F
- When: overload, "too many things", piling up a list.
- Layout: label tiles (glass or white pills) fall and pile on the tracked head and move with it.
- Anim: gravity drop with small bounces (Matter.js or spring), then tumble off with motion blur. · SFX: tile clacks.

### E13 Rack focus
- When: "focus", shifting attention, a soft reflective line.
- Layout: the footage blurs; the panel and captions stay sharp.
- Anim: blur 0→12→0 px with a slight scale breath (100→102%). · SFX: soft lens whoosh.

### E14 Banknote — needs F (full screen)
- When: money, value, "masterclass", pricing, a big number.
- Layout: engraved banknote frame; the speaker's face in the oval portrait with an engraving/line + green duotone filter; the denomination counts up (`1 → 174,953`, the number from the user); small print in the user's own words.
- Anim: hard cut in; counter eases over 20 f. · SFX: cash register / paper flick.

### E15 Voice note — needs A
- When: a message, "I sent…", DMs, voice.
- Layout: iMessage-style voice-note bubble top-right with a play button, waveform and avatar; then `Delivered ✓` and `Voice note` pills.
- Anim: the bubble springs in, the waveform bars follow real audio amplitude, the pills pop 6 f apart. · SFX: message whoosh, delivered tick.

### E16 Impact frame (full screen, 0.4–0.6 s)
- When: the hardest-hitting word; a shock line (alternative to S08).
- Layout: the speaker thresholded to 2-tone ink on cream, radial manga speed lines, giant condensed sans word ("IMPACT").
- Anim: hard cut, 2 f shake, word slams scale 115→100%. · SFX: low boom.

### E17 Dolly zoom — needs M, P
- When: realisation, "wait…", tension.
- Layout: background plate behind the matte.
- Anim: background scales 100→125% while the speaker is held the same size (the Vertigo effect) over 30–40 f. · SFX: riser.

### E18 Press front (full screen)
- When: recap, "the news", announcements, end-of-reel summary.
- Layout: newspaper front page — serif masthead (e.g. "The Daily Reel"), dateline row, big headline + italic deck, live halftone photo of the speaker in the centre, 2 side columns that list every chapter/effect with one-line captions, "Continued in the comments".
- Anim: page drops in 8 f; slow push-in 102%. · SFX: paper drop / press thump.

### E19 Paper tear
- When: transition out of any paper/cream full-screen scene.
- Layout: torn-edge mask with a paper curl shadow.
- Anim: the tear sweeps across in 8–10 f, revealing the live scene. · SFX: paper rip.

### E20 Blow away — needs M, P (outro)
- When: the last beat, "gone", "that's it".
- Layout: the speaker disintegrates into dust particles; the clean plate (empty chair/set) remains.
- Anim: sample matte pixels into particles; noise-driven drift sideways with staggered start over 40–50 f. · SFX: sand hiss.
