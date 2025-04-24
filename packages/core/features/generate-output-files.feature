Feature: Generate Output Files

  Scenario: Base Directory w/o Parent Files
    Given a new package is created
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
        },
      });
      """
    And file "src/index.ts" reads as:
      """
      export const greeting = "hello, world!";
      """
    And package.json sets "scripts.build" to "zoboz build --can-update-package-json"
    When command "npm run build" runs
    Then the command should succeed
    And the following files should exist:
      | file-path                |
      | package.json             |
      | src/index.ts             |
      | dist/esm/js/package.json |
      | dist/esm/js/index.js     |
      | dist/esm/dts/index.d.ts  |
      | dist/cjs/js/package.json |
      | dist/cjs/js/index.js     |
      | dist/cjs/dts/index.d.ts  |
