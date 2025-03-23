import child_process from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

export class PilotPack {
	private tarballPath: string;
	private packageDir = getPackageDir();

	generate(): void {
		console.time("buildPackage");
		this.build();
		console.timeEnd("buildPackage");

		console.time("createTarball");
		this.pack();
		console.timeEnd("createTarball");
	}

	drop(): void {
		child_process.execSync(`rm ${this.tarballPath}`);
	}

	getTarballPath(): string {
		return this.tarballPath;
	}

	private build(): void {
		child_process.execSync("npm run build", { cwd: this.packageDir });
	}

	private pack(): void {
		const tarballName = child_process
			.execSync("npm pack", {
				cwd: this.packageDir,
				stdio: "pipe",
			})
			.toString()
			.trim();

		this.tarballPath = path.join(this.packageDir, tarballName);
	}
}

function getPackageDir(): string {
	const relativePath = "../..";

	const filename =
		typeof __filename !== "undefined"
			? __filename
			: // @ts-ignore
				fileURLToPath(import.meta.url);

	return path.resolve(path.dirname(filename), relativePath);
}
