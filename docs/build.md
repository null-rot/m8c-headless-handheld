# Building m8c from source

Compile `m8c` and its kernel modules for the Allwinner H700 yourself, instead of using a
[pre-built Release](../../../releases). Two ways to do it, both producing identical output.

## Local build

The Docker-based build lives at the repo root: `build.sh`, `Dockerfile.arm64`,
`Dockerfile.x86_64`, `build_script.*.sh`. Run `./build.sh` (Docker required) and it detects
your host architecture, builds accordingly, and drops the finished packages in `./output/`.

Pass `M8C_VERSION=x.y.z ./build.sh` to pin a specific `m8c` release; without it, the script
looks up the latest tag from [laamaa/m8c](https://github.com/laamaa/m8c) itself.

This build is based on **[jamesMcMeex/m8c-rg35xx-knulli](https://github.com/jamesMcMeex/m8c-rg35xx-knulli)**;
see their repo for the original Docker build instructions. The goal here is to take that work
and turn it into something anyone can run without any other local setup.

The current handheld port is fixed to `m8c` v1.7.10 - newer releases moved to a new SDL3
engine, which needs extra work to run on this hardware (see
[`sdl3-westonpack-notes.md`](sdl3-westonpack-notes.md) for the in-progress investigation).

## ☁️ Cloud build

No local setup needed - **[Actions → Build m8c → Run workflow](../../../actions/workflows/build-m8c.yml)**
compiles a fresh v1.7.10 (or any version you type in) the same way `./build.sh` does. It's
manual only, since builds are infrequent, and every run stages the Knulli + muOS packages as a
downloadable Artifact for testing on-device first. Once a build checks out, re-run it with
**"Also publish a GitHub Release"** ticked to cut a [Release](../../../releases) with the same
files attached.

Once the SDL3/v2.x path is fully working, this can switch to auto-building each new
`laamaa/m8c` release as it ships.

Back to the [main README](../README.md).
