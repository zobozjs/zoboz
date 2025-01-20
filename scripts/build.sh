#!/bin/bash

execute_build() {
  npm -w @zoboz/core run build
}

if [ "$1" != "--alone" ]; then
  DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  $DIR/install.sh && execute_build
else
  execute_build
fi
