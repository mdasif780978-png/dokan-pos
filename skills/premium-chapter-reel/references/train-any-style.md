# How to Train Claude on ANY Editing Style (the method behind this skill)

You only need two things: **a big reference folder** and **a full breakdown of the style**.

## 1. Reference folder
- Collect 10–20 edits in the exact style you want (the video used 14).
- Pick only the ones you like most — quality over quantity.
- Put them in one folder: `references/videos/`.

## 2. Style breakdown board (the part that makes the difference)
1. Open Figma (or Canva / Miro). Split the screen: reference video on the left, board on the right.
2. Watch every reference. Every time you see a good design moment, **screenshot it onto the board** — text scenes, on-screen pops, full-screen animations, transitions. Aim for 100+ images (the video had 120+).
3. Define the style's **keys** (pillars). For this style: captions, chapter listicles, UI pops/counters, hooks, full-screen animations.
4. Group screenshots under each key.
5. Pull one example aside per key and annotate it: fonts, sizes, placement, colors, strokes, blur, animation type, timing. Use tables for keys with many variants.
6. Export the board (PDF/PNG) so Claude can read it.

## 3. The training prompt
Upload the reference videos + the board, then:

> First, break down the reference videos into a word-by-word transcript and a frame-by-frame breakdown. Then study three things:
> 1. **Design principles** of every scene — colors, layout, effects, everything.
> 2. **Animation logic** — what animation each element uses (pop-up fade, blur reveal, slide…).
> 3. **Placement and timing** of each animation relative to the script.
> Use the board as a deep analysis of the design principles of this style. Learn everything there is to this editing style so you can recreate it, and turn it all into a skill.

## 4. What the finished skill pack should contain
- **Rule book** — exact font sizes, spacing, layout grids, animation curves, speeds.
- **Lookbook** — what the style looks like: shapes, colors, gradients, icon style, assets.
- **Animation reference folder** — one entry per animation found (the video had ~200): screenshot, keyframe sheet, written breakdown of how it moves.

## 5. Test it
Edit one real video with the 5-step workflow (cut → plan → build → review → sound). Every review fix that is about *style* (not content) goes back into the rule book.
