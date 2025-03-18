import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export class PackageManager {
	constructor(private packageDir: string) {}

	init(zobozCoreTarballPath: string) {
		child_process.execSync(
			[
				"pnpm init",
				"npm pkg set packageManager=pnpm@9.15.4",
				`pnpm add -D --offline typescript@5.8.2 ${zobozCoreTarballPath}`,
			].join(" && "),
			{ cwd: this.packageDir },
		);

		this.createTsConfigTs();
	}

	private createTsConfigTs() {
		fs.writeFileSync(
			path.join(this.packageDir, "tsconfig.json"),
			JSON.stringify({}),
		);
	}
}
