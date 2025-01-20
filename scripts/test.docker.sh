mkdir -p /app/temp
echo '' >/app/temp/test.docker.sh.results

#!/bin/bash
for node_version in 12 14 16 18 20 22; do
  for ts_version in 4 5; do
    docker run -it --rm -v $(pwd):/app -w /app node:$node_version bash -c "
      npm install -g typescript@$ts_version &&
      cd /app/packages/core && npm link &&
      cd /app/level-ones/core-bundler && npm run build &&
      cd /app/level-ones/core-node10 && npm run build &&
      cd /app/level-ones/core-node16 && npm run build &&
      cd /app/level-ones/esbuild-bundler && npm run build &&
      cd /app/level-ones/esbuild-node10 && npm run build &&
      cd /app/level-ones/esbuild-node16 && npm run build &&
      cd /app/level-twos/bundler && npm run test && npm run typecheck &&
      cd /app/level-twos/node10 && npm run test && npm run typecheck &&
      cd /app/level-twos/node16 && npm run test npm run typecheck &&
      echo 'All tests passed (node: $node_version, ts: $ts_version)' >> /app/temp/test.docker.sh.results
    "
  done
done
