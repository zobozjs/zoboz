#!/usr/bin/env bash

PUBLISH_REGISTRY=https://registry.npmjs.org npm -w @zoboz/bam run publish-binaries &&
  npm -w @zoboz/bam publish --registry https://registry.npmjs.org &&
  npm -w @zoboz/core publish --registry https://registry.npmjs.org
