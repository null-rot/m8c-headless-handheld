Pre-built `m8c` v__M8C_VERSION__ packages for Allwinner H700 handhelds (RG35XX* / RG40XX*),
compiled straight from source by [this workflow run](__RUN_URL__).

📖 **Install instructions:** [docs/install.md](__INSTALL_URL__)
🎛️ **Controller cheat sheets:** [generator + printable cards](https://null-rot.github.io/m8c-headless-handheld/cheatsheets/generator/)

## Status
- ✅ **muOS** - working. Tested on muOS `__MUOS_VERSION__` on an **__MUOS_DEVICE__**.
- ⚠️ **Knulli** - __KNULLI_STATUS__

## Where to put the files

### muOS
Standard PortMaster layout - the launcher and its payload go in different places:
- `m8c.sh` → `ROMS/Ports/` (this is what muOS lists and launches from)
- the `m8c/` folder → the separate, top-level `Ports/` folder (**not** inside `ROMS/`)

Then do a Content Refresh (or reboot) and launch **m8c** from Ports.

### Knulli
- Both `m8c.sh` and the `m8c/` folder → `roms/ports/` (lowercase), together

Full details, controls, and troubleshooting: [docs/install.md](__INSTALL_URL__)
