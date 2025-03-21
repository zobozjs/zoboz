import child_process from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

export class ZobozCorePacker {
	private tarballPath: string;

	pack() {
		const zobozCoreDir = this.getZobozDirectory();

		console.time("buildZobozProject");
		this.buildZobozProject(zobozCoreDir);
		console.timeEnd("buildZobozProject");

		console.time("createTarball");
		const zobozCoreTarballPath = this.createTarball(zobozCoreDir);
		console.timeEnd("createTarball");

		return zobozCoreTarballPath;
	}

	drop() {
		child_process.execSync(`rm ${this.tarballPath}`);
	}

	getTarballPath() {
		return this.tarballPath;
	}

	private getZobozDirectory() {
		const __filename = fileURLToPath(import.meta.url);
		const zobozDir = path.resolve(path.dirname(__filename), "../..");
		return zobozDir;
	}

	private buildZobozProject(zobozCoreDir: string) {
		child_process.execSync("npm run build", { cwd: zobozCoreDir });
	}

	private createTarball(zobozCoreDir: string) {
		const tarballName = child_process
			.execSync("npm pack", {
				cwd: zobozCoreDir,
				stdio: "pipe",
			})
			.toString()
			.trim();

		this.tarballPath = path.join(zobozCoreDir, tarballName);
	}
}
