---
title: 'Getting Started'
sidebar_position: 2
---

# Getting Started with @zoboz/core

Integrating `@zoboz/core` into your project is straightforward. Follow the steps below to automate your package builds.

## Installation

Install `@zoboz/core` as a development dependency:

```bash
npm install --save-dev @zoboz/core
```

## Initialization

Initialize Zoboz in your project directory:

```bash
npx zoboz init
```

This command creates a `zoboz.config.ts` file in your project's root directory.

## Configuration

Customize the `zoboz.config.ts` file to fit your project's needs. Here's an example configuration:

```typescript
import { BuildConfig, tsc, esbuild } from "@zoboz/core";

export default new BuildConfig({
	esm: {}, // Defaults to { js: esbuild.esm(), dts: tsc.esm.dts() }
	cjs: {}, // Defaults to { js: esbuild.cjs(), dts: tsc.cjs.dts() }
  srcDir: "./src",
  distDir: "./dist",
  exports: {
    ".": "./src/index.ts",
  },
});
```

## Building Your Package

Once configured, build your package with:

```bash
npx zoboz build
```

This command generates the specified module formats and TypeScript declaration files in the `dist` directory.

## Additional Resources

For advanced configurations and troubleshooting, refer to the [Zoboz documentation](https://github.com/zobozjs/zoboz#readme).

By following these steps, `@zoboz/core` will automate your package build process, ensuring compatibility and efficiency.
