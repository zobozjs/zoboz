# 🐐 zoboz | d.ts + mjs + cjs - hassle

## Requirements

Developers of `@zoboz/core` must use Node.js version 18 or above.

## Usage

1. Have a `tsconfig.json` in your package directory.
2. Run `zoboz init`.
3. Run `zoboz build`.

## Feature Compatibility Table

The following table only applies to the development phase of your package. However, the consumers of your package can rely on even older versions of Node.js if you do not use features unavailable in older versions. So basically, for your dependents, it is your package that decides Node.js version compatibility.

| Feature            | Node Version | For Older Node Versions        |
| ------------------ | ------------ | ------------------------------ |
| `zoboz.config.ts`  | >= 16        | Use `zoboz.config.mjs` instead |
| `zoboz.config.mjs` | >= 14        | --                             |
