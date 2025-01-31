#!/usr/bin/env bash

VERDACCIO_CONFIG="$(dirname "$(realpath "$0")")/config.yaml"

execute_inline() {
  docker run -it --rm --name verdaccio --user root \
    -p 4873:4873 \
    -v $VERDACCIO_CONFIG:/verdaccio/conf/config.yaml \
    verdaccio/verdaccio
}

execute_start() {
  docker run -it --rm --name verdaccio --user root -d \
    -p 4873:4873 \
    -v $VERDACCIO_CONFIG:/verdaccio/conf/config.yaml \
    verdaccio/verdaccio
}

execute_stop() {
  docker stop verdaccio
}

if [ "$1" == "--stop" ]; then
  execute_stop
elif [ "$1" == "--start" ]; then
  execute_start
else
  execute_inline
fi
