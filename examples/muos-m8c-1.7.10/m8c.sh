#!/bin/sh

PORTS_FOLDER=$(realpath "$(dirname "$0")")
GAMEDIR="$PORTS_FOLDER/.m8c"
printf $GAMEDIR
chmod -R +x "$GAMEDIR"/m8c
cd "$GAMEDIR" || exit
insmod cdc-acm.ko
insmod snd-hwdep.ko
insmod snd-usbmidi-lib.ko
insmod snd-usb-audio.ko
pw-loopback -C alsa_input.usb-DirtyWave_M8_14900360-02.analog-stereo -P alsa_output._sys_devices_platform_soc_soc_03000000_codec_mach_sound_card0.stereo-fallback &
HOME="$GAMEDIR" SDL_ASSERT=always_ignore SDL_GAMECONTROLLERCONFIG="19000000010000000100000000010000,Deeplay-keys,a:b3,b:b4,x:b6,y:b5,leftshoulder:b7,rightshoulder:b8,lefttrigger:b13,righttrigger:b14,guide:b11,start:b10,back:b9,dpup:h0.1,dpleft:h0.8,dpright:h0.2,dpdown:h0.4,volumedown:b1,volumeup:b2,leftx:a0,lefty:a1,leftstick:b12,rightx:a2,righty:a3,rightstick:b15,platform:Linux," ./m8c
