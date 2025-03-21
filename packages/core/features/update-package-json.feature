Feature: Update Package JSON

  Scenario: Update Package JSON with Output Files
    Given a new package is created
    And file "package.json" reads as:
      """
      {
        "name": "my-package",
        "version": "1.0.0",
        "scripts": {
          "build": "zoboz build --can-update-package-json"
        },
        "devDependencies": {
          "@zoboz/core": "ZOBOZ_CORE_VERSION",
          "typescript": "TYPESCRIPT_VERSION"
        }
      }
      """
    And file "zoboz.config.ts" reads as:
      """typescript
      import { BuildConfig, esbuild, tsc } from "@zoboz/core";
      
      export default new BuildConfig({
        esm: esbuild.esm(),
        cjs: esbuild.cjs(),
        dts: tsc.dts(),
        srcDir: "./src",
        distDir: "./dist",
        exports: {
          ".": "./src/index.ts",
          "./extension": "./src/extension.ts",
        },
      });
      """
    And file "src/index.ts" reads as:
      """
      export const primaryEntryPoint = "hello, from primary entry point!";
      """
    And file "src/extension.ts" reads as:
      """
      export const extensionEntryPoint = "hello, from extension entry point!";
      """
    When command "npm run build" runs
    Then file "package.json" should read as:
      """
      {
        "name": "my-package",
        "version": "1.0.0",
        "scripts": {
          "build": "zoboz build --can-update-package-json"
        },
        "devDependencies": {
          "@zoboz/core": "ZOBOZ_CORE_VERSION",
          "typescript": "TYPESCRIPT_VERSION"
        },
        "main": "./dist/cjs/index.js",
        "module": "./dist/esm/index.js",
        "types": "./dist/dts/index.d.ts",
        "exports": {
          ".": {
            "types": "./dist/dts/index.d.ts",
            "require": "./dist/cjs/index.js",
            "import": "./dist/esm/index.js"
          },
          "./extension": {
            "types": "./dist/dts/extension.d.ts",
            "require": "./dist/cjs/extension.js",
            "import": "./dist/esm/extension.js"
          }
        }
      }
      """
