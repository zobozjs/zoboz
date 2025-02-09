#!/usr/bin/env node

import { platform, arch } from "os";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import { spawnSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const binaries = {
	darwin: {
		x64: "zoboz-bam-darwin-x64",
		arm64: "zoboz-bam-darwin-arm64",
	},
	linux: {
		x64: "zoboz-bam-linux-x64",
		arm64: "zoboz-bam-linux-arm64",
	},
	win32: {
		x64: "zoboz-bam-win32-x64.exe",
		arm64: "zoboz-bam-win32-arm64.exe",
	},
};

const currentPlatform = platform();
const currentArch = arch();

if (!binaries[currentPlatform] || !binaries[currentPlatform][currentArch]) {
	console.error(
		`Unsupported platform/architecture: ${currentPlatform} ${currentArch}. Please check the documentation for supported environments.`,
	);
	process.exit(1);
}

const binaryPath = join(
	__dirname,
	"binaries",
	binaries[currentPlatform][currentArch],
);

if (!existsSync(binaryPath)) {
	console.error(
		`Binary not found at path: ${binaryPath}. Please ensure the binary is correctly placed and has execution permissions.`,
	);
	process.exit(1);
}

const { status, error } = spawnSync(binaryPath, process.argv.slice(2), {
	stdio: "inherit",
});

if (error) {
	console.error(`Failed to start the binary: ${error.message}`);
	process.exit(1);
}

process.exit(status);
