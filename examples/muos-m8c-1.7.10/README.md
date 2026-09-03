# m8c for muOS (v1.7.10) - example port

A ready-to-run m8c port for muOS on Allwinner H700 handhelds (RG35XX* / RG40XX*).

## Install
Standard PortMaster layout - the launcher and its payload go in **two different places**:
- `m8c.sh` → `ROMS/Ports/` (this is what muOS lists and launches from)
- the **`m8c`** folder → the separate, top-level `Ports/` folder (**not** inside `ROMS/`)

Then do a Content Refresh (or reboot) and launch **m8c** from Ports.

## Controls
| M8 function | Button |
|-------------|--------|
| EDIT   | A |
| OPTION | B |
| SHIFT  | R1 |
| PLAY   | START |
| Navigate / change values | D-pad |
| **Quit m8c** | **hold R1 + SELECT** |

L1, L2 and R2 are unused.

Controls live in [`m8c/.local/share/m8c/config.ini`](m8c/.local/share/m8c/config.ini)
(SDL button numbers -> M8 functions). To change them, edit that file; the launcher does
**not** hardcode a controller mapping, so muOS's own mapping applies.

> Note: quit is always "hold SHIFT + one button" in m8c, and quit's button must be a real
> button (L2/R2 are analog triggers and can't be the quit button). That's why quit is R1 + SELECT.

## Audio note
The `pw-loopback` line in `m8c.sh` is tied to one M8's USB serial number. If you get video
but no audio, connect your M8 and run `pw-cli list-objects | grep DirtyWave` to find your
M8's input name, then update that line.
