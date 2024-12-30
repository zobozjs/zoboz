#!/usr/bin/env node

import fs from "node:fs";
import { register } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Command } from "commander";
import { build } from "../dist/mjs/index.mjs";
import { logger } from "../dist/mjs/shared/supporting/logger.mjs";

const program = new Command();

program
	.name("zoboz")
	.description("CLI for 🐐 zoboz | d.ts + mjs + cjs - hassle")
	.version("1.0.0");

program
	.command("init")
	.description("generate a minimal zoboz.config.ts")
	.action(async () => {
		const configPath = path.resolve(process.cwd(), "zoboz.config.ts");

		if (fs.existsSync(configPath)) {
			logger.error(
				`zoboz.config.ts already exists in the package's root directory.`,
			);

			logger.hint("You can already run `zoboz build` to build your project.");
			process.exit(1);
		}

		const template = [
			'import { BuildConfig, tsc } from "@zoboz/core";',
			"",
			"export default new BuildConfig({",
			"  mjs: new tsc.MjsConfig(),",
			"  cjs: new tsc.CjsConfig(),",
			"  dts: new tsc.DtsConfig(),",
			"  exports: {",
			'    ".": "./src/index.ts",',
			"  },",
			"});",
			"",
		].join("\n");

		fs.writeFileSync(configPath, template);

		logger.success(`Created zoboz.config.ts in the package's root directory.`);

		logger.hint("Now you can run `zoboz build` to build your project.");
	});

program
	.command("build")
	.description("Build the project using zoboz.config.ts")
	.action(async () => {
		const tsloadPath = path.resolve(import.meta.dirname, "tsload.mjs");

		if (!fs.existsSync(tsloadPath)) {
			logger.error(
				'Could not find "tsload.mjs". Make sure it is included in the package.',
			);
			process.exit(1);
		}

		// Load the user's config
		const config = await getZobozConfig(tsloadPath);

		// Use the loaded configuration
		logger.debug("Loaded config:", config);

		build(config);
	});

program.parse(process.argv);

// Load user config dynamically using your `tsload` loader
async function getZobozConfig(tsloadPath) {
	const configPath = path.resolve(process.cwd(), "zoboz.config.ts");

	if (!fs.existsSync(configPath)) {
		logger.error(
			"Could not find zoboz.config.ts in the current working directory.",
		);
		logger.hint("Run `zoboz init` to generate a new config file.");
		process.exit(1);
	}

	try {
		// Register your tsload loader
		register(tsloadPath, pathToFileURL("./"));

		// Dynamically import the TypeScript config file
		const { default: userConfig } = await import(configPath);
		return userConfig;
	} catch (error) {
		logger.error("Error loading zoboz.config.ts:", error);
		process.exit(1);
	}
}
