#!/usr/bin/env node

import { spawnSync } from "child_process";
import { existsSync } from "fs";
import { createRequire } from "module";
import { arch, platform } from "os";

const require = createRequire(import.meta.url);

const hostOs = platform();
const hostCpu = arch();

const binaryPath = require.resolve(`@zoboz/bam-bin-${hostOs}-${hostCpu}`);

if (!binaryPath) {
	console.error(
		`Unsupported OS/CPU: ${hostOs}/${hostCpu}. Please check the documentation for supported environments.`,
	);
	process.exit(1);
}

const scriptIndex = process.argv.findIndex((arg) => arg.includes("zoboz-bam"));

const { status, error } = spawnSync(
	binaryPath,
	process.argv.slice(scriptIndex + 1),
	{ stdio: "inherit" },
);

if (error) {
	console.error(`Failed to start the binary: ${error.message}`);
	process.exit(1);
}

process.exit(status);
