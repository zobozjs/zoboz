Feature: Respect Source Directory as Output Base Directory

  Scenario: Reading JSON Files Outside Source Directory
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
    And file "tsconfig.json" reads as:
      """
      {
        "compilerOptions": {
          "module": "esnext",
          "moduleResolution": "bundler",
          "resolveJsonModule": true
        }
      }
      """
    And file "assets/out-of-src.json" reads as:
      """
      {"name": "outer-world"}
      """
    And file "src/inside-src.json" reads as:
      """
      {"name": "inner-world"}
      """
    And file "src/index.ts" reads as:
      """
      import outsider from "../assets/out-of-src.json" with { type: "json" };
      import insider from "./inside-src.json" with { type: "json" };
      
      export const greeting = `hello, ${insider.name}! or shall I say ${outsider.name}?`;
      """
    And package.json sets "scripts.build" to "zoboz build --can-update-package-json"
    When command "npm run build" runs
    Then the following files should exist:
      | file-path           |
      | dist/esm/index.js   |
      | dist/cjs/index.js   |
      | dist/dts/index.d.ts |
    And file "dist/esm/index.js" should read as:
      """
      import outsider from "../../assets/out-of-src.json" with { type: "json" };
      import insider from "./inside-src.js";
      const greeting = `hello, ${insider.name}! or shall I say ${outsider.name}?`;
      export {
        greeting
      };
      """
