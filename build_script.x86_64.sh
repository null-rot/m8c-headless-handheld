#!/bin/bash

set -e

# Ensure we're in the right directory
cd /build

# Create output directories (in case they weren't created by Docker)
mkdir -p /build/compiled/knulli/m8c /build/compiled/muos/m8c/.local/share/m8c

# Ensure toolchain is in PATH
echo "Configuring toolchain..."
export XTOOL=$(realpath aarch64-buildroot-linux-gnu_sdk-buildroot)
export XHOST=aarch64-buildroot-linux-gnu
export PATH=$PATH:$XTOOL/bin
export SYSROOT=$XTOOL/$XHOST/sysroot
export PKG_CONFIG_PATH=$SYSROOT/usr/lib/pkgconfig
export PKG_CONFIG_SYSROOT_DIR=$SYSROOT

# Build m8c
echo "Building m8c..."
cd /build/m8c
make CC=$XHOST-gcc VERBOSE=1
if [ $? -ne 0 ]; then
  echo "m8c build failed"
  exit 1
fi

# Build kernel modules
echo "Building kernel modules..."
cd /build/linux-$LINUX_KERNEL_VERSION

echo "Configuring kernel..."
cp /build/linux-sunxi64-legacy.config .config
sed -i 's/# CONFIG_SND_USB_AUDIO is not set/CONFIG_SND_USB_AUDIO=m/g' .config
sed -i 's/# CONFIG_USB_ACM is not set/CONFIG_USB_ACM=m/g' .config

sed -i 's/^YYLTYPE yylloc;$/extern YYLTYPE yylloc;/g' scripts/dtc/dtc-lexer.lex.c_shipped
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- olddefconfig
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- modules_prepare

echo "Building kernel modules..."
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- M=drivers/usb/class
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- M=sound/core
make ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- M=sound/usb

# Collect files
echo "Collecting files..."

# Copy kernel modules into both packages
for module in cdc-acm.ko snd-hwdep.ko snd-usbmidi-lib.ko snd-usb-audio.ko; do
  MODULE_PATH=$(find /build/linux-$LINUX_KERNEL_VERSION -name "$module" | head -n1)
  if [ -n "$MODULE_PATH" ]; then
    cp -v "$MODULE_PATH" /build/compiled/knulli/m8c/
    cp -v "$MODULE_PATH" /build/compiled/muos/m8c/
  else
    echo "Warning: $module not found"
  fi
done

# Copy m8c executable into both packages
if [ -f "/build/m8c/m8c" ]; then
  cp -v /build/m8c/m8c /build/compiled/knulli/m8c/
  cp -v /build/m8c/m8c /build/compiled/muos/m8c/
  echo "Copied m8c executable"
else
  echo "Error: m8c executable not found"
  exit 1
fi

# --- Knulli package: launcher script ---
sed "s/\$LINUX_KERNEL_VERSION/$LINUX_KERNEL_VERSION/" <<'EOF' >/build/compiled/knulli/m8c.sh
#!/bin/sh

export HOME=$(dirname $(realpath $0))/m8c
cd $HOME

# Ensure m8c is executable
chmod +x ./m8c

cp *.ko /lib/modules/$LINUX_KERNEL_VERSION
depmod
modprobe -a cdc-acm snd-hwdep snd-usbmidi-lib snd-usb-audio

pw-loopback -C alsa_input.usb-DirtyWave_M8_14900360-02.analog-stereo -P alsa_output._sys_devices_platform_soc_soc_03000000_codec_mach_sound_card0.stereo-fallback &

SDL_GAMECONTROLLERCONFIG="19000000010000000100000000010000,Deeplay-keys,a:b3,b:b4,x:b6,y:b5,leftshoulder:b7,rightshoulder:b8,lefttrigger:b13,righttrigger:b14,guide:b11,start:b10,back:b9,dpup:h0.1,dpleft:h0.8,dpright:h0.2,dpdown:h0.4,volumedown:b1,volumeup:b2,leftx:a0,lefty:a1,leftstick:b12,rightx:a2,righty:a3,rightstick:b15,platform:Linux," ./m8c

