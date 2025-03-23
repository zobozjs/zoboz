import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export class ScenarioPackage {
	constructor(private scenarioPackageDir: string) {}

	init(zobozCoreTarballPath: string) {
		fs.writeFileSync(
			path.join(this.scenarioPackageDir, "package.json"),
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

		this.exec("pnpm install --prefer-offline");
		this.createTsConfigTs();
	}

	setInPackageJson(key: string, value: string) {
		this.exec(`npm pkg set "${key}"="${value}"`);
	}

	private createTsConfigTs() {
		fs.writeFileSync(
			path.join(this.scenarioPackageDir, "tsconfig.json"),
			JSON.stringify({}),
		);
	}

	private exec(command: string) {
		child_process.execSync(command, { cwd: this.scenarioPackageDir });
	}
}
