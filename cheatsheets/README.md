# M8 Controller Cheat Sheets

Printable Dirtywave M8 shortcut references, adapted so the button icons show **your
handheld's buttons** while the wording keeps the M8's own names (so they still match the
Dirtywave manual). Built for [m8c](https://github.com/laamaa/m8c) on retro handhelds
(muOS / Anbernic etc.), but usable with any controller.

## Generator (recommended)

**▶ [Open the generator](https://null-rot.github.io/m8c-headless-handheld/cheatsheets/generator/)** -
pick which button each M8 function sits on, watch a live preview, then Print / Save PDF. It's
the easiest way to get a sheet that matches your device.

Options:
- **Button mapping** - put EDIT / OPTION / SHIFT / PLAY / QUIT on any button
- **Button legend** - Nintendo / Anbernic, Xbox, or PlayStation face-button names
- **Show on buttons** - device names, M8 function names, or both
- **Format** - single-page (landscape) or pocket fold booklet (portrait)
- **Paper size** - US Letter or A4
- Your setup is saved in the URL + `localStorage`, so a shared link reopens it

## Pre-made cards (this build's mapping)

Ready-to-print copies using this repo's mapping (SHIFT=R1, PLAY=START, EDIT=A, OPTION=B,
quit=hold R1+SELECT) - see [`docs/install.md`](../docs/install.md) for the muOS config.ini
these match. If your controls differ, use the generator above instead.

- [Single-page card](https://null-rot.github.io/m8c-headless-handheld/cheatsheets/shortcuts-controller.html) (M8 firmware 6.5+, landscape)
- [Pocket fold booklet](https://null-rot.github.io/m8c-headless-handheld/cheatsheets/controller.html)
- [EFX & synthesis reference](https://null-rot.github.io/m8c-headless-handheld/cheatsheets/efx.html) (effect codes, FM algorithms, synth params; not controller-specific)

## Printing

- **Single-page / EFX:** Landscape, margins None/Minimum, Scale 100%, Background Graphics ON.
- **Fold booklet:** Portrait, margins ~0.25in, Background Graphics ON. Fold on the dotted
  lines, cut the corner marks.
- Paper: US Letter or A4 (the generator has a selector; the static cards are Letter-first
  but fit A4).

## Credits

These cheat sheets are derivatives of two projects, with thanks to both authors:
- **[LaurentVitalis/M8Guide](https://github.com/LaurentVitalis/M8Guide)** - the original
  design, the SVG button-pad template, and the fold-booklet format (see their repo for the
  original M8-key guide and PDF).
- **[cengebretson/M8Guide](https://github.com/cengebretson/M8Guide)** - the single-page
  layout and the firmware 6.5+ shortcut set / EFX reference.

The M8 tracker is a product of **[Dirtywave](https://dirtywave.com/)**; `m8c` is by
**[laamaa](https://github.com/laamaa/m8c)**.
