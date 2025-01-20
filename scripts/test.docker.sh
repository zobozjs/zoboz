#!/bin/bash
for node_version in 14 16 18 20 22; do
  for ts_version in 4 5; do
    docker run -it --rm -v $(pwd):/app -w /app node:$node_version bash -c "
      npm install -g typescript@$ts_version &&
      cd packages/core &&
      npm link &&
      cd ../.. &&
      cd level-ones/core-bundler &&
      npm run build &&
      cd ../core-node10 &&
      npm run build &&
      cd ../core-node16 &&
      npm run build &&
      cd ../esbuild-bundler &&
      npm run build &&
      cd ../esbuild-node10 &&
      npm run build &&
      cd ../esbuild-node16 &&
      npm run build &&
      cd ../../level-twos/bundler &&
      npm run test &&
      cd ../node10 &&
      npm run test &&
      cd ../node16 &&
      npm run test
    "
  done
done
