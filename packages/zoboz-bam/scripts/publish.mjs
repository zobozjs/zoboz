// "os": "aix", "darwin", "freebsd", "linux", "openbsd", "sunos", "win32"
// "cpu": "x64", "arm", "arm64", "ia32", "mips", "mipsel", "ppc", "ppc64", "s390", "s390x"

// rustup target add aarch64-unknown-linux-musl
// rustup target add x86_64-unknown-linux-musl
// rustup target add aarch64-apple-darwin
// rustup target add x86_64-apple-darwin
// rustup target add aarch64-pc-windows-msvc
// rustup target add x86_64-pc-windows-msvc

// cargo zigbuild --release --target aarch64-unknown-linux-musl
// cargo zigbuild --release --target x86_64-unknown-linux-musl
// cargo zigbuild --release --target aarch64-pc-windows-msvc
// cargo zigbuild --release --target x86_64-pc-windows-msvc

// possibly safer ways to build
// rustup target add aarch64-pc-windows-msvc && cargo build --release --target aarch64-pc-windows-msvc
// rustup target add x86_64-pc-windows-msvc && cargo build --release --target x86_64-pc-windows-msvc

// `pwd`/target/aarch64-apple-darwin/release/zoboz-bam
// `pwd`/target/x86_64-apple-darwin/release/zoboz-bam
// docker run -it --rm --platform linux/arm64 -v `pwd`/target/aarch64-unknown-linux-musl/release:/app ubuntu /app/zoboz-bam
// docker run -it --rm --platform linux/amd64 -v `pwd`/target/x86_64-unknown-linux-musl/release:/app ubuntu /app/zoboz-bam
// ${pwd}/target/aarch64-pc-windows-msvc/release/zoboz-bam.exe
// ${pwd}/target/x86_64-pc-windows-msvc/release/zoboz-bam.exe

// cp target/aarch64-apple-darwin/release/zoboz-bam packages/zoboz-bam-darwin-arm64/zoboz-bam-darwin-arm64
// cp target/x86_64-apple-darwin/release/zoboz-bam packages/zoboz-bam-darwin-x64/zoboz-bam-darwin-x64
// cp target/aarch64-unknown-linux-musl/release/zoboz-bam packages/zoboz-bam-linux-arm64/zoboz-bam-linux-arm64
// cp target/x86_64-unknown-linux-musl/release/zoboz-bam packages/zoboz-bam-linux-x64/zoboz-bam-linux-x64
// cp target/aarch64-pc-windows-msvc/release/zoboz-bam.exe packages/zoboz-bam-win32-arm64/zoboz-bam-win32-arm64.exe
// cp target/x86_64-pc-windows-msvc/release/zoboz-bam.exe packages/zoboz-bam-win32-x64/zoboz-bam-win32-x64.exe

import fs from "fs";
import path from "path";

const packages = [
	{
		name: "@zoboz/rs-darwin-arm64",
		target: "aarch64-apple-darwin",
		binary: "zoboz-bam-darwin-arm64",
		cpu: "arm64",
		os: "darwin",
	},
	{
		name: "@zoboz/rs-win32-arm64",
		target: "aarch64-pc-windows-msvc",
		binary: "zoboz-bam-win32-arm64.exe",
		cpu: "arm64",
		os: "win32",
	},
	{
		name: "@zoboz/rs-linux-arm64",
		target: "aarch64-unknown-linux-musl",
		binary: "zoboz-bam-linux-arm64",
		cpu: "arm64",
		os: "linux",
	},
	{
		name: "@zoboz/rs-darwin-x64",
		target: "x86_64-apple-darwin",
		binary: "zoboz-bam-darwin-x64",
		cpu: "x64",
		os: "darwin",
	},
	{
		name: "@zoboz/rs-win32-x64",
		target: "x86_64-pc-windows-msvc",
		binary: "zoboz-bam-win32-x64.exe",
		cpu: "x64",
		os: "win32",
	},
	{
		name: "@zoboz/rs-linux-x64",
		target: "x86_64-unknown-linux-musl",
		binary: "zoboz-bam-linux-x64",
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
