#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { build } from "../dist/esm/index.js";
import { logger } from "../dist/esm/shared/supporting/logger.js";
import { ZobozConfigFetcher } from "./deps/ZobozConfigFetcher.mjs";
import { doesNodeSupportTsConfig, nodeVersion } from "./deps/nodeVersion.mjs";
import { program } from "./deps/program.mjs";

logger.debug("Running zoboz on Node version:", nodeVersion);

program.registerCommand(
	"init",
	"generates a minimal zoboz.config.(ts|mjs) file in the package's root directory",
	[],
	async () => {
		const extension = doesNodeSupportTsConfig() ? "ts" : "mjs";
		const configPath = path.resolve(process.cwd(), `zoboz.config.${extension}`);

		if (fs.existsSync(configPath)) {
			logger.success(
				`Config file already exists in the package's root directory: (${configPath})`,
			);

			logger.hint("You can already run `zoboz build` to build your project.");
			process.exit(1);
		}

		const template = [
			'import { BuildConfig, esbuild, tsc } from "@zoboz/core";',
			"",
			"export default new BuildConfig({",
			"  esm: esbuild.esm(),",
			"  cjs: esbuild.cjs(),",
			"  dts: tsc.dts(),",
			'  srcDir: "./src",',
			'  distDir: "./dist",',
			"  exports: {",
			'    ".": "./src/index.ts",',
			"  },",
			"});",
			"",
		].join("\n");

		fs.writeFileSync(configPath, template);

		logger.success(`Config file created: (${configPath})`);

		logger.hint("Now you can run `zoboz build` to build your project.");
	},
);

program.registerCommand(
	"build",
	"Build the project using zoboz.config.(ts|mjs)",
	[
		{
			flag: "--update-package-json",
			name: "updatePackageJson",
			description: "Updates package.json if needed. CAUTION: Do not use in CI",
		},
	],
	async (options) => {
		const config = await new ZobozConfigFetcher().fetch();
		logger.debug("Loaded config:", config);
		build(config, options.updatePackageJson);
	},
);

program.parse();
