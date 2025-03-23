import child_process from "node:child_process";
import path from "path";
import { getPackageDir } from "./getPackageDir.mjs";

export class PilotPack {
	#tarballPath;
	#packageDir = getPackageDir();

	generate() {
		console.time("buildPackage");
		this.#build();
		console.timeEnd("buildPackage");

		console.time("createTarball");
		this.#pack();
		console.timeEnd("createTarball");
	}

	drop() {
		child_process.execSync(`rm ${this.#tarballPath}`);
	}

	getTarballPath() {
		return this.#tarballPath;
	}

	#build() {
		child_process.execSync("npm run build", { cwd: this.#packageDir });
	}

	#pack() {
		const tarballName = child_process
			.execSync("npm pack", {
				cwd: this.#packageDir,
				stdio: "pipe",
			})
			.toString()
			.trim();

		this.#tarballPath = path.join(this.#packageDir, tarballName);
	}
}
