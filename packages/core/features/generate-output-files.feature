Feature: Generate Output Files

  Scenario: Base Directory w/o Parent Files
    Given a new package is created
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
        },
      });
      """
    And file "src/index.ts" reads as:
      """
      export const greeting = "hello, world!";
      """
    And package.json sets "scripts.build" to "zoboz build --can-update-package-json"
    When command "npm run build" runs
    Then the following files should exist:
      | file-path           |
      | dist/esm/index.js   |
      | dist/cjs/index.js   |
      | dist/dts/index.d.ts |
