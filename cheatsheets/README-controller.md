# M8 Shortcuts - Controller Editions (for m8c on muOS / Anbernic)

Printable M8 cheat sheets adapted so the button icons show a **handheld gamepad**
instead of the M8's own keys - for people driving [m8c](https://github.com/laamaa/m8c)
from a retro handheld (Anbernic / muOS etc.) rather than a real M8.

## Button mapping used throughout

| M8 function | Controller button |
|-------------|-------------------|
| SHIFT       | **SELECT** (or L2) |
| PLAY        | **START** |
| EDIT        | **A** |
| OPTION      | **B** |
| Up/Down/Left/Right | **D-pad** |
| *(quit m8c)* | **hold SELECT + L1** |

On the icons: **the graphic shows your handheld's buttons; the wording keeps the M8's
own names** (so it still matches the Dirtywave M8 manual). Highlight meanings: solid =
tap, ⬇ = hold, ① / ② = press in sequence, **×2** badge = double-tap.

## The cards

### 1. `controller.html` - pocket fold booklet
- Based on **[LaurentVitalis/M8Guide](https://github.com/LaurentVitalis/M8Guide)**.
- Tiny 4-page booklet that folds to fit an M8 case; a curated, essentials subset.
- Files: `controller.html`, `controller.css`, `script-controller.js`.
- **Print:** Portrait, margins **0.25″** all around, Background Graphics **ON**.
  Print, fold on the dotted lines, cut the corner marks.

### 2. `shortcuts-controller.html` - single-page reference (recommended)
- Based on **[cengebretson/M8Guide](https://github.com/cengebretson/M8Guide)** (M8 firmware **6.5+**).
- One landscape page, 3 columns, far more shortcuts (Live Mode, Sample Editor,
  Instrument Pool, Transpose, etc.) and much larger, more legible icons/labels.
  Grey-shaded rows = selection-mode-only commands.
- Files: `shortcuts-controller.html`, `css/shortcuts-controller.css`,
  `js/data-controller.js`, `js/shortcuts-script.js`.
- **Print:** Layout **Landscape**, Paper **Letter**, Margins **None/Minimum**,
  Scale **100%** (not "fit"), Background Graphics **ON**, Headers/Footers **OFF**.

### 3. `efx.html` - EFX & synthesis reference (bundled as-is)
- Verbatim from **cengebretson/M8Guide**. A data reference for EFX command codes,
  FM algorithms, Wavsynth/Macrosynth/Hypersynth parameters, and Table modes.
- **Not controller-specific** - it contains no button combos, so there is nothing to
  remap; it rides along as a useful companion.
- Files: `efx.html`, `css/efx.css`.

## What was changed for the controller editions
- Replaced the M8 8-key pad SVG with a Nintendo-style handheld pad (D-pad, A/B/X/Y,
  SELECT/START, L1) using the **same** highlight-token system, so all shortcut data
  works unchanged.
- Added the `l1` token + the **Quit m8c = SELECT + L1** entry.
- Dropped the M8's **touchscreen** parameter shortcuts (m8c has no touchscreen).
- Added a "Your Controls" legend mapping M8 functions to controller buttons.

## Attribution & licensing
These are **derivatives**. The upstream repos
([LaurentVitalis/M8Guide](https://github.com/LaurentVitalis/M8Guide),
[cengebretson/M8Guide](https://github.com/cengebretson/M8Guide)) ship **without a
license file** (all rights reserved), and cengebretson's is itself based on
LaurentVitalis's work. The M8 is a product of **Dirtywave**. **Credit both authors and
seek their permission before distributing these editions publicly.**
