# Changelog

All notable changes to this project will be documented in this file.

## [5.0.0] - 2025-03-16

### Breaking Changes

- Changes CLI flag "--update-package-json" to "--can-update-package-json" for better clarity about its purpose.
- Disallows importing files from outside of "srcDir".

### Bug Fixes

- CLI does not swallow tsc commands' and esbuild commands' errors anymore. Helping users fix the issue arised.
- esbuild builders do not ignore .json files from "srcDir" anymore.
