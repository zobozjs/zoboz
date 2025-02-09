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
// docker run -it --rm --platform linux/arm64 -v `pwd`:/app rust bash -c "cd /app && rustup target add aarch64-unknown-linux-musl && cargo build --release --target aarch64-unknown-linux-musl"
// docker run -it --rm --platform linux/amd64 -v `pwd`:/app rust bash -c "cd /app && rustup target add x86_64-unknown-linux-musl && cargo build --release --target x86_64-unknown-linux-musl"
// rustup target add aarch64-pc-windows-msvc && cargo build --release --target aarch64-pc-windows-msvc
// rustup target add x86_64-pc-windows-msvc && cargo build --release --target x86_64-pc-windows-msvc

// `pwd`/target/aarch64-apple-darwin/release/zoboz_bam
// `pwd`/target/x86_64-apple-darwin/release/zoboz_bam
// docker run -it --rm --platform linux/arm64 -v `pwd`/target/aarch64-unknown-linux-musl/release:/app ubuntu /app/zoboz_bam
// docker run -it --rm --platform linux/amd64 -v `pwd`/target/x86_64-unknown-linux-musl/release:/app ubuntu /app/zoboz_bam
// ${pwd}/target/aarch64-pc-windows-msvc/release/zoboz_bam.exe
// ${pwd}/target/x86_64-pc-windows-msvc/release/zoboz_bam.exe

// cp target/aarch64-apple-darwin/release/zoboz_bam packages/zoboz_bam_darwin_arm64/zoboz_bam_darwin_arm64
// cp target/x86_64-apple-darwin/release/zoboz_bam packages/zoboz_bam_darwin_x64/zoboz_bam_darwin_x64
// cp target/aarch64-unknown-linux-musl/release/zoboz_bam packages/zoboz_bam_linux_arm64/zoboz_bam_linux_arm64
// cp target/x86_64-unknown-linux-musl/release/zoboz_bam packages/zoboz_bam_linux_x64/zoboz_bam_linux_x64
// cp target/aarch64-pc-windows-msvc/release/zoboz_bam.exe packages/zoboz_bam_win32_arm64/zoboz_bam_win32_arm64.exe
// cp target/x86_64-pc-windows-msvc/release/zoboz_bam.exe packages/zoboz_bam_win32_x64/zoboz_bam_win32_x64.exe

import fs from "fs";
import path from "path";

const packages = [
	{
		name: "@zoboz/rs-darwin-arm64",
		target: "aarch64-apple-darwin",
		binary: "zoboz_bam_darwin_arm64",
		cpu: "arm64",
		os: "darwin",
	},
	{
		name: "@zoboz/rs-win32-arm64",
		target: "aarch64-pc-windows-msvc",
		binary: "zoboz_bam_win32_arm64.exe",
		cpu: "arm64",
		os: "win32",
	},
	{
		name: "@zoboz/rs-linux-arm64",
		target: "aarch64-unknown-linux-musl",
		binary: "zoboz_bam_linux_arm64",
		cpu: "arm64",
		os: "linux",
	},
	{
		name: "@zoboz/rs-darwin-x64",
		target: "x86_64-apple-darwin",
		binary: "zoboz_bam_darwin_x64",
		cpu: "x64",
		os: "darwin",
	},
	{
		name: "@zoboz/rs-win32-x64",
		target: "x86_64-pc-windows-msvc",
		binary: "zoboz_bam_win32_x64.exe",
		cpu: "x64",
		os: "win32",
	},
	{
		name: "@zoboz/rs-linux-x64",
		target: "x86_64-unknown-linux-musl",
		binary: "zoboz_bam_linux_x64",
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
