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
      export const greetin = "hello, world!";
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
          "resolveJsonModule": true
        }
      }
      """
    And they wrote in "out-of-src.json" the following content:
      """
      {"name": "world"}
      """
    And they wrote in "out-of-src.ts" the following content:
      """
      export { name } from "./out-of-src.json";
      """
    And they wrote in "src/index.ts" the following content:
      """
      import { name } from "../out-of-src.json";
      
      export const greeting = `hello, ${name}!`;
      """
    And they in package.json set "scripts.build" to "zoboz build --can-update-package-json"
    When they run "npm run build"
    Then the following files should be created:
      | file-path           |
      | dist/esm/index.js   |
      | dist/cjs/index.js   |
      | dist/dts/index.d.ts |
    # Then the command should fail with the following output:
    #   """
    #   Error: ENOENT: no such file or directory, open '/path/to/package/src/out-of-src.json'
    #   """
