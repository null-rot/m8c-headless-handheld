# m8c-headless-handheld

Run the DirtyWave M8 tracker's headless client ([m8c](https://github.com/laamaa/m8c)) on a
Linux retro handheld, no laptop needed. This repo has the pre-built downloads, install
instructions, printable controller cheat sheets, and a 3D-printable Teensy 4.1 case, all
aimed at Allwinner **H700** devices (RG35XX* / RG40XX*) running **muOS** or **Knulli**.

In some instances i've collated other people's work or rewritten it to suit my needs; credit
is given where it's due below, and my aim throughout is just to keep the information findable
in one place.

## Contents

| Area | What's here |
|------|-------------|
| [📥 Download](#-download) | Pre-built `m8c` for muOS and Knulli |
| [🎛️ Cheat sheets](#️-cheat-sheets) | Personalised, printable M8 shortcut cards + a web generator |
| [🧰 3D Prints](#-3d-prints) | Teensy 4.1 case & device mounts |
| [📚 Docs](#-docs) | Install guide & troubleshooting |
| [🔨 Building it yourself](#-building-it-yourself) | Compile from source, locally or in the cloud |

---

## 📥 Download

**[Releases](../../releases)** has ready-to-install `m8c` packages for both platforms:

- **`m8c-muos-*.zip`** - for muOS (RG35XX* / RG40XX* etc.)
- **`m8c-knulli-*.zip`** - for Knulli

Each zip has the `m8c.sh` launcher plus an `m8c/` folder with the binary and kernel modules.
Where those two pieces go differs between muOS and Knulli, so check
**[docs/install.md](docs/install.md)** before copying anything to your SD card.

Every release also notes which muOS version and device it was tested on.

## 🎛️ Cheat sheets

Printable M8 shortcut references, adapted so the button icons show **your handheld's buttons**
while the wording keeps the M8's own names (so they still match the Dirtywave manual).

### ▶ [Open the cheat-sheet generator](https://null-rot.github.io/m8c-headless-handheld/cheatsheets/generator/)

Pick which button each M8 function sits on, watch a live preview, then Print / Save PDF.
Choose single-page or fold booklet, US Letter or A4, and your device's button legend.

Or print a ready-made copy (stock mapping):
- [Single-page card](https://null-rot.github.io/m8c-headless-handheld/cheatsheets/shortcuts-controller.html) (firmware 6.5+, landscape)
- [Pocket fold booklet](https://null-rot.github.io/m8c-headless-handheld/cheatsheets/controller.html)
- [EFX & synthesis reference](https://null-rot.github.io/m8c-headless-handheld/cheatsheets/efx.html)

These are controller-adapted derivatives of two great guides for the standard M8 - go grab the
originals (and give them a star): **[LaurentVitalis/M8Guide](https://github.com/LaurentVitalis/M8Guide)**
(the fold booklet and SVG button-pad design) and **[cengebretson/M8Guide](https://github.com/cengebretson/M8Guide)**
(the single-page layout and the firmware 6.5+ shortcut set / EFX reference).

## 🧰 3D Prints

<p align="center">
  <img src="3d-prints/images/teensy1.jpg" alt="Teensy 4.1 case fitted to the handheld" width="480">
</p>

A two-part snap-fit case for the Teensy 4.1, with a heatsink cutout, honeycomb-vented lid,
and microSD access. Parametric OpenSCAD source plus ready-to-print STLs for a few variants
live in [`3d-prints/`](3d-prints).

## 📚 Docs

Setup and troubleshooting live in [`docs/`](docs) - start with
**[install.md](docs/install.md)** for where each file goes on muOS/Knulli, controls, and
common fixes.

## 🔨 Building it yourself

Prefer to compile `m8c` from source instead of using a Release? See
**[docs/build.md](docs/build.md)** for the local Docker build and the cloud build workflow
that runs the same thing on GitHub Actions.

---

## Acknowledgments
- [Dirtywave](https://dirtywave.com/) - the M8 tracker.
- [laamaa](https://github.com/laamaa/m8c) - the `m8c` headless client.
- [jamesMcMeex](https://github.com/jamesMcMeex/m8c-rg35xx-knulli) - the H700 build this started from.
- [LaurentVitalis](https://github.com/LaurentVitalis/M8Guide) & [cengebretson](https://github.com/cengebretson/M8Guide) - the M8 shortcut guides.
- The Knulli & muOS communities.
