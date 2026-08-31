# SDL3 / Westonpack investigation notes (WIP)

Goal: get `m8c` running against a current (SDL3, `v2.2.3`) release instead of the
SDL2-only `v1.7.10` this repo currently ships. The device's on-board SDL2 is a
custom build with a proprietary Mali `fbdev` video driver baked in - upstream
SDL3 has no equivalent driver, so a bare SDL3 build cannot render on this
hardware. [Westonpack](https://github.com/binarycounter/Westonpack) is a
PortMaster runtime that runs the app as a Wayland client inside its own Weston
compositor session instead, which is the path this doc covers.

**Status: blocked.** Everything up to getting a live Weston session with the
Mali GPU working is solved. The remaining blocker is architectural, not a
build bug - see "Current blocker" below.

## Cross-compiling SDL3 for this toolchain

The `aarch64-buildroot-linux-gnu_sdk-buildroot` toolchain (from
`Dockerfile.x86_64`) has no `libgbm`, `wayland-client`, `wayland-egl`, or
`wayland-cursor` at all - not trimmed, genuinely absent, because the H700's
Buildroot config never builds Mesa/GBM/Wayland (confirmed against
`knulli-h700_defconfig` upstream). SDL3's CMake build hard-requires these at
*compile* time even when using `SDL_KMSDRM_SHARED`/`SDL_WAYLAND_SHARED`
(dlopen-at-runtime mode) - it still needs headers + a `.pc` file + a stub
`.so` (just to read a SONAME off it) to configure successfully. None of that
ends up linked into the final binary; it's purely a build-time satisfaction
trick, confirmed via `objdump -p m8c` / `objdump -p libSDL3.so` showing no
`NEEDED` entries for any of these.

Recipe, run inside the `m8c-builder` image (built by `build.sh` normally) with
`cmake`, `git`, `ninja-build`, `libwayland-dev`, `wayland-protocols` installed:

```bash
XTOOL=$(realpath aarch64-buildroot-linux-gnu_sdk-buildroot)
XHOST=aarch64-buildroot-linux-gnu
SYSROOT=$XTOOL/$XHOST/sysroot
export PATH=$PATH:$XTOOL/bin

# --- gbm stub ---
# (write $SYSROOT/usr/include/gbm.h with the handful of gbm_* symbols m8c/SDL
#  actually reference, a matching gbm.pc, and a stub .so with soname
#  libgbm.so.1 built via: $XHOST-gcc -shared -fPIC -Wl,-soname,libgbm.so.1 ...)

# --- wayland-client / wayland-egl / wayland-cursor stubs ---
# headers are pure C, arch-independent - reuse the host's libwayland-dev copies:
cp /usr/include/wayland-client.h /usr/include/wayland-client-protocol.h \
   /usr/include/wayland-client-core.h /usr/include/wayland-util.h \
   /usr/include/wayland-egl.h /usr/include/wayland-egl-core.h \
   /usr/include/wayland-cursor.h $SYSROOT/usr/include/
# + matching .pc files and stub .so's, same pattern as gbm above.
```

**Critical gotcha**: the stub `.so`'s SONAME must match what Westonpack
actually ships, or SDL3 bakes in the wrong string and `dlopen()` fails at
runtime with an `ENOENT` that looks like a missing-library problem but isn't.
Hit this exactly with `wayland-egl` - stubbed it as `.so.0` (matching every
other wayland lib's convention), but Westonpack ships `libwayland-egl.so.1`.
Check with `find /tmp/weston -iname "*<lib>*"` on-device before stubbing, not
after.

CMake config (KMSDRM disabled in the final working attempt - not needed once
running inside Weston, since Weston itself already owns the DRM device):

```bash
cmake .. -G Ninja \
  -DCMAKE_TOOLCHAIN_FILE=/build/toolchain.cmake \
  -DCMAKE_BUILD_TYPE=Release \
  -DSDL_SHARED=ON -DSDL_STATIC=OFF \
  -DSDL_WAYLAND=ON -DSDL_WAYLAND_SHARED=ON -DSDL_WAYLAND_LIBDECOR=OFF \
  -DSDL_X11=OFF -DSDL_RPI=OFF -DSDL_VIVANTE=OFF \
  -DSDL_PULSEAUDIO=OFF -DSDL_PIPEWIRE=ON -DSDL_ALSA=ON \
  -DSDL_OPENGLES=ON
```

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
actually correct. This cost a lot of debugging time before the actual (empty)
manifest was the obvious answer in hindsight.

Weston booted clean on the first real attempt: DRM device grabbed, Mali-G31
initialized via EGL/GLES 3.2, 640x480 output created. The GPU/driver stack is
not the problem here - see below.

## Environment plumbing for the wrapped app

Westonpack's `westonwrap.sh <backend> <renderer> <shell> <gl_library>
[env_vars] <path_to_app>` syntax passes `env_vars` as literal `VAR=value`
tokens that get applied via `env` immediately before exec'ing the app - this
**unconditionally overwrites** whatever `LD_LIBRARY_PATH` westonwrap.sh had
built up internally (which includes the paths where the real Wayland/GBM libs
live), it does not merge. Don't reuse whatever `$LD_LIBRARY_PATH` happens to
be in your own script's environment at that point (it won't have Weston's
paths yet); reconstruct it explicitly. Also needed: `WAYLAND_DISPLAY`
(Westonpack starts Weston on a non-default socket, `wayland-5`, not
`wayland-0` - SDL3 won't find it otherwise).

Correct app-launch line ended up as:

```bash
$ESUDO env LD_LIBRARY_PATH="$GAMEDIR:$LD_LIBRARY_PATH" \
  "$weston_dir/westonwrap.sh" drm gl kiosk system \
  LD_LIBRARY_PATH="$weston_dir/lib_aarch64/graphics/crusty_gbm:$GAMEDIR:$weston_dir/lib_aarch64/extra_wayland:$weston_dir/lib_aarch64:$LD_LIBRARY_PATH" \
  WAYLAND_DISPLAY=wayland-5 \
  "$GAMEDIR/m8c"
```

(`crusty_gbm` needs to be first in the path so the app picks up Crusty's own
`libEGL.so` shim instead of falling through to the raw system Mali blob - see
below for why that matters.)

## Current blocker: no Wayland-platform EGL support at all

With everything above working, `m8c` connects to Weston fine but fails at
`eglGetPlatformDisplay(EGL_PLATFORM_WAYLAND_KHR, ...)`:

```
ERROR: Couldn't create window and renderer: Could not get EGL display
```

Weston's *own* startup log states plainly: `EGL Wayland extension: no`. The
Mali blob on this device only supports GBM-platform and (via Crusty's shims)
X11-platform EGL - there is no `crusty_wayland` variant, only `crusty_gbm` and
`crusty_x11egl`. This isn't a missing-library or soname problem like the
earlier ones; it's the actual driver capability. A genuine SDL3 Wayland
client cannot get a display here, full stop, regardless of build flags.

**Next step to try**: rebuild SDL3 with `-DSDL_X11=ON` instead of/alongside
Wayland, and run the app through Weston's XWayland server (`DISPLAY=:0`,
already started by Weston - visible as `xserver listening on display :0` in
every log) using `crusty_x11egl`'s `libEGL.so` instead of `crusty_gbm`'s. This
needs the same header+stub-with-verified-soname treatment as Wayland did,
across a larger set of X11 libs (Xext, Xrandr, Xi, Xcursor, Xfixes, etc.) -
expect at least one more soname mismatch discovery cycle same as
`wayland-egl` above.

## Known-good fallback

`m8c v1.7.10` (SDL2) builds and runs correctly today via the normal
`build.sh` pipeline - see the main README. Nothing above is required for that
to keep working; this doc only concerns the SDL3 upgrade path.
