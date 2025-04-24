# Changelog

All notable changes to this project will be documented in this file.

## [5.0.0] - 2025-04-24

### Breaking Changes

- config API has changed to accomodate separate dts for esm and cjs

## [4.1.2] - 2025-03-18

### Bug Fixes

- Use latest version of @zoboz/bam (v1.3.2) -- The update fixes specifier reformatting for files higher than src dir and lower than package directory (e.g. importing package.json from within src dir files)


## [4.0.0] - 2025-03-16

### Breaking Changes

- Changes CLI flag "--update-package-json" to "--can-update-package-json" for better clarity about its purpose.
- Disallows importing files from outside of "srcDir".

### Bug Fixes

- CLI does not swallow tsc commands' and esbuild commands' errors anymore. Helping users fix the issue arised.
- esbuild builders do not ignore .json files from "srcDir" anymore.
