# 🐐 zoboz | d.ts + esm + cjs - hassle

# Why You Should Use Zoboz for Your Library Builds

## **The Problem with Library Development**
Building and distributing a Node.js library can feel like navigating a maze:
- Do you need CommonJS, ESM, or both?
- How do you ensure your TypeScript declarations just work?
- What about compatibility with older Node.js versions?
- Is your `package.json` properly configured for consumers?

The result? Many developers either spend hours tweaking their setup or end up with broken builds that frustrate their users. **This is where Zoboz comes in.**

---

## **What Zoboz Does**
Zoboz ensures your library works flawlessly across all Node.js versions and configurations. It takes care of everything:

### **1. Hassle-Free Builds**
Zoboz orchestrates the build process by leveraging robust tools like `esbuild`, `tsc`, and others. But unlike those tools, Zoboz focuses on the complete picture: ensuring your package works for your consumers regardless of their `tsconfig.json` settings or module preferences.

### **2. Automatic Compatibility**
Worried about Node.js version compatibility? Zoboz analyzes and optimizes your build, ensuring it works on all relevant versions. It even provides clear guidance for users of older Node.js versions.

### **3. Flawless TypeScript Support**
Your consumers expect type declarations to just work. Zoboz guarantees that your `.d.ts` files are included and correctly configured, no matter how complex your library is.

### **4. Smart Package.json Management**
One of Zoboz's standout features: it reviews and refines your `package.json` for you. This ensures:
- Correct `main`, `module`, and `types` fields.
- Accurate dependency declarations.
- Compatibility with modern and legacy Node.js environments.

### **5. Sub-Path Exports Made Easy**
With Zoboz, setting up sub-path exports is straightforward. For example, the following configuration:

```typescript
import { BuildConfig, tsc, esbuild } from "@zoboz/core";

export default new BuildConfig({
	esm: {}, // = { js: esbuild.esm(), dts: tsc.esm.dts() }
	cjs: {}, // = { js: esbuild.cjs(), dts: tsc.cjs.dts() }
	srcDir: "./src",
	distDir: "./dist",
	exports: {
		".": "./src/index.ts",
	},
});
```

will automatically generate the necessary `package.json` adjustments to handle `esm`, `cjs`, and `types` files correctly for each entry.

---

## **Why Zoboz Stands Out**

### **1. Beyond the Basics**
Tools like `esbuild` and `tsup` are fantastic at building your code, but they stop there. Zoboz goes further:
- It doesn’t just build your code; it ensures your **entire package** is optimized for distribution.
- It actively manages compatibility and resolves issues that others leave for you to handle.

### **2. Zero Config, Maximum Convenience**
With Zoboz, you don’t need to wrestle with configs or worry about edge cases. The workflow is as simple as:
1. Create a `tsconfig.json`.
2. Run `zoboz init` to set up.
3. Run `zoboz build` to generate your library files.

### **3. Continuous Improvement**
When Zoboz improves, so do your libraries. Updates to Zoboz automatically enhance your build process, ensuring you stay ahead of the curve without lifting a finger.

---

## Compatibility Table (Development Environment)
The following table applies to the development phase of your package. Consumers of your package can rely on even older versions of Node.js if you do not use features unavailable in older versions. Essentially, your package determines Node.js compatibility for its users.

### Features

| Feature            | Node Version | For Older Node Versions        |
| ------------------ | ------------ | ------------------------------ |
| `zoboz.config.ts`  | >= 16        | Use `zoboz.config.mjs` instead |
| `zoboz.config.mjs` | >= 14        | --                             |

### OS & CPU Compatibility

| Operating System | arm64          | x64            |
| ---------------- | -------------- | -------------- |
| MacOS            | ✅ Fully Native | ✅ Fully Native |
| Linux            | ✅ Fully Native | ✅ Fully Native |
| Windows          | ✅ Fully Native | ✅ Fully Native |

---

## **Who Should Use Zoboz?**
If you:
- Maintain or plan to build a Node.js library.
- Want a tool that handles **every aspect** of library distribution.
- Are tired of dealing with broken builds, misconfigured `package.json` files, or compatibility headaches.

Then Zoboz is for you.

---

## **Get Started**
Getting started with Zoboz is easy:

1. Install Zoboz:
   ```bash
   npm install --save-dev @zoboz/core
   ```

2. Initialize your project:
   ```bash
   npx zoboz init
   ```

3. Build your library:
   ```bash
   npx zoboz build
   ```

And that’s it! Zoboz will handle the rest, ensuring your library is perfectly built and ready for your users.

---

### Why the Name "Zoboz"?

Pronounced *zoh-bohz* (rhymes with "no" and "pose"), the name "Zoboz" is a **palindrome**—it reads the same forwards and backwards. This is a nod to the library's mission of ensuring compatibility and readability across all configurations and consumers, regardless of their environment or module preferences.  

The name also draws inspiration from the Persian idiom **"tiz o boz"**, meaning "fast and dexterous." In Persian, *boz* translates to "goat"—symbolizing agility and surefootedness. Just like a goat navigating rocky terrain, Zoboz handles the complexities of library builds with precision and ease.
