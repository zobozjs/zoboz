import child_process from "node:child_process";

export class PackageManager {
	constructor(private packageDir: string) {}

	init() {
		child_process.execSync("npm init -y", { cwd: this.packageDir });
	}

	installTypescript() {
		child_process.execSync("npm install --save-dev typescript", {
			cwd: this.packageDir,
		});

		child_process.execSync("npx tsc --init", { cwd: this.packageDir });
	}

	installZobozCore(zobozCoreTarballPath: string) {
		child_process.execSync(`npm install ${zobozCoreTarballPath}`, {
			cwd: this.packageDir,
		});
	}
}
