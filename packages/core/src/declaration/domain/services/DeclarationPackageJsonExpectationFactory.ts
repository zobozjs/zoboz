import type { ExportsConfig } from "../../../main/domain/valueObjects/ExportsConfig";
import type { FilesRepository } from "../../../shared/domain/interfaces/FilesRepository";
import { PackageJsonExpectation } from "../../../shared/domain/valueObjects/PackageJsonExpectation";
import type { SrcDir } from "../../../shared/domain/valueObjects/SrcDir";
import type { DeclarationOutDir } from "../valueObjects/DeclarationOutDir";

export class DeclarationPackageJsonExpectationFactory {
	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly exportsConfig: ExportsConfig,
		private readonly srcDir: SrcDir,
		private readonly outDir: DeclarationOutDir,
	) {}

	public async create(): Promise<Promise<PackageJsonExpectation>> {
		return new PackageJsonExpectation(this.filesRepository, {
			types: await this.generatePackageJsonMain(),
			exports: await this.generatePackageJsonExports(),
		});
	}

	private generatePackageJsonMain(): Promise<string> {
		return this.distFromSrc(this.exportsConfig.getRootExport());
	}

	private async distFromSrc(relativeSrcPath: string): Promise<string> {
		const uri = this.replaceExtension(
			relativeSrcPath.replace(this.srcDir.uri, this.outDir.uri),
			".d.ts",
		);

		return `./${uri}`;
	}

	private async generatePackageJsonExports(): Promise<
		Record<string, Record<"types", string>>
	> {
		const entries = this.exportsConfig
			.entries()
			.map(async ([k, v]) => [k, { types: await this.distFromSrc(v) }]);

		return Object.fromEntries(await Promise.all(entries));
	}

	private replaceExtension(uri: string, ext: string) {
		return uri.replace(/\.[^/.]+$/, ext);
	}
}
