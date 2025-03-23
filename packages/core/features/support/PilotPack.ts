import child_process from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

export class PilotPack {
	private tarballPath: string;

	generate(): void {
		const packageDir = this.getPackageDir();

		console.time("buildPackage");
		this.build(packageDir);
		console.timeEnd("buildPackage");

		console.time("createTarball");
		this.pack(packageDir);
		console.timeEnd("createTarball");
	}

	drop(): void {
		child_process.execSync(`rm ${this.tarballPath}`);
	}

	getTarballPath(): string {
		return this.tarballPath;
	}

	private build(packageDir: string): void {
		child_process.execSync("npm run build", { cwd: packageDir });
	}

	private pack(packageDir: string): void {
		const tarballName = child_process
			.execSync("npm pack", {
				cwd: packageDir,
				stdio: "pipe",
			})
			.toString()
			.trim();

		this.tarballPath = path.join(packageDir, tarballName);
	}

	private getPackageDir(): string {
		return this.getPackageDirFromFilename(this.getFilename());
	}

	private getPackageDirFromFilename(filename: string): string {
		return path.resolve(path.dirname(filename), "../..");
	}

	private getFilename(): string {
		return typeof __filename !== "undefined"
			? __filename
			: // @ts-ignore
				fileURLToPath(import.meta.url);
	}
}
