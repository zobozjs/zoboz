#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "$1" != "--alone" ]; then
  $DIR/install.sh
fi

npm -w @zoboz/core run build
npm -w @zoboz/esbuild-v0 run build
