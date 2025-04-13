Feature: Verifies that package.json entry points and their dependencies exist on disk

  Scenario: If package.json main entry point does not exist on disk, it will report an error
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "main": "dist/cjs/index.js"
      }
      """
    And the package has a directory named "src"
    And the package has a directory named "dist"
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is error and equals the following text:
      """
      File `package.json` references `dist/cjs/index.js` which does not exist on disk.
      """

  Scenario: If package.json module entry point does not exist on disk, it will report an error
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "main": "dist/cjs/index.js",
        "module": "dist/esm/index.js"
      }
      """
    And the package has a directory named "src"
    And the package has a directory named "dist/cjs"
    And there is a file named "dist/cjs/index.js" with:
      """
      module.exports = {};
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is error and equals the following text:
      """
      File `package.json` references `dist/esm/index.js` which does not exist on disk.
      """

  Scenario: If package.json types entry point does not exist on disk, it will report an error
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "main": "dist/cjs/index.js",
        "module": "dist/esm/index.js",
        "types": "dist/types/index.d.ts"
      }
      """
    And the package has a directory named "src"
    And the package has a directory named "dist/cjs"
    And there is a file named "dist/cjs/index.js" with:
      """
      module.exports = {};
      """
    And the package has a directory named "dist/esm"
    And there is a file named "dist/esm/index.js" with:
      """
      export default {};
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is error and equals the following text:
      """
      File `package.json` references `dist/types/index.d.ts` which does not exist on disk.
      """

  Scenario: If package.json exports entry point does not exist on disk, it will report an error
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "main": "dist/cjs/index.js",
        "exports": {
          ".": "./dist/cjs/index.js",
          "./utils": "./dist/cjs/utils/index.js"
        }
      }
      """
    And the package has a directory named "src"
    And the package has a directory named "dist/cjs"
    And there is a file named "dist/cjs/index.js" with:
      """
      module.exports = {};
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is error and equals the following text:
      """
      File `package.json` references `./dist/cjs/utils/index.js` which does not exist on disk.
      """

  Scenario: If package.json exports with nested conditions has files that don't exist on disk, it will report an error
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "main": "dist/cjs/index.js",
        "exports": {
          ".": {
            "import": "./dist/esm/index.js",
            "require": "./dist/cjs/index.js",
            "types": "./dist/types/index.d.ts"
          }
        }
      }
      """
    And the package has a directory named "src"
    And the package has a directory named "dist/cjs"
    And there is a file named "dist/cjs/index.js" with:
      """
      module.exports = {};
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is error and equals the following text:
      """
      File `package.json` references `./dist/esm/index.js` which does not exist on disk.
      File `package.json` references `./dist/types/index.d.ts` which does not exist on disk.
      """

  Scenario: If all package.json entry points exist on disk, the result is ok
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "main": "dist/cjs/index.js",
        "module": "dist/esm/index.js",
        "types": "dist/types/index.d.ts",
        "exports": {
          ".": {
            "import": "./dist/esm/index.js",
            "require": "./dist/cjs/index.js",
            "types": "./dist/types/index.d.ts"
          },
          "./utils": {
            "import": "./dist/esm/utils/index.js",
            "require": "./dist/cjs/utils/index.js",
            "types": "./dist/types/utils/index.d.ts"
          }
        }
      }
      """
    And the package has a directory named "src"
    And the package has a directory named "dist/cjs"
    And there is a file named "dist/cjs/index.js" with:
      """
      module.exports = {};
      """
    And the package has a directory named "dist/cjs/utils"
    And there is a file named "dist/cjs/utils/index.js" with:
      """
      module.exports = {};
      """
    And the package has a directory named "dist/esm"
    And there is a file named "dist/esm/index.js" with:
      """
      export default {};
      """
    And the package has a directory named "dist/esm/utils"
    And there is a file named "dist/esm/utils/index.js" with:
      """
      export default {};
      """
    And the package has a directory named "dist/types"
    And there is a file named "dist/types/index.d.ts" with:
      """
      export {};
      """
    And the package has a directory named "dist/types/utils"
    And there is a file named "dist/types/utils/index.d.ts" with:
      """
      export {};
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is ok

  Scenario: If entry point files exist but have imports that don't exist on disk, it will report an error
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "main": "dist/cjs/index.js"
      }
      """
    And the package has a directory named "src"
    And the package has a directory named "dist/cjs"
    And there is a file named "dist/cjs/index.js" with:
      """
      const utils = require('./utils');
      module.exports = { utils };
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is error and equals the following text:
      """
      File `$scenario_dir/dist/cjs/index.js` references `./utils` which does not exist on disk.
      """

  Scenario: If entry point files exist and have imports that also exist on disk, the result is ok
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "main": "dist/cjs/index.js"
      }
      """
    And the package has a directory named "src"
    And the package has a directory named "dist/cjs"
    And there is a file named "dist/cjs/index.js" with:
      """
      const utils = require('./utils');
      module.exports = { utils };
      """
    And there is a file named "dist/cjs/utils.js" with:
      """
      module.exports = {};
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is ok

  Scenario: If entry point files recursively import files that don't exist on disk, it will report an error
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "main": "dist/cjs/index.js"
      }
      """
    And the package has a directory named "src"
    And the package has a directory named "dist/cjs"
    And there is a file named "dist/cjs/index.js" with:
      """
      const utils = require('./utils');
      require('./non-existent');
      module.exports = { utils };
      """
    And there is a file named "dist/cjs/utils.js" with:
      """
      const helpers = require('./helpers');
      module.exports = { helpers };
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is error and equals the following text:
      """
      File `$scenario_dir/dist/cjs/index.js` references `./non-existent` which does not exist on disk.
      File `$scenario_dir/dist/cjs/utils.js` references `./helpers` which does not exist on disk.
      """

  Scenario: If entry point files recursively import files that exist on disk, the result is ok
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "main": "dist/cjs/index.js"
      }
      """
    And the package has a directory named "src"
    And the package has a directory named "dist/cjs"
    And there is a file named "dist/cjs/index.js" with:
      """
      const utils = require('./utils');
      module.exports = { utils };
      """
    And there is a file named "dist/cjs/utils.js" with:
      """
      const helpers = require('./helpers');
      module.exports = { helpers };
      """
    And there is a file named "dist/cjs/helpers.js" with:
      """
      module.exports = {};
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is ok

  Scenario: If an ESM file uses import statements for local dependencies, those imports are checked to ensure they exist
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "module": "dist/esm/index.js"
      }
      """
    And the package has a directory named "src"
    And the package has a directory named "dist/esm"
    And there is a file named "dist/esm/index.js" with:
      """
      import { utils } from './utils.js';
      export default { utils };
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is error and equals the following text:
      """
      File `$scenario_dir/dist/esm/index.js` references `./utils.js` which does not exist on disk.
      """

  Scenario: If an ESM file uses import statements for local dependencies that exist, the result is ok
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "module": "dist/esm/index.js"
      }
      """
    And the package has a directory named "src"
    And the package has a directory named "dist/esm"
    And there is a file named "dist/esm/index.js" with:
      """
      import { utils } from './utils.js';
      export default { utils };
      """
    And there is a file named "dist/esm/utils.js" with:
      """
      export const utils = {};
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is ok

  Scenario: Mixed CJS/ESM imports in the same file are supported
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "main": "dist/index.js"
      }
      """
    And the package has a directory named "dist"
    And there is a file named "dist/index.js" with:
      """
      import { helper } from './helper.js';
      const utils = require('./utils');
      module.exports = { utils, helper };
      """
    And there is a file named "dist/helper.js" with:
      """
      export const helper = {};
      """
    And there is a file named "dist/utils.js" with:
      """
      module.exports = {};
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is ok

  Scenario: Dynamic imports are checked
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "main": "dist/index.js"
      }
      """
    And the package has a directory named "dist"
    And there is a file named "dist/index.js" with:
      """
      async function loadDynamically() {
        const module = await import('./dynamic-module.js');
        return module;
      }
      module.exports = { loadDynamically };
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is error and equals the following text:
      """
      File `$scenario_dir/dist/index.js` references `./dynamic-module.js` which does not exist on disk.
      """

  Scenario: TypeScript imports in .d.ts files are checked
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "types": "dist/types/index.d.ts"
      }
      """
    And the package has a directory named "dist/types"
    And there is a file named "dist/types/index.d.ts" with:
      """
      import { SomeType } from './types';
      export declare const something: SomeType;
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is error and equals the following text:
      """
      File `$scenario_dir/dist/types/index.d.ts` references `./types` which does not exist on disk.
      """

  Scenario: TypeScript imports in .d.ts files that exist pass validation
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "types": "dist/types/index.d.ts"
      }
      """
    And the package has a directory named "dist/types"
    And there is a file named "dist/types/index.d.ts" with:
      """
      import { SomeType } from './types';
      export declare const something: SomeType;
      """
    And there is a file named "dist/types/types.d.ts" with:
      """
      export interface SomeType {
        prop: string;
      }
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is ok
