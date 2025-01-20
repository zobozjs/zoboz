import type { FilesRepository } from "../../../shared/domain/interfaces/FilesRepository";
import type { ExportsConfig } from "../../../shared/domain/valueObjects/ExportsConfig";
import { PackageJsonExpectation } from "../../../shared/domain/valueObjects/PackageJsonExpectation";
import { RelativeSpecifier } from "../../../shared/domain/valueObjects/RelativeSpecifier";
import type { SrcDir } from "../../../shared/domain/valueObjects/SrcDir";
import type { CommonJsOutDir } from "../valueObjects/CommonJsOutDir";

export class CommonJsPackageJsonExpectationFactory {
	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly exportsConfig: ExportsConfig,
		private readonly srcDir: SrcDir,
		private readonly outDir: CommonJsOutDir,
	) {}

	public async create(): Promise<PackageJsonExpectation> {
		const exportsMap = await this.generatePackageJsonExports();
		return new PackageJsonExpectation(this.filesRepository, {
			main: exportsMap["."].require,
			exports: exportsMap,
		});
	}

	private async distFromSrc(relativeSrcPath: string): Promise<string> {
		const uri = this.replaceExtension(
			relativeSrcPath.replace(this.srcDir.uri, this.outDir.uri),
			".js",
		);

		return new RelativeSpecifier(uri).uri;
	}

	private async generatePackageJsonExports(): Promise<
		Record<string, Record<"require", string>>
	> {
		const entries = this.exportsConfig
			.entries()
			.map(async ([entryAlias, srcPath]) => {
				const entry = await this.distFromSrc(srcPath);
				return [entryAlias, { require: entry }];
			});

		return Object.fromEntries(await Promise.all(entries));
	}

	private replaceExtension(uri: string, ext: string) {
		return uri.replace(/\.[^/.]+$/, ext);
	}
}
