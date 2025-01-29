mkdir -p $(pwd)/temp
echo '' >$(pwd)/temp/test.docker.sh.results

# build the latest version of the packages on the host machine
./scripts/ci.sh

#!/bin/bash
for node_version in 14 16 18 20 22; do
  for ts_version in 4 5; do
    docker run -it --rm -v $(pwd):/app -w /app node:$node_version bash -c "
      echo '⏳ Testing (node: $node_version, ts: $ts_version)' >> /app/temp/test.docker.sh.results &&
      npm install -g typescript@$ts_version &&
      cd /app/packages/core && npm link --global-style &&
      cd /app/level-ones/core-bundler && npm run build &&
      cd /app/level-ones/core-node10 && npm run build &&
      cd /app/level-ones/core-node16 && npm run build &&
      cd /app/level-ones/esbuild-bundler && npm run build &&
      cd /app/level-ones/esbuild-node10 && npm run build &&
      cd /app/level-ones/esbuild-node16 && npm run build &&
      cd /app/level-twos/bundler && npm run test && npm run typecheck &&
      cd /app/level-twos/node10 && npm run test && npm run typecheck &&
      cd /app/level-twos/node16 && npm run test npm run typecheck &&
      echo '🍃 Done (node: $node_version, ts: $ts_version)' >> /app/temp/test.docker.sh.results ||
      echo '🌶️ Failed (node: $node_version, ts: $ts_version)' >> /app/temp/test.docker.sh.results
    "
  done
done
