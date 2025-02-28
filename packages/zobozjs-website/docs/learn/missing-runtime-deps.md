---
title: 'missing-runtime-deps'
sidebar_position: 2
---

# Why Runtime Dependencies Belong in `dependencies` or `peerDependencies`

Your package has runtime dependencies that are either missing from `package.json` or incorrectly listed under `devDependencies`.

## Why Is This a Problem?

Relying on hoisted modules or `devDependencies` can lead to missing or incorrect versions when consumers install only the published build. Explicitly declaring runtime dependencies ensures all required packages are installed with correct versions.

## Recommendations

List runtime dependencies under `dependencies` or `peerDependencies` based on usage.

### When to Use `peerDependencies`

- Use `peerDependencies` when your package expects consumers to provide the dependency themselves.
- Ideal for plugins, frameworks, or shared libraries where multiple instances of the same package could cause issues.
- Prevents unnecessary duplication when multiple packages depend on the same dependency.

#### Important Note

Package managers do not install `peerDependencies` by default. This can cause issues during development if the dependency is unavailable. To avoid this, duplicate the dependency in `devDependencies` while still benefiting from the flexibility of `peerDependencies`.

### When to Use `dependencies`

- If your package directly requires a dependency at runtime, it **must** be listed in `dependencies`.
- Ensures that consumers of your package receive all required modules automatically when installing your package.
- If `peerDependencies` does not apply and your package cannot function without the dependency, use `dependencies` instead.

By correctly categorizing your dependencies, you ensure a more stable and predictable package installation experience for consumers.
