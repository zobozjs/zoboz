---
title: 'Introduction'
sidebar_position: 1
---

# Learn: Understanding Zoboz's Principles

Zoboz automates many of the tedious aspects of packaging and publishing JavaScript/TypeScript libraries, but understanding the principles behind it can help you take full control of your package’s structure, optimize workflows, and even troubleshoot edge cases when automation isn’t enough.

## Why Learn the Principles?

Even though almost everything Zoboz enforces can be auto-fixed, knowing why these fixes matter gives you an advantage. By understanding the reasoning behind Zoboz’s decisions, you can:

- **Make informed choices**: Automation is great, but sometimes you may want to override a rule or tweak settings based on your project’s needs.
- **Troubleshoot edge cases**: While Zoboz handles the most common issues, unusual build setups or dependencies might require manual intervention.
- **Improve your build process**: Learning best practices helps you structure your package in a way that minimizes friction in development, testing, and distribution.

## What You'll Learn

The Learn section is a deep dive into the best practices that Zoboz enforces, covering topics such as:

- **Why explicit dependency declarations matter**: Ensuring everything your package needs is actually listed, preventing missing dependencies after publishing.
- **How to structure `exports` correctly**: Avoiding CommonJS and ESM compatibility issues by defining package entry points properly.
- **Ensuring proper import specifiers**: How import paths should be formatted to maintain compatibility across different module systems.
- **Best practices for declaration files (`.d.ts`)**: Making sure your TypeScript types are correct and accessible to consumers.
- **Package field validation**: Why certain fields should be included (or omitted) from `package.json` to avoid unnecessary issues.

## Learn as You Fix

Zoboz is designed to provide useful feedback when something isn’t right. If a rule is broken and isn’t automatically fixable, Zoboz will give you a direct link to a relevant lesson explaining the issue in detail. This means you’re not just fixing problems—you’re gaining knowledge that improves your workflow over time.

## Next Steps

Explore the Learn section and start understanding how to structure a universally compatible, future-proof package. Whether you’re using Zoboz to automate fixes or manually refining your package, mastering these principles will make your packages more reliable and easier to maintain.
