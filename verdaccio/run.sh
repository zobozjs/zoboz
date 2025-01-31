#!/usr/bin/env bash

VERDACCIO_CONFIG="$(dirname "$(realpath "$0")")/config.yaml"

docker run -it --rm --name verdaccio --user root \
  -p 4873:4873 \
  -v $VERDACCIO_CONFIG:/verdaccio/conf/config.yaml \
  verdaccio/verdaccio
