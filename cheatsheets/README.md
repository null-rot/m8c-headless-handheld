# M8 Controller Cheat Sheets

Printable Dirtywave M8 shortcut references, adapted so the button icons show **your
handheld's buttons** while the wording keeps the M8's own names (so they still match the
Dirtywave manual). Built for [m8c](https://github.com/laamaa/m8c) on retro handhelds
(muOS / Anbernic etc.), but usable with any controller.

## Generator (recommended)

**[`generator/`](generator/)** is a no-backend web app: pick which button each M8 function
sits on, watch a live preview, then Print / Save PDF. It's the easiest way to get a sheet
that matches your device.

Options:
- **Button mapping** - put EDIT / OPTION / SHIFT / PLAY / QUIT on any button
- **Button legend** - Nintendo / Anbernic, Xbox, or PlayStation face-button names
- **Show on buttons** - device names, M8 function names, or both
- **Format** - single-page (landscape) or pocket fold booklet (portrait)
- **Paper size** - US Letter or A4
- Your setup is saved in the URL + `localStorage`, so a shared link reopens it

Run it locally (`cd cheatsheets && python -m http.server 8080`, then open `/generator/`),
or use the hosted copy if this repo publishes GitHub Pages. See
[`generator/README.md`](generator/README.md) for details and deployment.

## Pre-made cards (default mapping)

These are static, ready-to-print copies using the stock m8c mapping (SHIFT=SELECT,
PLAY=START, EDIT=A, OPTION=B, quit=SELECT+L1):

- **`shortcuts-controller.html`** - single-page landscape card (M8 firmware 6.5+)
- **`controller.html`** - pocket fold booklet
- **`efx.html`** - EFX & synthesis reference (effect codes, FM algorithms, synth params;
  not controller-specific)

## Printing

- **Single-page / EFX:** Landscape, margins None/Minimum, Scale 100%, Background Graphics ON.
- **Fold booklet:** Portrait, margins ~0.25in, Background Graphics ON. Fold on the dotted
  lines, cut the corner marks.
- Paper: US Letter or A4 (the generator has a selector; the static cards are Letter-first
  but fit A4).

## Credits & licensing

These cheat sheets are derivatives of two projects, with thanks to both authors:
- **[LaurentVitalis/M8Guide](https://github.com/LaurentVitalis/M8Guide)** - the original
  design, the SVG button-pad template, and the fold-booklet format (see their repo for the
  original M8-key guide and PDF).
- **[cengebretson/M8Guide](https://github.com/cengebretson/M8Guide)** - the single-page
  layout and the firmware 6.5+ shortcut set / EFX reference.

The M8 tracker is a product of **[Dirtywave](https://dirtywave.com/)**; `m8c` is by
**[laamaa](https://github.com/laamaa/m8c)**.

> Both upstream M8Guide repos ship **without a license** (all rights reserved), and
> cengebretson's is itself based on LaurentVitalis's.
