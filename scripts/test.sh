#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "$1" != "--alone" ]; then
  $DIR/build.sh
fi

npm -w @level-ones/core-es2020 run build
npm -w @level-ones/core-es2022 run build

npm -w @level-ones/esbuild-v0-es2022 run build

npm -w @level-twos/commonjs run test
npm -w @level-twos/node16 run test
