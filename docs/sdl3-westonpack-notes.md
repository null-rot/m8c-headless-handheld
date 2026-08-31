# SDL3 / Westonpack investigation notes (WIP)

Goal: get `m8c` running against a current (SDL3, `v2.2.3`) release instead of the
SDL2-only `v1.7.10` this repo currently ships. The device's on-board SDL2 is a
custom build with a proprietary Mali `fbdev` video driver baked in - upstream
SDL3 has no equivalent driver, so a bare SDL3 build cannot render on this
hardware. [Westonpack](https://github.com/binarycounter/Westonpack) is a
PortMaster runtime that runs the app as a client inside its own Weston
compositor session instead, which is the path this doc covers.

**Status: rendering works.** `m8c` (SDL3, X11-via-XWayland path) boots, connects
to the M8, and draws the tracker UI on real hardware. Two known issues remain
before this is usable - see "Remaining work" at the bottom. Getting here took
two architecturally different attempts (native Wayland client - dead end;
X11 via XWayland - working), documented below in order.

## Cross-compiling SDL3 for this toolchain (applies to both attempts)

The `aarch64-buildroot-linux-gnu_sdk-buildroot` toolchain (from
`Dockerfile.x86_64`) has no `libgbm`, `wayland-client`, `wayland-egl`,
`wayland-cursor`, or any X11 libs at all - not trimmed, genuinely absent,
because the H700's Buildroot config never builds Mesa/GBM/Wayland/X11
(confirmed against `knulli-h700_defconfig` upstream). SDL3's CMake build
hard-requires these at *compile* time even when using the `_SHARED` dlopen-at-
runtime variants - it still needs headers + a `.pc` file + a stub `.so` to
configure successfully. None of that ends up linked into the final binary
(confirmed via `objdump -p m8c` / `objdump -p libSDL3.so` showing no `NEEDED`
entries for any of these) - it's purely a build-time satisfaction trick.

Recipe, run inside the `m8c-builder` image (built by `build.sh` normally) with
`cmake`, `git`, `ninja-build`, `pkg-config` installed, plus `libwayland-dev`
`wayland-protocols` (Wayland attempt) or `libx11-dev libxext-dev
libxcursor-dev libxi-dev libxfixes-dev libxrandr-dev libxrender-dev
libxss-dev` (X11 attempt):

```bash
XTOOL=$(realpath aarch64-buildroot-linux-gnu_sdk-buildroot)
XHOST=aarch64-buildroot-linux-gnu
SYSROOT=$XTOOL/$XHOST/sysroot
export PATH=$PATH:$XTOOL/bin

# Headers are pure C, arch-independent - reuse the host apt packages' copies
# directly into the sysroot, e.g. for X11:
cp -r /usr/include/X11 $SYSROOT/usr/include/
cp -r /usr/include/X11/Xcursor $SYSROOT/usr/include/X11/   # separate package
# (same pattern for wayland-client.h etc in the Wayland attempt)

# Stub .so per lib, matching soname to what's ACTUALLY shipped (see gotcha
# below) - minimal case (Wayland/GBM libs only need dlopen'd, so a single
# dummy exported symbol is enough just to give SDL's SONAME-reading step
# something to open):
echo "void stub(void){}" > /tmp/stub.c
$XHOST-gcc -shared -fPIC -Wl,-soname,libFOO.so.N -o $SYSROOT/usr/lib/libFOO.so.N /tmp/stub.c
ln -sf libFOO.so.N $SYSROOT/usr/lib/libFOO.so
```

**Gotcha #1 - soname must match exactly**: the stub's SONAME has to match
what Westonpack actually ships, or SDL3 bakes in the wrong string and
`dlopen()` fails at runtime with an `ENOENT` that looks like a missing-library
problem but isn't. Hit this with `wayland-egl` - stubbed it as `.so.0`
(matching every other wayland lib's convention), but Westonpack ships
`libwayland-egl.so.1`. **Always check with `find /tmp/weston -iname
"*<lib>*"` on-device before stubbing, not after.**

**Gotcha #2 - some checks need real linkable symbols, not just a soname**:
this only bit X11, not Wayland/GBM. SDL's `CheckX11` macro does actual
`check_c_source_compiles`/`check_symbol_exists` *link* tests against
`XNextEvent`, `XGetEventData`, `XFreeEventData`, `XkbLookupKeySym` - a
single-dummy-symbol stub isn't enough here, the stub `.so` needs to actually
export those specific names (as no-op functions; contents don't matter,
they're link probes at cross-compile time, never executed).

**Gotcha #3 - host header/SDL version skew**: Ubuntu 22.04's `libx11-dev`
`Xlib.h` is newer than what SDL3 `release-3.2.16`'s `SDL_x11xinput2.h`
expects, causing a `conflicting types for 'XGenericEventCookie'` compile
error. `-DSDL_X11_XINPUT=OFF` does *not* avoid this (the header's still
parsed regardless) - worked around by patching the redundant forward-decl
line out of SDL's own `src/video/x11/SDL_x11xinput2.h` for this build. Not
needed for m8c (no touch/pen input), so no functional loss.

Build config that worked (X11 attempt - final, working path):

```bash
cmake .. -G Ninja \
  -DCMAKE_TOOLCHAIN_FILE=/build/toolchain.cmake \
  -DCMAKE_BUILD_TYPE=Release \
  -DSDL_SHARED=ON -DSDL_STATIC=OFF \
  -DSDL_X11=ON -DSDL_X11_SHARED=ON -DSDL_X11_XINPUT=OFF \
  -DSDL_WAYLAND=OFF -DSDL_KMSDRM=OFF -DSDL_RPI=OFF -DSDL_VIVANTE=OFF \
  -DSDL_VULKAN=OFF -DSDL_RENDER_VULKAN=OFF \
  -DSDL_PULSEAUDIO=OFF -DSDL_PIPEWIRE=ON -DSDL_ALSA=ON \
  -DSDL_OPENGLES=ON
```

(`SDL_VULKAN`/`SDL_RENDER_VULKAN` off because Vulkan's X11 surface code pulls
in `xcb/xcb.h`, which we don't have and don't need - m8c doesn't use Vulkan.)

Then install into the sysroot proper (`DESTDIR=$SYSROOT ninja install` with
`-DCMAKE_INSTALL_PREFIX=/usr`, not a separate prefix - pkg-config's sysroot
prefixing mangles paths outside the sysroot) and build `m8c` normally against
it with `make CC=$XHOST-gcc`.

## Getting Weston itself to boot on-device

Runtime names for `harbourmaster runtime_check` are `weston_pkg_0.2.squashfs`
and `mesa_pkg_0.1.squashfs` (confirmed against
`/mnt/mmc/MUOS/PortMaster/config/runtimes.json` on-device - Westonpack's own
wiki example command was right about the names). **Do not pass `--no-check`**
to `harbourmaster` - it skips loading `runtimes.json` into memory for that
invocation, so every runtime looks "Unknown" regardless of whether the name is
actually correct.

Weston itself boots clean every time: DRM device grabbed, Mali-G31
initialized via EGL/GLES 3.2, 640x480 output created. The GPU/driver stack
was never the problem - only which *client-side* platform API the app used
to talk to it.

## Environment plumbing for the wrapped app

Westonpack's `westonwrap.sh <backend> <renderer> <shell> <gl_library>
[env_vars] <path_to_app>` syntax passes `env_vars` as literal `VAR=value`
tokens that get applied via `env` immediately before exec'ing the app - this
**unconditionally overwrites** whatever `LD_LIBRARY_PATH` westonwrap.sh had
built up internally, it does not merge. Don't reuse whatever `$LD_LIBRARY_PATH`
happens to be in your own script's environment at that point; reconstruct it
explicitly with the paths the app actually needs.

## Attempt 1 (dead end): native Wayland client

Built SDL3 with `SDL_WAYLAND=ON`. Got all the way to a live Weston session
(needed `WAYLAND_DISPLAY=wayland-5` - Westonpack starts Weston on a
non-default socket name, not `wayland-0`) and `m8c` connecting - but it failed
at `eglGetPlatformDisplay(EGL_PLATFORM_WAYLAND_KHR, ...)`:

```
ERROR: Couldn't create window and renderer: Could not get EGL display
```

Weston's own startup log states plainly: `EGL Wayland extension: no`. The
Mali blob on this device only supports GBM-platform and (via Crusty's shims)
X11-platform EGL - there is no `crusty_wayland` variant, only `crusty_gbm` and
`crusty_x11egl`. This is a genuine driver capability gap, not a build or
library-path bug - confirmed by trying `crusty_gbm`'s `libEGL.so` first in
`LD_LIBRARY_PATH` too (matching what Weston's own process uses successfully),
which made no difference. **A native SDL3 Wayland client cannot get a display
on this hardware, full stop, regardless of build flags.**

## Attempt 2 (working): X11 via XWayland

Weston already runs an XWayland server for exactly this situation (visible as
`xserver listening on display :0` in every Weston log). Rebuilt SDL3 with
`SDL_X11=ON` instead (see gotchas above), and used `crusty_x11egl`'s
`libEGL.so` instead of `crusty_gbm`'s. Working app-launch line:

```bash
$ESUDO env LD_LIBRARY_PATH="$GAMEDIR:$LD_LIBRARY_PATH" \
  "$weston_dir/westonwrap.sh" drm gl kiosk system \
  LD_LIBRARY_PATH="$weston_dir/lib_aarch64/graphics/crusty_x11egl:$GAMEDIR:$weston_dir/lib_aarch64:$LD_LIBRARY_PATH" \
  DISPLAY=:0 \
  "$GAMEDIR/m8c"
```

This renders correctly and the app connects to the M8 over `/dev/ttyACM0`,
reads hardware info back (`Firmware ver 6.5.2`) successfully.

## Remaining work

1. **Controller bindings wrong/non-functional.** Log shows `Controller 1:
   Deeplay-keys` - that's the *Knulli* hardcoded `SDL_GAMECONTROLLERCONFIG`
   string, which the working muOS `m8c.sh` explicitly avoids (its own comment:
   *"the Knulli 'Deeplay-keys' string maps the wrong physical buttons on
   muOS"*). Westonpack's own environment pre-sets this var (visible in
   `westonwrap.sh`'s printenv dump) and our launcher never clears it, so
   `m8c` picks up the wrong mapping instead of muOS's real one via
   `get_controls`/`config.ini`. Likely fix: explicitly unset/override
   `SDL_GAMECONTROLLERCONFIG` in the app-env injection, same principle as the
   working script already applies.
   Also saw `ERROR: Unable to open game controller database file` -
   `gamecontrollerdb.txt` was never bundled; `v1.7.10` didn't need one.
   Probably want to bundle a stock one alongside the binary.

2. **Graphical artifact**: the "waiting for M8" splash animation (a rotating
   square) stayed on screen after the M8 connected and the tracker UI should
   have taken over. Likely a partial-redraw/damage-tracking difference
   between the X11/EGL swap-buffer path and whatever this splash code assumed
   (probably written/tested against the KMSDRM/GBM path originally). Not yet
   investigated.

Note: the "Error sending input" / "device disconnected" cascade seen at the
end of the first real test session was very likely just the M8 being
physically unplugged (no working quit binding yet, see #1 above) rather than
a genuine serial-write bug - reads worked fine and hardware info was received
correctly before that point.

## Known-good fallback

`m8c v1.7.10` (SDL2) builds and runs correctly today via the normal
`build.sh` pipeline - see the main README. Nothing above is required for that
to keep working; this doc only concerns the SDL3 upgrade path.
