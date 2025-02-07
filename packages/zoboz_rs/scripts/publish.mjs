// "os": "aix", "darwin", "freebsd", "linux", "openbsd", "sunos", "win32"
// "cpu": "x64", "arm", "arm64", "ia32", "mips", "mipsel", "ppc", "ppc64", "s390", "s390x"

import fs from "fs";
import path from "path";

const packages = [
	{
		name: "@zoboz/rs-darwin-arm64",
		target: "aarch64-apple-darwin",
		binary: "zoboz_rs_darwin_arm64",
		cpu: "arm64",
		os: "darwin",
	},
	{
		name: "@zoboz/rs-win32-arm64",
		target: "aarch64-pc-windows-msvc",
		binary: "zoboz_rs_win32_arm64.exe",
		cpu: "arm64",
		os: "win32",
	},
	{
		name: "@zoboz/rs-linux-arm64",
		target: "aarch64-unknown-linux-musl",
		binary: "zoboz_rs_linux_arm64",
		cpu: "arm64",
		os: "linux",
	},
	{
		name: "@zoboz/rs-darwin-x64",
		target: "x86_64-apple-darwin",
		binary: "zoboz_rs_darwin_x64",
		cpu: "x64",
		os: "darwin",
	},
	{
		name: "@zoboz/rs-win32-x64",
		target: "x86_64-pc-windows-msvc",
		binary: "zoboz_rs_win32_x64.exe",
		cpu: "x64",
		os: "win32",
	},
	{
		name: "@zoboz/rs-linux-x64",
		target: "x86_64-unknown-linux-musl",
		binary: "zoboz_rs_linux_x64",
		cpu: "x64",
		os: "linux",
	},
];

for (const pkg of packages) {
	const packageDir = path.join(import.meta.dirname, "..", pkg.name);
	fs.mkdirSync(packageDir, { recursive: true });

	const packageJson = {
		name: pkg.name,
		version: "1.0.0",
		repository: {
			type: "git",
			url: "git+https://github.com/dariushalipour/zoboz.git",
		},
		license: "MIT",
		preferUnplugged: true,
		os: [pkg.os],
		cpu: [pkg.cpu],
		scripts: {
			test: 'echo "Error: no test specified" && exit 1',
		},
		keywords: [],
	};

	fs.writeFileSync(
		path.join(packageDir, "package.json"),
		JSON.stringify(packageJson, null, 2),
	);
}
