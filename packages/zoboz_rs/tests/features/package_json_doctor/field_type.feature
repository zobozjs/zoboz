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
    And it has been explicitly requested to update package.json
    When package_json_doctor is run
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
    And it has been explicitly requested to update package.json
    When package_json_doctor is run
    Then the JSON content for "package.json" should be:
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
    When package_json_doctor is run
    Then the result is error and equals the following text:
      """
      Field "type" in package.json should not exist. Its existence can cause confusion for the consumers. https://issue-explanation
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
    And it has been explicitly requested to update package.json
    When package_json_doctor is run
    Then the JSON content for "package.json" should be:
      """
        {
          "name": "test",
          "version": "1.0.0",
          "main": "dist/cjs/index.js"
        }
      """
