# 🐐 zoboz | d.ts + mjs + cjs - hassle

## What

Zoboz guarantees your library works flawlessly across all Node.js versions and configurations. It manages the build process and optimizes the distribution files, ensuring a consistent and dependable package for your users. Plus, it reviews and refines your `package.json` for you.

## Why

Developing libraries can be tricky, especially when aiming for the perfect build that works seamlessly with CommonJS, ES Modules, and includes proper type files. You want your library to just work for your consumers, regardless of their `tsconfig.json` module resolution. With `zoboz`, you don't need to worry about these subtle configurations. Let `zoboz` handle the complexities and keep your development process smooth and hassle-free. If there's room for improvement or an issue arises, an update from `zoboz` will fix it for everyone, so you can focus on what you do best.

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
