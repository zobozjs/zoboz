import * as path from "path";
import type { FilesRepository } from "@shared/domain/interfaces/FilesRepository";
import type { OutDir } from "@shared/domain/valueObjects/OutDir";

export class TypeEnforcer {
	constructor(private readonly filesRepository: FilesRepository) {}

	async enforce(
		enforcedType: "commonjs" | "module",
		outDir: OutDir,
	): Promise<void> {
		const packageJson = { type: enforcedType };
		const packageJsonText = JSON.stringify(packageJson, null, 2);
		await this.filesRepository.write(
			path.join(outDir.uri, "/package.json"),
			`${packageJsonText}\n`,
		);
	}
}
