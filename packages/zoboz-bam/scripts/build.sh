#!/usr/bin/env bash

rm -rf ~/repos/zoboz/packages/zoboz-bam/bin/binaries/*

./scripts/build_macos.sh
./scripts/build_linux.sh
./scripts/build_windows_arm64.sh
./scripts/build_windows_x64.sh
