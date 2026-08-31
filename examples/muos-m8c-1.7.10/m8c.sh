#!/bin/bash
# m8c launcher for muOS (self-contained: keep this script and the .m8c folder together
# in ROMS/Ports/). Controls are set in .m8c/.local/share/m8c/config.ini.

XDG_DATA_HOME=${XDG_DATA_HOME:-$HOME/.local/share}

if [ -d "/opt/system/Tools/PortMaster/" ]; then
  controlfolder="/opt/system/Tools/PortMaster"
elif [ -d "/opt/tools/PortMaster/" ]; then
  controlfolder="/opt/tools/PortMaster"
elif [ -d "$XDG_DATA_HOME/PortMaster/" ]; then
  controlfolder="$XDG_DATA_HOME/PortMaster"
else
  controlfolder="/roms/ports/PortMaster"
fi

source $controlfolder/control.txt
[ -f "${controlfolder}/mod_${CFW_NAME}.txt" ] && source "${controlfolder}/mod_${CFW_NAME}.txt"

get_controls

GAMEDIR="$(realpath "$(dirname "$0")")/.m8c"
CUR_TTY="/dev/tty0"

# Keep m8c's config/data inside the port folder so config.ini is read + persists here
export HOME="$GAMEDIR"
export XDG_DATA_HOME="$GAMEDIR/.local/share"
export XDG_CONFIG_HOME="$GAMEDIR/.config"
export LD_LIBRARY_PATH="/usr/lib/:/usr/lib/aarch64-linux-gnu/:$LD_LIBRARY_PATH"

> "$GAMEDIR/log.txt" && exec > >(tee "$GAMEDIR/log.txt") 2>&1
cd "$GAMEDIR"

$ESUDO chmod 666 $CUR_TTY
printf "\033c" > $CUR_TTY
printf "Starting m8c...\n" > $CUR_TTY

# Kernel modules for the M8's USB serial + audio (needs root)
$ESUDO insmod ./cdc-acm.ko 2>/dev/null || true
$ESUDO insmod ./snd-hwdep.ko 2>/dev/null || true
$ESUDO insmod ./snd-usbmidi-lib.ko 2>/dev/null || true
$ESUDO insmod ./snd-usb-audio.ko 2>/dev/null || true

# Route M8 audio to the device speakers (background).
# NOTE: the input source below is tied to one M8's USB serial number - if audio is
# silent, connect your M8 and check `pw-cli list-objects | grep DirtyWave` for its name.
pw-loopback -C alsa_input.usb-DirtyWave_M8_14900360-02.analog-stereo -P alsa_output._sys_devices_platform_soc_soc_03000000_codec_mach_sound_card0.stereo-fallback &
LOOPBACK_PID=$!

$ESUDO chmod +x "$GAMEDIR/m8c"
# No hardcoded SDL_GAMECONTROLLERCONFIG: let muOS's own controller mapping apply so the
# config.ini button numbers line up with the real buttons.
SDL_ASSERT=always_ignore ./m8c

kill $LOOPBACK_PID 2>/dev/null || true

pm_finish
printf "\033c" > $CUR_TTY
