#!/bin/bash

execute_install() {
  npm install
}

if [ "$1" != "--alone" ]; then
  DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  $DIR/hydrate.sh && execute_install
else
  execute_install
fi
