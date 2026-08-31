#!/bin/bash

ARCH=$(uname -m)
IMAGE_NAME="m8c-builder"

# Detect architecture and set appropriate Dockerfile and build script
select_files() {
    case $ARCH in
    x86_64)
        echo "Building for x86_64 architecture..."
        DOCKERFILE="Dockerfile.x86_64"
        BUILD_SCRIPT="build_script.x86_64.sh"
        PLATFORM="linux/amd64"
        ;;
    arm64 | aarch64)
        echo "Building for ARM64 architecture..."
        DOCKERFILE="Dockerfile.arm64"
        BUILD_SCRIPT="build_script.arm64.sh"
        PLATFORM="linux/arm64/v8"
        ;;
    *)
        echo "Unsupported architecture: $ARCH"
        exit 1
        ;;
    esac
}

# Resolve which m8c version to build. Pass M8C_VERSION=x.y.z ./build.sh to pin one;
# otherwise this looks up the latest release from laamaa/m8c.
resolve_m8c_version() {
    if [ -n "$M8C_VERSION" ]; then
        echo "Using pinned m8c version: $M8C_VERSION"
        return
    fi

    echo "Looking up the latest m8c release..."
    local latest
    latest=$(curl -fsSL https://api.github.com/repos/laamaa/m8c/releases/latest 2>/dev/null \
        | grep -m1 '"tag_name"' | sed -E 's/.*"tag_name": *"v?([^"]+)".*/\1/')

    if [ -z "$latest" ]; then
        echo "Could not look up the latest m8c version (network issue or GitHub API rate limit)."
        echo "Set it explicitly instead, e.g.:  M8C_VERSION=2.2.3 ./build.sh"
        exit 1
    fi

    M8C_VERSION="$latest"
    echo "Latest m8c version: $M8C_VERSION"
}

# Ensure buildx is available and set up
setup_buildx() {
    echo "Setting up Docker buildx..."

    if ! docker buildx inspect m8c-builder-buildx >/dev/null 2>&1; then
        docker buildx create --name m8c-builder-buildx --driver docker-container --bootstrap
    fi

    docker buildx use m8c-builder-buildx
}

# Build the Docker image
build_image() {
    echo "Building Docker image for platform $PLATFORM (m8c v$M8C_VERSION)..."
    docker buildx build \
        --platform $PLATFORM \
        --build-arg M8C_VERSION="$M8C_VERSION" \
        --load \
        -f $DOCKERFILE \
        -t $IMAGE_NAME \
        .

    if [ $? -ne 0 ]; then
        echo "Build failed!"
        exit 1
    fi
}

# Run the container
run_container() {
    echo "Running container..."
    mkdir -p output
    # MSYS_NO_PATHCONV avoids Git Bash on Windows mangling the -v host:container
    # path (it tries to path-convert both sides of the colon-separated arg).
    # No-op on Linux/macOS.
    MSYS_NO_PATHCONV=1 docker run --platform $PLATFORM -v $(pwd)/output:/build/compiled $IMAGE_NAME
}

# Main execution
echo "Starting build process..."
select_files
resolve_m8c_version
setup_buildx
build_image
run_container

echo ""
echo "Done. Packages are in ./output/:"
echo "  output/knulli/  - copy m8c.sh + m8c/ into roms/ports (Knulli)"
echo "  output/muos/    - copy m8c.sh + m8c/ into ROMS/Ports (muOS)"
