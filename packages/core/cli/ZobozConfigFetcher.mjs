import * as fs from "fs";
import { createRequire } from "module";
import * as path from "path";
import * as url from "url";
import { logger } from "../dist/esm/js/shared/supporting/logger.js";
import { nodeVersion } from "./nodeVersion.mjs";

export class ZobozConfigFetcher {
	async fetch() {
		const zobozConfigTsPath = this.getTsPath();
		if (zobozConfigTsPath) {
			return new ZobozConfigTsFetcher().fetch(zobozConfigTsPath);
		}

		const zobozConfigMjsPath = this.getMjsPath();
		if (zobozConfigMjsPath) {
			return new ZobozConfigMjsFetcher().fetch(zobozConfigMjsPath);
		}

		logger.error('Could not find "zoboz.config.ts" or "zoboz.config.mjs"');
		logger.hint("Run `zoboz init` to generate a new config file.");
		process.exit(1);
	}

	getTsPath() {
		const tsConfigPath = path.resolve(process.cwd(), "zoboz.config.ts");
		return fs.existsSync(tsConfigPath) ? tsConfigPath : null;
	}

	getMjsPath() {
		const tsConfigPath = path.resolve(process.cwd(), "zoboz.config.mjs");
		return fs.existsSync(tsConfigPath) ? tsConfigPath : null;
	}
}

class ZobozConfigTsFetcher {
	async fetch(configPath) {
		if (nodeVersion.doesSupportModuleRegister()) {
			return await this.load_experimental(configPath);
		}

		return await this.load_stable(configPath);
	}

	load_stable(configPath) {
		const require = createRequire(import.meta.url);
		require.extensions[".ts"] = (module_, filename) => {
			const { transpile, ModuleKind, ScriptTarget } = require("typescript");
			const source = fs.readFileSync(filename, "utf8");
			const transpiled = transpile(source, {
				module: ModuleKind.CommonJS,
				target: ScriptTarget.ES2015,
			});

			// @ts-expect-error This is a private API
			module_._compile(transpiled, filename);
		};

		const { default: userConfig } = require(configPath);
		return userConfig;
	}

	async load_experimental(configPath) {
		// @ts-expect-error It is still not available in the types, since it is only a Release Candidate
		const { register } = await import("module");
		register("./cli/tsload.mjs", url.pathToFileURL(import.meta.dirname));
		const { default: userConfig } = await import(configPath);
		return userConfig;
	}
}

class ZobozConfigMjsFetcher {
	async fetch(configPath) {
		const { default: userConfig } = await import(configPath);
		return userConfig;
	}
}
