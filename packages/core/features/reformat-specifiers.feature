Feature: Reformat Specifiers

  Scenario: Reformat Specifiers
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
    And file "src/name.ts" reads as:
      """
      export const name = "world";
      """
    And file "src/greeting.ts" reads as:
      """
      import { name } from "./name.js";
      export const greeting = `hello, ${name}!`;
      """
    And file "src/index.ts" reads as:
      """
      export { greeting } from "./greeting"; 
      """
    And package.json sets "scripts.build" to "zoboz build --can-update-package-json"
    When command "npm run build" runs
    Then file "dist/esm/greeting.js" should contain "\"./name.js\"" but not "\"./name.js.js\""
    And file "dist/esm/index.js" should contain "\"./greeting.js\"" but not "\"./greeting\""
    And file "dist/cjs/greeting.js" should contain "\"./name.js\"" but not "\"./name.js.js\""
    And file "dist/cjs/index.js" should contain "\"./greeting.js\"" but not "\"./greeting\""
    And file "dist/dts/greeting.d.ts" should not contain "./name"
    And file "dist/dts/index.d.ts" should contain "\"./greeting.js\"" but not "\"./greeting\""
