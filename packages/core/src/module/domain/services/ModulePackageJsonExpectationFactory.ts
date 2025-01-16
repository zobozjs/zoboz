import type { ExportsConfig } from "../../../main/domain/valueObjects/ExportsConfig";
import type { FileNode } from "../../../shared/domain/entities/FileNode";
import type { FilesRepository } from "../../../shared/domain/interfaces/FilesRepository";
import { PackageJsonExpectation } from "../../../shared/domain/valueObjects/PackageJsonExpectation";
import type { ModuleOutDir } from "../valueObjects/ModuleOutDir";

export class ModulePackageJsonExpectationFactory {
	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly exportsConfig: ExportsConfig,
		private readonly packageDir: FileNode,
		private readonly outDir: ModuleOutDir,
	) {}

	async create(): Promise<PackageJsonExpectation> {
		return new PackageJsonExpectation(this.filesRepository, {
			module: await this.generatePackageJsonMain(),
			exports: await this.generatePackageJsonExports(),
		});
	}

	private generatePackageJsonMain(): Promise<string> {
		return this.distFromSrc(this.exportsConfig.getRootExport());
	}

	private async distFromSrc(srcUri: string): Promise<string> {
		return srcUri
			.replace("./src", await this.packageDir.getRelativeUriOf(this.outDir.uri))
			.replace(".ts", ".mjs");
	}

	private async generatePackageJsonExports(): Promise<
		Record<string, Record<"import", string>>
	> {
		const entries = this.exportsConfig
			.entries()
			.map(async ([k, v]) => [k, { import: await this.distFromSrc(v) }]);

		return Object.fromEntries(await Promise.all(entries));
	}
}
