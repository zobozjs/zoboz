# Changelog

All notable changes to this project will be documented in this file.

## [1.3.2] - 2025-03-18

### Bug Fixes

- imports going outside of srcDir while yet within package directory were left out as is and disconnected (example: importing package.json from within src)


## [1.3.1] - 2025-03-16

### Bug Fixes

- json imports were not getting reformatted to js, if builders like esbuild have turned the json source to js
