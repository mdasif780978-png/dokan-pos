# Planning Document Template

Build as a single self-contained `planning-doc.html` the user opens in a browser.

## Layout (one row per spoken line)

| Your notes + recommended designs | Script of the segment |
|---|---|
| **Notes box** (empty textarea, user writes the plan in plain words) | `L01` · `0:00.1 – 0:04.2` |
| **Design A / B / C / D** — 4 clickable cards from `scene-library.md`, each with a one-line description and a tiny mock preview | **"Getting hired as a video editor in 2026 comes down to three simple steps."** |
| Selected: `B` | ▶ play this segment |

## Rules
- Split lines at natural sentence breaks; 2–6 s per row.
- Recommend designs that match the *meaning* of the line (money → S04, "three steps" → S02, shock line → S08, quote → F04, number → S05).
- Code-built effects can be options too (time → E03, money → E14, typing → E04, "comment X" → E00, last line → E20). Mark the ones that need a matte, face track or clean plate so the user knows.
- **Showcase mode**: one row per effect instead of per sentence — effect name, the word it starts on, timecode, and a dropdown of E-codes to swap or reorder. Ask for the CTA keyword at the top.
- Always include one "A-roll + caption only" option so not every line gets a graphic.
- Mark the first 1–3 s row as **HOOK** and remind: Speaker + Text + Visual.
- A **Copy plan** button exports all rows as plain text:
  `L01 | 0:00.1–0:04.2 | <script> | Design: B | Notes: <user text>`
- The user pastes that export back into Claude to start Step 3.

## Questions to print at the top of the doc (for the user)
1. What makes a viewer want to keep watching this line?
2. What can I *show* that proves or illustrates exactly what I'm saying?
3. Does this line break the pattern? (→ punch-in, desaturate, reverb)
4. Is this a chapter start? (→ badge + chapter name)
5. Has the screen changed in the last 3 seconds?
