#!/bin/bash

execute_test() {
  npm -w @level-ones/core-es2020 run build &&
    npm -w @level-ones/core-es2022 run build &&
    npm -w @level-ones/esbuild-v0-es2022 run build &&
    npm -w @level-twos/commonjs run test &&
    npm -w @level-twos/node16 run test
}

if [ "$1" != "--alone" ]; then
  DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  $DIR/build.sh && execute_test
else
  execute_test
fi
