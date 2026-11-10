# Effects Showcase Mode — "20 effects in 20 seconds"

A second output format for this skill. Learned from a 26 s, 1:1, 30 fps reel titled
"20 video effects in 20 seconds, built by Claude": one uncut talking-head take, a new
code-built effect roughly every second, a persistent chapter panel ticking through the list,
and a comment-keyword CTA in the middle.

Use it when the user asks for an effects showcase, "N effects in N seconds", a demo of what
code-built editing can do, or a lead-magnet reel ("comment X to get these").
The individual effects are also available in normal chapter reels as scene-library codes
**E01–E20** (see `scene-library.md`).

The golden rule still holds: **the user picks which effects and in what order.** Offer the
default 20 below; never build the list without their confirmation.

---

## 1. Format spec

| Element | Spec |
|---|---|
| Canvas | 1080×1080 (reference) or 1080×1920 (this skill's default). 30 fps, 22–30 s. |
| Base footage | One uncut take. Effects sit on top of / around it; the voice never cuts. |
| Chapter panel | 1:1 → right side, ~28 % width, full height minus 24 px margins. 9:16 → lower half under the speaker, 2 columns. Glass or solid surface (reference used forest green `#1F3A2E`; in this skill's palette use glass `rgba(20,20,28,0.55)` + blur). Header `IN THIS VIDEO` (mono, tiny, letter-spaced) + counter `07 / 20` right-aligned. One row per effect `01 Live cursor`; the CTA row gets `•` instead of a number. Active row = white pill, dark text, switches on the exact frame the effect starts. Footer button `+ 40 more effects`, turns accent (reference: gold `#C9A24A`; here: cyan→blue gradient) after the CTA. |
| Hook | 0–1.7 s: two white rounded sticker lines top-left: `20 video effects in 20 seconds` / `built by **Claude**` (special word in Garamond italic). The first effect (Live cursor) runs under the hook so the visual lands within 1 s. |
| Rhythm | 0.8–1.3 s per effect, each starting on the word that names it. CTA holds ~4 s at ~1/3 of the runtime. Full-screen takeovers (Day dial, Letter dive, Banknote, Impact frame, Press front) break the A-roll pattern roughly every 4–5 s. |
| Sound | One SFX per effect (see the E-code recipes). Voice stays on top; no music needed. |
| Ending | Press front (recap newspaper that lists every effect) → Paper tear → Blow away to the empty set. |

## 2. Reference timeline

| # | t (s) | Effect | E-code |
|---|---|---|---|
| 01 | 0.0–1.2 | Live cursor | E01 |
| 02 | 1.2–2.3 | Clone row | E02 |
| 03 | 2.3–3.2 | Day dial | E03 |
| 04 | 3.3–4.4 | Predict keys | E04 |
| 05 | 4.6–5.5 | Orbit ring | E05 |
| 06 | 5.6–6.4 | Code body | E06 |
| 07 | 6.6–7.5 | Post wall | E07 |
| 08 | 7.6–8.4 | Letter dive | E08 |
| • | 8.6–12.6 | Comment drop (CTA) | E00 |
| 09 | 12.6–13.9 | Layer explode | E09 |
| 10 | 14.0–14.8 | Sketch words | E10 |
| 11 | 15.0–15.9 | Blade slice | E11 |
| 12 | 16.0–16.9 | Head stack | E12 |
| 13 | 17.0–17.9 | Rack focus | E13 |
| 14 | 18.3–19.1 | Banknote | E14 |
| 15 | 19.3–20.2 | Voice note | E15 |
| 16 | 20.3–20.8 | Impact frame | E16 |
| 17 | 21.0–22.4 | Dolly zoom | E17 |
| 18 | 22.6–23.9 | Press front | E18 |
| 19 | 24.0–24.3 | Paper tear | E19 |
| 20 | 24.3–26.0 | Blow away | E20 |

The reference's own one-line captions (they appear on the Press front page), useful for panel
tooltips and the recap: *Live cursor – a cursor named Claude moves the man. Clone row – six
more, all talking. Day dial – the head is the hub, the room a printed clock face. Predict keys –
a keyboard types the name, three real suggestions. Orbit ring – type goes round the head, behind
it and in front. Code body – the code that made this reel. Layer explode – the frame in its real
sheets. Sketch words – one word drawn in pencil. Blade slice – one white hairline, two halves
slide apart, still talking. Head stack – tiles pile on a moving head. Rack focus – the room goes
soft.*

## 3. Workflow in showcase mode

Same 5 steps as the main skill, with these changes:

1. **Shoot / raw cut** — The script names each effect as it appears ("…clone row, day dial,
   predict keys…"). Do **not** cut inside the list; jump cuts break the "one take" illusion.
   Ask the user for **2 s of the empty set** (same framing, no person) — needed by E17 and E20.
   Pre-process once (see "Pre-processing" in `SKILL.md`): person matte, face track,
   audio amplitude.
2. **Planning doc** — One row per effect instead of per sentence. Each row: effect name,
   the word it starts on, timecode, and a dropdown of E-codes so the user can swap or reorder.
   Ask for the CTA keyword and the footer text ("+ 40 more effects").
3. **Build** — `effects.ts` = array `{code, label, from, durationInFrames, sfx}`. That one array
   drives the panel, the `<Sequence>`s, the cue sheet and the Press front copy, so they never
   disagree. Layer order: clean plate → behind-head elements → person matte → front elements →
   UI overlays → chapter panel → captions.
4. **Review** — Typical fixes: an effect starts a word too late, the panel highlight lags,
   a takeover lasts too long. Fix all in one pass.
5. **Sound** — Cue sheet straight from `effects.ts`.

## 4. Ready-to-use build prompt

```
Build a Remotion project ([1080x1080 | 1080x1920], 30fps) from my talking-head clip [clip.mp4],
word-timed transcript [words.json], person matte [matte/], face track [face.json], audio
amplitude [amp.json] and clean plate [plate.png]. Keep the original video and audio uncut.
Use the premium-chapter-reel design system. Add the "IN THIS VIDEO" chapter panel with an
NN/20 counter, active row as a white pill, footer "+ 40 more effects" switching to the accent
after the CTA. Show the hook stickers "20 video effects in 20 seconds / built by Claude" for the
first 1.7s. Then run these effects, each starting on the word that names it, following the
E-code recipes in scene-library.md: [E01, E02, E03, E04, E05, E06, E07, E08, E00 (keyword:
EDIT), E09, E10, E11, E12, E13, E14, E15, E16, E17, E18, E19, E20]. 0.8–1.3s per effect, CTA
~4s. One SFX per effect from the recipes. Render a preview MP4 and a cue sheet.
```

## 5. Rules

- The voice never cuts; only the effect changes.
- The panel's active row and the effect on screen change on the same frame.
- Anything that goes *behind* the speaker (orbit back half, dial, post wall, clone row, dolly
  background, blow away) must use the person matte — never fake it with a flat overlay.
- E17 and E20 need a real clean plate. If the user has none, swap them for other effects
  rather than hallucinating a background.
- Only use the user's own face, footage, brand and copy; the techniques are generic. No fake
  follower counts or reviews — numbers in E07/E14 come from the user.
