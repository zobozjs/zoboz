Feature: Ensure field "type" is not present

  Scenario: When field "type" is not present, in validate-mode, no change is requested
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
      exports.foo = 'bar';
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir
      """
    Then the result is ok

  Scenario: When field "type" is not present, in fix-mode, no change will happen to package.json
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
      exports.foo = 'bar';
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir --can-update-package-json
      """
    Then the result is ok
    And the JSON content for "package.json" should be:
      """
        {
          "name": "test",
          "version": "1.0.0",
          "main": "dist/cjs/index.js"
        }
      """

  Scenario: When field "type" is not present, in validate-mode, removal is requested
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "type": "whatever",
        "main": "dist/cjs/index.js"
      }
      """
    And the package has a directory named "src"
    And the package has a directory named "dist/cjs"
    And there is a file named "dist/cjs/index.js" with:
      """
      exports.foo = 'bar';
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir $scenario_dir
      """
    Then the result is error and equals the following text:
      """
      Field `type` in package.json should not exist. https://zobozjs.github.io/docs/learn/avoid-pkg-type
      """

  Scenario: When field "type" is present, in fix-mode, it will get removed from package.json
    Given there is an npm package with:
      """
      {
        "name": "test",
        "version": "1.0.0",
        "type": "whatever",
        "main": "dist/cjs/index.js"
      }
      """
    And the package has a directory named "src"
    And the package has a directory named "dist/cjs"
    And there is a file named "dist/cjs/index.js" with:
      """
      exports.foo = 'bar';
      """
    When the following command is executed:
      """
      verify-package-json --absolute-package-dir $scenario_dir --can-update-package-json
      """
    Then the result is ok
    And the JSON content for "package.json" should be:
      """
        {
          "name": "test",
          "version": "1.0.0",
          "main": "dist/cjs/index.js"
        }
      """
