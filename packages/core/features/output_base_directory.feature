Feature: Output Base Directory

  Scenario: Base Directory w/o Parent Files
    Given the user created a new package
    And they wrote in "zoboz.config.ts" the following content:
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
        },
      });
      """
    And they wrote in "src/index.ts" the following content:
      """
      export const greeting = "hello, world!";
      """
    And they in package.json set "scripts.build" to "zoboz build --can-update-package-json"
    When they run "npm run build"
    Then the following files should be created:
      | file-path           |
      | dist/esm/index.js   |
      | dist/cjs/index.js   |
      | dist/dts/index.d.ts |

  Scenario: Base Directory w Parent Files
    Given the user created a new package
    And they wrote in "zoboz.config.ts" the following content:
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
        },
      });
      """
    And they wrote in "tsconfig.json" the following content:
      """
      {
        "compilerOptions": {
          "module": "esnext",
          "moduleResolution": "bundler",
          "resolveJsonModule": true
        }
      }
      """
    And they wrote in "out-of-src.json" the following content:
      """
      {"name": "outer-world"}
      """
    And they wrote in "src/inside-src.json" the following content:
      """
      {"name": "inner-world"}
      """
    And they wrote in "src/index.ts" the following content:
      """
      import * as outsider from "../out-of-src.json" with { type: "json" };
      import * as insider from "./inside-src.json" with { type: "json" };
      
      export const greeting = `hello, ${insider.name}! or shall I say ${outsider.name}?`;
      """
    And they in package.json set "scripts.build" to "zoboz build --can-update-package-json"
    When they run "npm run build"
    Then the following files should be created:
      | file-path           |
      | dist/esm/index.js   |
      | dist/cjs/index.js   |
      | dist/dts/index.d.ts |
