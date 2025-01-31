#!/usr/bin/env bash

mkdir -p $(pwd)/temp
echo '' >$(pwd)/temp/test.docker.sh.results

npm install
npm -w @zoboz/core run build

for platform in "linux/amd64" "linux/arm64"; do
  for node_version in 14 16 18 20 22; do
    for ts_version in 4 5; do
      ./verdaccio/run.sh --start >/dev/null
      npm -w @zoboz/core publish --registry http://localhost:4873
      docker run -it --rm --platform $platform --network zoboz-net -v $(pwd)/tests:/app -v $(pwd)/temp:/app/temp -w /app node:$node_version bash -c "
        export NPM_CONFIG_REGISTRY=http://verdaccio:4873 &&
        npm config set '//verdaccio:4873/:_authToken' 'OGQ5NDgxYjAwOWZkNzFhZmRlZGZiOTNjZGZhY2QyYTY6MTEwZDlkOTQ0YWVjYWViNjIzYzE5NTg4M2I1NzUx' &&
        npm config set registry http://verdaccio:4873 &&
        echo '⏳ Testing   (platform: $platform, node: $node_version, ts: $ts_version)' >> /app/temp/test.docker.sh.results &&
        npm install -g typescript@$ts_version &&
        cd /app/level-ones/core-bundler && rm -rf node_modules package-lock.json && npm i && npm run build && npm publish &&
        cd /app/level-ones/core-node10 && rm -rf node_modules package-lock.json && npm i && npm run build && npm publish &&
        cd /app/level-ones/core-node16 && rm -rf node_modules package-lock.json && npm i && npm run build && npm publish &&
        cd /app/level-ones/esbuild-bundler && rm -rf node_modules package-lock.json && npm i && npm run build && npm publish &&
        cd /app/level-ones/esbuild-node10 && rm -rf node_modules package-lock.json && npm i && npm run build && npm publish &&
        cd /app/level-ones/esbuild-node16 && rm -rf node_modules package-lock.json && npm i && npm run build && npm publish &&
        cd /app/level-twos/bundler && rm -rf node_modules package-lock.json && npm i && npm run test && npm run typecheck &&
        cd /app/level-twos/node10 && rm -rf node_modules package-lock.json && npm i && npm run test && npm run typecheck &&
        cd /app/level-twos/node16 && rm -rf node_modules package-lock.json && npm i && npm run test npm run typecheck &&
        echo '🍃 Done      (platform: $platform, node: $node_version, ts: $ts_version)' >> /app/temp/test.docker.sh.results ||
        echo '🌶️ Failed    (platform: $platform, node: $node_version, ts: $ts_version)' >> /app/temp/test.docker.sh.results
      "
      ./verdaccio/run.sh --stop >/dev/null
    done
  done
done
