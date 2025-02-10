# @zoboz/bam

**Blazing-fast Automation Module (BAM)** for your JavaScript/TypeScript projects. This package delivers Zoboz's powerful safety checks and shimming features without forcing you into a specific orchestration flow.

## What is @zoboz/bam?

`@zoboz/bam` is the lightweight, high-performance core of Zoboz's functionality, designed for developers who want maximum flexibility. It provides essential features like:

- **Dependency validation**: Ensure your `package.json` stays clean and consistent.
- **Shimming**: Smooth over common inconsistencies between different environments.
- **Safety checks**: Guard against common mistakes in project configurations.

All of this without dictating how you should orchestrate your workflows.

## How is @zoboz/bam different from @zoboz/core?

| Feature           | @zoboz/bam                       | @zoboz/core                                  |
| ----------------- | -------------------------------- | -------------------------------------------- |
| **Orchestration** | Manual, you control the flow     | Automated, handles everything out of the box |
| **Performance**   | Optimized, minimal overhead      | Slightly heavier due to orchestration layer  |
| **Flexibility**   | Total, use what you need         | Less flexible, but convenient                |
| **Dependencies**  | Lean, no extra bloat             | Includes all orchestration dependencies      |
| **Ideal for**     | Advanced users, custom workflows | Quick setups, full automation                |

## When Should You Use @zoboz/bam?

- You want to **control the orchestration** yourself.
- You only need **specific features** like safety checks or shimming.
- You’re building a **custom pipeline** and don't want unnecessary overhead.
- You prefer **modular, fast** tools over full-stack automation.

If you're looking for a more "plug-and-play" experience where everything is handled for you, check out [`@zoboz/core`](https://npmjs.com/package/@zoboz/core).


## ** Compatibility Table (Development Environment) **
The following table applies to the development phase of your package. Consumers of your package can rely on even older versions of Node.js if you do not use features unavailable in older versions. Essentially, your package determines Node.js compatibility for its users.

### OS & CPU Compatibility

| Operating System | arm64          | x64            |
| ---------------- | -------------- | -------------- |
| MacOS            | ✅ Fully Native | ✅ Fully Native |
| Linux            | ✅ Fully Native | ✅ Fully Native |
| Windows          | ✅ Fully Native | ✅ Fully Native |

## Installation

```bash
npm install -g @zoboz/bam
```

or with Yarn:

```bash
yarn global add @zoboz/bam
```

## Usage Examples

### Reformat Specifiers

Reformat import/export specifiers in your project files.

```bash
zoboz-bam reformat-specifiers \
  --absolute-package-dir /path/to/your/package \
  --absolute-source-dir /path/to/your/src \
  --absolute-output-dir /path/to/output \
  --output-format esm
```

Notice: the file contents for both absolute-source-dir and absolute-output-dir should already exist. This tool is going to overwrite the needed adjustments in the absolute-output-dir. Think of it more like how a linter with --fix works, but on the generated dist code rather than the source code. 

**Options:**
- `--absolute-package-dir`: Absolute path to your `package.json` directory.
- `--absolute-source-dir`: Absolute path to the actual source code directory.
- `--absolute-output-dir`: Absolute path to the already transpiled output, to get reformatted.
- `--output-format`: Specify the output format the output is following (`dts`, `esm`, or `cjs`).

### Verify package.json

Verify and optionally fix issues in your `package.json` file.

```bash
zoboz-bam verify-package-json \
  --absolute-package-dir /path/to/your/package \
  --can-update-package-json
```

**Options:**
- `--absolute-package-dir`: Absolute path to your `package.json` directory.
- `--can-update-package-json`: If included, the tool will automatically fix detected issues.

## Why Choose @zoboz/bam?

- **Blazing Fast**: Minimal overhead, maximum performance.
- **Modular**: Use exactly what you need, nothing more.
- **Customizable**: Perfect for advanced users and unique workflows.

If you want automation without sacrificing control, `@zoboz/bam` is your go-to.

## License

MIT License. 

---

For full automation, orchestration, and more out-of-the-box features, check out [`@zoboz/core`](https://npmjs.com/package/@zoboz/core).

---

Happy hacking! 🚀

