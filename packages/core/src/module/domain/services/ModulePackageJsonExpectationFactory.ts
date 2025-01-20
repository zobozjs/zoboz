import type { FilesRepository } from "../../../shared/domain/interfaces/FilesRepository";
import type { ExportsConfig } from "../../../shared/domain/valueObjects/ExportsConfig";
import { PackageJsonExpectation } from "../../../shared/domain/valueObjects/PackageJsonExpectation";
import type { SrcDir } from "../../../shared/domain/valueObjects/SrcDir";
import type { ModuleOutDir } from "../valueObjects/ModuleOutDir";

export class ModulePackageJsonExpectationFactory {
	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly exportsConfig: ExportsConfig,
		private readonly srcDir: SrcDir,
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

	private async distFromSrc(relativeSrcPath: string): Promise<string> {
		const uri = this.replaceExtension(
			relativeSrcPath.replace(this.srcDir.uri, this.outDir.uri),
			".js",
		);

		return this.withLeadingDotSlash(uri);
	}

	private async generatePackageJsonExports(): Promise<
		Record<string, Record<"import", string>>
	> {
		const entries = this.exportsConfig
			.entries()
			.map(async ([entryAlias, srcPath]) => [
				entryAlias,
				{ import: await this.distFromSrc(srcPath) },
			]);

		return Object.fromEntries(await Promise.all(entries));
	}

	private replaceExtension(uri: string, ext: string) {
		return uri.replace(/\.[^/.]+$/, ext);
	}

	private withLeadingDotSlash(uri: string) {
		const dotSlash = "./";
		return uri.startsWith("./") ? uri : `${dotSlash}${uri}`;
	}
}
