#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Command } from "commander";
import { build } from "../dist/mjs/index.js";
import { logger } from "../dist/mjs/shared/supporting/logger.js";

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
			'  srcDir: "./src",',
			'  distDir: "./dist",',
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

const buildProgram = program
	.command("build")
	.description("Build the project using zoboz.config.ts")
	.option(
		"--update-package-json",
		"Updates package.json if needed. CAUTION: Do not use in CI",
	)
	.action(async () => {
		const options = buildProgram.opts();

		// Load the user's config
		const config = await getZobozConfig();

		// Use the loaded configuration
		logger.debug("Loaded config:", config);

		build(config, options.updatePackageJson ?? true);
	});

program.parse(process.argv);

// Load user config dynamically using your `tsload` loader
async function getZobozConfig() {
	try {
		return await getZobozConfigTs(false);
	} catch {
		return await getZobozConfigMjs(true);
	}
}

async function getZobozConfigTs(shouldExitOnError) {
	const configPath = path.resolve(process.cwd(), "zoboz.config.ts");

	if (!fs.existsSync(configPath)) {
		logger.error(
			"Could not find zoboz.config.ts in the current working directory.",
		);
		logger.hint("Run `zoboz init` to generate a new config file.");
		if (shouldExitOnError) {
			process.exit(1);
		} else {
			throw new Error("Config file not found");
		}
	}

	const tsloadPath = path.resolve(import.meta.dirname, "tsload.mjs");

	if (!fs.existsSync(tsloadPath)) {
		logger.error(
			'Could not find "tsload.mjs". Make sure it is included in the package.',
		);
		process.exit(1);
	}

	try {
		const { register } = await import("node:module");

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

async function getZobozConfigMjs(shouldExitOnError) {
	const configPath = path.resolve(process.cwd(), "zoboz.config.mjs");

	if (!fs.existsSync(configPath)) {
		logger.error(
			"Could not find zoboz.config.mjs in the current working directory.",
		);
		logger.hint("Run `zoboz init` to generate a new config file.");
		if (shouldExitOnError) {
			process.exit(1);
		} else {
			throw new Error("Config file not found");
		}
	}

	try {
		const { default: userConfig } = await import(configPath);
		return userConfig;
	} catch (error) {
		logger.error("Error loading zoboz.config.ts:", error);
		process.exit(1);
	}
}
