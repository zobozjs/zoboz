---
title: 'Getting Started'
sidebar_position: 2
---

# Getting Started with @zoboz/bam

Integrating `@zoboz/bam` into your project allows you to enhance your package distribution by validating and fixing `package.json` inconsistencies, refining import/export specifiers, and ensuring runtime dependencies are properly listed.

## Installation

Install `@zoboz/bam` globally:

```bash
npm install -g @zoboz/bam
```

Or as a development dependency:

```bash
npm install --save-dev @zoboz/bam
```

## Commands and Usage

### Validating `package.json`

Ensure your `package.json` is structured correctly and lists all necessary runtime dependencies:

```bash
zoboz-bam verify-package-json --absolute-package-dir /path/to/package
```

If any issues are detected, Zoboz will provide a detailed report.

### Fixing `package.json`

To automatically fix certain issues, such as removing unwanted fields or adding missing dependencies:

```bash
zoboz-bam verify-package-json --absolute-package-dir /path/to/package --can-update-package-json
```

Zoboz will modify `package.json` accordingly.

### Reformatting Import Specifiers

Adjust import/export specifiers in your project to ensure consistency and compatibility:

```bash
zoboz-bam reformat-specifiers \
  --absolute-package-dir /path/to/package \
  --absolute-source-dir /path/to/src \
  --absolute-output-dir /path/to/dist \
  --output-format esm
```

Supported output formats: `esm`, `cjs`, and `dts`.

### Handling Missing Dependencies

If a runtime dependency is missing from `dependencies` but is used in your package, Zoboz will flag it:

```bash
zoboz-bam verify-package-json --absolute-package-dir /path/to/package
```

To fix this manually, follow the error message link to understand why the dependency is needed.

## Additional Resources

For more advanced configurations and troubleshooting, refer to the [official Zoboz documentation](https://github.com/zobozjs/zoboz#readme).

By following these steps, `@zoboz/bam` ensures your package remains fully compatible and structured correctly after every build.
