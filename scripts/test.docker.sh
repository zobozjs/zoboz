#!/usr/bin/env bash

mkdir -p $(pwd)/temp
echo '' >$(pwd)/temp/test.docker.sh.results

# ./verdaccio/run.sh --start

npm install
npm -w @zoboz/core run build
npm -w @zoboz/core publish --registry http://localhost:4873

for node_version in 14 16 18 20 22; do
  for ts_version in 4 5; do
    docker run -it --rm -v $(pwd)/tests:/app -v $(pwd)/temp:/app/temp -w /app node:$node_version bash -c "
      echo '⏳ Testing (node: $node_version, ts: $ts_version)' >> /app/temp/test.docker.sh.results &&
      npm install -g typescript@$ts_version &&
      cd /app/level-ones/core-bundler && npm i && npm run build && npm publish &&
      cd /app/level-ones/core-node10 && npm i && npm run build && npm publish &&
      cd /app/level-ones/core-node16 && npm i && npm run build && npm publish &&
      cd /app/level-ones/esbuild-bundler && npm i && npm run build && npm publish &&
      cd /app/level-ones/esbuild-node10 && npm i && npm run build && npm publish &&
      cd /app/level-ones/esbuild-node16 && npm i && npm run build && npm publish &&
      cd /app/level-twos/bundler && npm i && npm run test && npm run typecheck &&
      cd /app/level-twos/node10 && npm i && npm run test && npm run typecheck &&
      cd /app/level-twos/node16 && npm i && npm run test npm run typecheck &&
      echo '🍃 Done (node: $node_version, ts: $ts_version)' >> /app/temp/test.docker.sh.results ||
      echo '🌶️ Failed (node: $node_version, ts: $ts_version)' >> /app/temp/test.docker.sh.results
    "
  done
done

# ./verdaccio/run.sh --stop