kill $(jobs -p)
EOF

chmod +x /build/compiled/knulli/m8c.sh

# --- muOS package: launcher + config.ini come from the validated template
# (examples/muos-m8c-1.7.10 in the repo) - only the binary/modules above are fresh. ---
cp /build/templates/muos/m8c.sh /build/compiled/muos/m8c.sh
cp /build/templates/muos/m8c/.local/share/m8c/config.ini /build/compiled/muos/m8c/.local/share/m8c/config.ini
chmod +x /build/compiled/muos/m8c.sh

#
# Final checks and summary
#
check_build_output() {
  local error_count=0
  local warning_count=0
  local modules=("cdc-acm.ko" "snd-hwdep.ko" "snd-usbmidi-lib.ko" "snd-usb-audio.ko")

  echo "--- Knulli package (/build/compiled/knulli) ---"
  if [ -f "/build/compiled/knulli/m8c/m8c" ]; then
    file_type=$(file /build/compiled/knulli/m8c/m8c)
    if [[ $file_type == *"ELF 64-bit LSB executable, ARM aarch64"* ]]; then
      echo "OK   m8c executable present and valid"
    else
      echo "FAIL m8c executable present but may be invalid: $file_type"
      ((error_count++))
    fi
  else
    echo "FAIL m8c executable missing"
    ((error_count++))
  fi
  for module in "${modules[@]}"; do
    if [ -f "/build/compiled/knulli/m8c/$module" ]; then
      echo "OK   kernel module $module present"
    else
      echo "WARN kernel module $module missing"
      ((warning_count++))
    fi
  done
  if [ -f "/build/compiled/knulli/m8c.sh" ] && grep -q "SDL_GAMECONTROLLERCONFIG" "/build/compiled/knulli/m8c.sh"; then
    echo "OK   knulli m8c.sh present and valid"
  else
    echo "FAIL knulli m8c.sh missing or invalid"
    ((error_count++))
  fi

  echo "--- muOS package (/build/compiled/muos) ---"
  if [ -f "/build/compiled/muos/m8c/m8c" ]; then
    file_type=$(file /build/compiled/muos/m8c/m8c)
    if [[ $file_type == *"ELF 64-bit LSB executable, ARM aarch64"* ]]; then
      echo "OK   m8c executable present and valid"
    else
      echo "FAIL m8c executable present but may be invalid: $file_type"
      ((error_count++))
    fi
  else
    echo "FAIL m8c executable missing"
    ((error_count++))
  fi
  for module in "${modules[@]}"; do
    if [ -f "/build/compiled/muos/m8c/$module" ]; then
      echo "OK   kernel module $module present"
    else
      echo "WARN kernel module $module missing"
      ((warning_count++))
    fi
  done
  if [ -f "/build/compiled/muos/m8c.sh" ] && [ -f "/build/compiled/muos/m8c/.local/share/m8c/config.ini" ]; then
    echo "OK   muos m8c.sh + config.ini present"
  else
    echo "FAIL muos m8c.sh or config.ini missing"
    ((error_count++))
  fi

  # Print summary
  echo "-------------------"
  echo "Build Check Summary"
  echo "-------------------"
  echo "Errors: $error_count"
  echo "Warnings: $warning_count"

  if [ $error_count -eq 0 ] && [ $warning_count -eq 0 ]; then
    echo "Build completed successfully with no issues."
  elif [ $error_count -eq 0 ]; then
    echo "Build completed with warnings. Please review the output."
  else
    echo "Build completed with errors. Please review the output and correct the issues."
    exit 1
  fi
}

# Run the checks
check_build_output

echo "Build and check process complete."
echo "  Knulli package: /build/compiled/knulli/  (m8c.sh + m8c/ -> roms/ports)"
echo "  muOS package:   /build/compiled/muos/    (m8c.sh + m8c/ -> ROMS/Ports)"
