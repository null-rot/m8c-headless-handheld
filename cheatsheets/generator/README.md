# M8 Controller Cheat Sheet Generator

A no-backend web app that generates a **personalized** M8 shortcuts cheat sheet: pick which
button on your handheld each M8 function sits on, see a live preview, and **Print / Save PDF**.
Built for [m8c](https://github.com/laamaa/m8c) on retro handhelds (muOS / Anbernic etc.), but
works for any controller.

**▶ Live: <https://null-rot.github.io/m8c-headless-handheld/cheatsheets/generator/>**

Options: button mapping (any function on any button), device legend (Nintendo / Xbox /
PlayStation), show device names / M8 names / both, single-page or fold booklet, US Letter or A4.
Your setup is saved in the URL + `localStorage`, so a shared link reopens it.

## How it works
- **`pad.js`** draws a full gamepad and `applyPadConfig()` assigns the M8 functions
  (EDIT / OPTION / SHIFT / PLAY / QUIT) onto whichever controls you pick, so the highlight
  system lights up *your* buttons. D-pad = directions (fixed).
- **`data.js`** is the single-page shortcut set (M8 firmware 6.5+); **`data-fold.js`** is the
  curated fold-booklet set.
- **`render.js`** builds the sheet, generates the "Your Controls" legend, and dispatches by
  format (single / fold) and paper size.
- **`sheet.css`** (single-page), **`fold.css`** (booklet), **`pad.css`** (pad highlights),
  **`app.css`** (configurator UI).

## Printing
- **Single-page:** Landscape, margins None/Minimum, Scale 100%, Background Graphics ON.
- **Fold booklet:** Portrait, ~0.25in margins, Background Graphics ON. Fold on the dotted
  lines, cut the corner marks.

The print settings note in the app updates for your chosen format and paper size.

## Credits
Shortcut data & layout after [LaurentVitalis/M8Guide](https://github.com/LaurentVitalis/M8Guide)
and [cengebretson/M8Guide](https://github.com/cengebretson/M8Guide); see `../README.md`.
