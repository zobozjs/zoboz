Feature: CommonJS Specifier Formatter

  Scenario: Importing a CommonJS module with a specifier
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "main": "dist/cjs/index.js",
        "dependencies": {
          "external": "1.0.0"
        }
      }
      """
    And the package has a directory named "node_modules"
    And there is a file named "node_modules/external/package.json" with:
      """
      {
        "name": "external",
        "version": "1.0.0",
        "main": "index.js"
      }
      """
    And there is a file named "node_modules/external/index.js" with:
      """
      module.exports = 'external';
      """
    And the package has a directory named "src"
    And the package has a directory named "dist/cjs"
    And there is a file named "tsconfig.json" with:
      """
      {
        "compilerOptions": {
          "baseUrl": "src",
          "paths": {
            "@utils/*": ["utils/*"]
          }
        }
      }
      """
    And there is a file named "dist/cjs/index.js" with:
      """
      // dependencies should not be touched
      const external = require('external');
      // files from within the package but outside of the source directory will be remapped
      const pkg = require('../package.json');
      const foo = require('./foo');
      const bar = require("./bar");
      """
    And there is a file named "dist/cjs/foo.js" with:
      """
      module.exports = 'foo';
      """
    And there is a file named "dist/cjs/metadata.js" with:
      """
      module.exports = { environment: 'development' };
      """
    And there is a file named "dist/cjs/everjson.json" with:
      """
      { "environment": "development" }
      """
    And there is a file named "dist/cjs/bar/index.js" with:
      """
      const baz = require('../baz');
      import('../lazy');
      
      // absolute path imports based on on tsconfig.json baseUrl
      require('baz');
      
      // alias imports based on tsconfig.json paths
      require('@utils');
      require('@utils/uniq');
      
      // after reformatting, the require should be js instead of json
      require('../metadata.json');
      // after reformatting, require should stay as is, since it is an actual json file
      require('../everjson.json');
      
      module.exports = 'bar';
      """
    And there is a file named "dist/cjs/baz.js" with:
      """
      module.exports = 'baz';
      """
    And there is a file named "dist/cjs/lazy.js" with:
      """
      module.exports = 'lazy';
      """
    And there is a file named "dist/cjs/utils/uniq.js" with:
      """
      module.exports = 'uniq';
      """
    And there is a file named "dist/cjs/utils/filter.js" with:
      """
      module.exports = 'filter';
      """
    And there is a file named "dist/cjs/utils/index.js" with:
      """
      module.exports.uniq = require('./uniq');
      module.exports.filter = require('./filter');
      """
    When the following command is executed:
      """
      reformat-specifiers \
        --absolute-package-dir $scenario_dir \
        --absolute-source-dir $scenario_dir/src \
        --absolute-output-dir $scenario_dir/dist/cjs \
        --output-format cjs
      """
    Then the JS content for "dist/cjs/index.js" should be:
      """
      // dependencies should not be touched
      const external = require('external');
      // files from within the package but outside of the source directory will be remapped
      const pkg = require('../../package.json');
      const foo = require('./foo.js');
      const bar = require("./bar/index.js");
      """
    And the JS content for "dist/cjs/foo.js" should be:
      """
      module.exports = 'foo';
      """
    And the JS content for "dist/cjs/bar/index.js" should be:
      """
      const baz = require('../baz.js');
      import('../lazy.js');
            
      // absolute path imports based on on tsconfig.json baseUrl
      require('../baz.js');
      
      // alias imports based on tsconfig.json paths
      require('../utils/index.js');
      require('../utils/uniq.js');
      
      // after reformatting, the require should be js instead of json
      require('../metadata.js');
      // after reformatting, require should stay as is, since it is an actual json file
      require('../everjson.json');
      
      module.exports = 'bar';
      """
    And the JS content for "dist/cjs/lazy.js" should be:
      """
      module.exports = 'lazy';
      """
