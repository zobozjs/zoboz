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
      import { BuildConfig } from "@zoboz/core";
      
      export default new BuildConfig({
        esm: {},
        cjs: {},
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
    Then the command should succeed
    And file "package.json" should read as:
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
        "main": "./dist/cjs/js/index.js",
        "module": "./dist/esm/js/index.js",
        "types": "./dist/cjs/dts/index.d.ts",
        "exports": {
          ".": {
            "import": {
              "types": "./dist/esm/dts/index.d.ts",
              "default": "./dist/esm/js/index.js"
            },
            "require": {
              "types": "./dist/cjs/dts/index.d.ts",
              "default": "./dist/cjs/js/index.js"
            }
          },
          "./extension": {
            "import": {
              "types": "./dist/esm/dts/extension.d.ts",
              "default": "./dist/esm/js/extension.js"
            },
            "require": {
              "types": "./dist/cjs/dts/extension.d.ts",
              "default": "./dist/cjs/js/extension.js"
            }
          }
        }
      }
      """
