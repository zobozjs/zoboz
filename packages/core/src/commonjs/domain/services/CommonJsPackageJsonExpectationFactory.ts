import type { ExportsConfig } from "../../../main/domain/valueObjects/ExportsConfig";
import type { FileNode } from "../../../shared/domain/entities/FileNode";
import type { FilesRepository } from "../../../shared/domain/interfaces/FilesRepository";
import { PackageJsonExpectation } from "../../../shared/domain/valueObjects/PackageJsonExpectation";
import type { CommonJsOutDir } from "../valueObjects/CommonJsOutDir";

export class CommonJsPackageJsonExpectationFactory {
	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly packageDir: FileNode,
		private readonly exportsConfig: ExportsConfig,
		private readonly outDir: CommonJsOutDir,
	) {}

	public async create(): Promise<PackageJsonExpectation> {
		return new PackageJsonExpectation(this.filesRepository, {
			main: await this.generatePackageJsonMain(),
			exports: await this.generatePackageJsonExports(),
		});
	}

	private generatePackageJsonMain(): Promise<string> {
		return this.distFromSrc(this.exportsConfig.getRootExport());
	}

	private async distFromSrc(srcUri: string): Promise<string> {
		return srcUri
			.replace("./src", await this.packageDir.getRelativeUriOf(this.outDir.uri))
			.replace(".ts", ".cjs");
	}

	private async generatePackageJsonExports(): Promise<
		Record<string, Record<"require", string>>
	> {
		const entries = this.exportsConfig
			.entries()
			.map(async ([k, v]) => [k, { require: await this.distFromSrc(v) }]);

		return Object.fromEntries(await Promise.all(entries));
	}
}
