import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export class PackageManager {
	constructor(private packageDir: string) {}

	init(zobozCoreTarballPath: string) {
		fs.writeFileSync(
			path.join(this.packageDir, "package.json"),
			JSON.stringify(
				{
					name: "my-package",
					version: "1.0.0",
					main: "index.js",
					scripts: {},
					keywords: [],
					author: "",
					license: "ISC",
					packageManager: "pnpm@9.15.4",
					devDependencies: {
						"@zoboz/core": `file:${zobozCoreTarballPath}`,
						typescript: "5.8.2",
					},
				},
				null,
				2,
			),
		);

		child_process.execSync("pnpm install --prefer-offline", {
			cwd: this.packageDir,
		});

		this.createTsConfigTs();
	}

	setInPackageJson(key: string, value: string) {
		child_process.execSync(`npm pkg set "${key}"="${value}"`, {
			cwd: this.packageDir,
		});
	}

	private createTsConfigTs() {
		fs.writeFileSync(
			path.join(this.packageDir, "tsconfig.json"),
			JSON.stringify({}),
		);
	}
}
