---
title: 'avoid-pkg-imports'
sidebar_position: 2
---
# Why You Should Avoid the `imports` Field in `package.json`

If your package supports TypeScript declaration files (`.d.ts`), ES modules (`.mjs`/`.js`), and CommonJS (`.cjs`), using the `imports` field in `package.json` can create unnecessary complexity and compatibility issues.

## Why Is It Problematic?

### 1. **Limited Support Across Environments**
The `imports` field is not universally supported by all bundlers, runtimes, and TypeScript configurations. Some tools may ignore it, leading to unexpected module resolution issues.

### 2. **Confuses the System During Development**
When your package is in development, builds may not exist yet, but the `imports` field still affects module resolution. This can cause issues where tools expect a structure that isn’t there, leading to unnecessary errors. If your development setup relies on `tsconfig.paths`, symlinks, or aliases, the behavior may differ from what happens in production, making debugging more difficult.

### 3. **Complicates TypeScript Resolution**
TypeScript does not automatically respect `imports` in the same way it handles `paths` in `tsconfig.json`. This means that TypeScript users may experience incorrect type resolution or missing types when using your package.

### 4. **Unnecessary When Using Proper `exports` Configuration**
The `exports` field already provides a structured way to expose modules for both CommonJS and ESM consumers. When configured correctly, `exports` ensures compatibility across all environments without needing `imports`.

## Recommended Approach

### Use `tsconfig.json` for Development Resolution

Instead of relying on `imports`, configure `tsconfig.json` to properly resolve module paths during development:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "your-package": ["./src/index.ts"],
      "your-package/*": ["./src/*"]
    }
  }
}
```

This allows TypeScript and tools like VSCode to resolve imports correctly without needing `imports` in `package.json`. The build process will then correctly generate `exports` for production.

To maximize compatibility while supporting TypeScript, ES modules, and CommonJS, avoid `imports` and use `exports` like this:

```json
{
  "name": "your-package",
  "exports": {
    "import": "./dist/esm/index.js",
    "require": "./dist/cjs/index.js",
    "types": "./dist/index.d.ts"
  },
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/index.d.ts"
}
```

This setup ensures:
- ES modules use `import` with the correct `.js` file.
- CommonJS uses `require` with the correct `.js` file.
- TypeScript finds the correct `.d.ts` file for typings.

By relying on `exports` instead of `imports`, you provide a clear, predictable, and widely supported module structure without introducing resolution conflicts.
