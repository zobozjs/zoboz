import * as fs from "fs";
import * as path from "path";

export class TscBinary {
	public readonly path: string;

	constructor() {
		this.path = this.findPath();
	}

	private findPath() {
		let currentDir = path.resolve(process.cwd());

		while (currentDir !== path.parse(currentDir).root) {
			const tscPath = path.join(currentDir, "node_modules", ".bin", "tsc");
			if (fs.existsSync(tscPath)) {
				return tscPath;
			}

			currentDir = path.dirname(currentDir);
		}

		throw new Error(
			"tsc binary not found -- ensure you have package typescript installed.",
		);
	}
}
