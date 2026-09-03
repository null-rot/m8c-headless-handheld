# Installing m8c on your handheld

Where to put each file for muOS and Knulli, and how the controls work on each. Both
platforms use the same two pieces - an `m8c.sh` launcher and an `m8c/` folder holding the
binary, kernel modules, and (on muOS) its config - just dropped in different folders.

Get the files either from a [Release](../../../releases) (pre-built) or by building them
yourself - see the main [README](../README.md#-build).

## muOS

Copy **both** `m8c.sh` and the **`m8c`** folder into `ROMS/Ports/` on the card (keep them
together), then do a Content Refresh (or reboot) and launch **m8c** from Ports.

### Controls
| M8 function | Button |
|-------------|--------|
| EDIT   | A |
| OPTION | B |
| SHIFT  | R1 |
| PLAY   | START |
| Navigate / change values | D-pad |
| **Quit m8c** | **hold R1 + SELECT** |

L1, L2 and R2 are unused. The launcher does **not** hardcode a controller mapping, so
muOS's own device mapping applies; m8c's own button assignments live in
[`examples/muos-m8c-1.7.10/m8c/.local/share/m8c/config.ini`](../examples/muos-m8c-1.7.10/m8c/.local/share/m8c/config.ini)
(SDL button numbers → M8 functions) - this is the file baked into every build, so edit that
file in the repo (and rebuild) to change the defaults, or edit the copy on the card directly
for a one-off change.

### Audio
The `pw-loopback` line in `m8c.sh` is tied to one M8's USB serial number. If you get video
but no audio, connect your M8 and run `pw-cli list-objects | grep DirtyWave` on-device to
find your M8's input name, then update that line.

## Knulli

Copy **both** `m8c.sh` and the **`m8c`** folder into `roms/ports/` (lowercase - this is the
`SHARE` volume, or the second SD card if you're running a two-card Knulli setup), then
launch **m8c** from Ports.

Optionally, add an entry for it to `gamelist.xml` so it shows up with a proper name/icon in
the Knulli UI instead of just the raw filename - purely cosmetic.

### Controls
Unlike muOS, the Knulli launcher hardcodes an `SDL_GAMECONTROLLERCONFIG` string for the
device (inherited from the original jamesMcMeex build this project started from, unchanged)
rather than shipping a `config.ini`. That means button assignments come from m8c's own
compiled-in defaults reacting to that mapping, not from a file you can just edit - if the
controls feel wrong on your Knulli device, that's the next thing to sort out (open an issue,
or compare against the muOS `config.ini` approach above).

### Audio
Same `pw-loopback` caveat as muOS above - the line in `m8c.sh` is tied to one M8's USB
serial number and needs updating for yours.

## Common issues

**"Permission denied" on launch** - make both files executable:
```sh
chmod +x m8c.sh
chmod +x m8c/m8c
```

**Kernel modules won't load** - fix their permissions:
```sh
chmod 644 m8c/*.ko
```

**No audio, or "Failed to start PipeWire loopback"** - make sure the M8 is connected via USB
*before* launching m8c, and check the `pw-loopback` serial number as above. Try
unplugging/reconnecting the M8 if it still doesn't come through.
