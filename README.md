# m8c-headless-handheld

Everything for running the [DirtyWave M8](https://dirtywave.com/) **headless** client
([m8c](https://github.com/laamaa/m8c)) on Linux retro handhelds - builds, printable
**controller cheat sheets**, and setup docs. Aimed at Allwinner **H700** devices
(RG35XX* / RG40XX*) running **muOS** or **Knulli**, but much of it is device-agnostic.

## Contents

| Area | What's here |
|------|-------------|
| [🔨 Build](#-build) | Compile `m8c` + the kernel modules for the handheld |
| [🎛️ Cheat sheets](#️-cheat-sheets) | Personalized, printable M8 shortcut cards (+ a web generator) |
| [📚 Docs](#-docs) | Setup & troubleshooting guides |

---

## 🔨 Build

> ⚠️ **Work in progress - being reworked.**

The current Docker-based build (Linux kernel modules + `m8c` for the Allwinner H700) lives at
the repo root: `build.sh`, `Dockerfile.arm64`, `Dockerfile.x86_64`, `build_script.*.sh`.
The original build instructions are preserved in
[`docs/legacy-docker-build.md`](docs/legacy-docker-build.md).

A ready-to-use **MuOS port** (the working reference package) is in
[`examples/muos-m8c-1.7.10/`](examples/muos-m8c-1.7.10) - drop `m8c.sh` + the `m8c`
payload into `ROMS/Ports/` on the device.

The build is based on **[jamesMcMeex/m8c-rg35xx-knulli](https://github.com/jamesMcMeex/m8c-rg35xx-knulli)**.

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

### The original M8 guides these are based on

These are controller-adapted derivatives of two great guides for the standard M8 - go grab the
originals (and give them a star):
- **[LaurentVitalis/M8Guide](https://github.com/LaurentVitalis/M8Guide)** - the fold booklet and the SVG button-pad design.
- **[cengebretson/M8Guide](https://github.com/cengebretson/M8Guide)** - the single-page layout and the firmware 6.5+ shortcut set / EFX reference.

The M8 tracker is a product of [Dirtywave](https://dirtywave.com/); `m8c` is by
[laamaa](https://github.com/laamaa/m8c).


## 📚 Docs

> 🚧 **Placeholder - coming soon.**

Setup and troubleshooting guides (installing on muOS, controls, audio, etc.) will live in
[`docs/`](docs). For now it holds the legacy build notes.

---

## Acknowledgments
- [Dirtywave](https://dirtywave.com/) - the M8 tracker.
- [laamaa](https://github.com/laamaa/m8c) - the `m8c` headless client.
- [jamesMcMeex](https://github.com/jamesMcMeex/m8c-rg35xx-knulli) - the H700 build this started from.
- [LaurentVitalis](https://github.com/LaurentVitalis/M8Guide) & [cengebretson](https://github.com/cengebretson/M8Guide) - the M8 shortcut guides.
- The Knulli & muOS communities.
