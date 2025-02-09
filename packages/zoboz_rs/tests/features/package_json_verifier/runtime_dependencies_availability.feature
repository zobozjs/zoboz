Feature: Ensure runtime dependencies will be available to the consumers

  Scenario: If a runtime dependency is not listed at all, in validate-mode,
  it will be requested to be added to dependencies
  or if they want the user to bring their own version,
  it should get added to devDependencies,
  and get duplicated in peerDependencies

  Scenario: If a runtime dependency is not listed at all, in fix-mode,
  it will ask the user if they want to force a version,
  resulting in addding it in dependencies,
  or if the user wants to let the user bring their own,
  resulting in adding it in devDependencies as well as peerDependencies

  Scenario: If a runtime dependency is listed as a devDependency, in validate-mode,
  it will be requested to be moved to dependencies
  or if they want the user to bring their own version,
  it should get duplicated in peerDependencies

  Scenario: If a runtime dependency is listed as a devDependency, in fix-mode,
  it will ask the user if they want to force a version,
  resulting in addding it in dependencies and removing it from devDependencies,
  or if the user wants to let the user bring their own,
  resulting in adding it in devDependencies as well as peerDependencies
