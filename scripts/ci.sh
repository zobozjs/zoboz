#!/usr/bin/env bash

execute_ci() {
  npm run typecheck --workspaces
}

if [ "$1" != "--alone" ]; then
  DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  $DIR/test.sh && execute_ci
else
  execute_ci
fi
