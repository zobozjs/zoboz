#!/usr/bin/env bash

execute_test() {
  npm -w @level-ones/tsc-bundler run build -- --can-update-package-json &&
    npm -w @level-ones/tsc-node10 run build -- --can-update-package-json &&
    npm -w @level-ones/tsc-node16 run build -- --can-update-package-json &&
    npm -w @level-ones/esbuild-bundler run build -- --can-update-package-json &&
    npm -w @level-ones/esbuild-node10 run build -- --can-update-package-json &&
    npm -w @level-ones/esbuild-node16 run build -- --can-update-package-json &&
    npm -w @level-twos/bundler run test &&
    npm -w @level-twos/node10 run test &&
    npm -w @level-twos/node16 run test
}

if [ "$1" != "--alone" ]; then
  DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  $DIR/build.sh && execute_test
else
  execute_test
fi
