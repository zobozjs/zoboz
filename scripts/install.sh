#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "$1" != "--alone" ]; then
  $DIR/hydrate.sh
fi

npm install
