import type { FilesRepository } from "@shared/domain/interfaces/FilesRepository";
import type { PackageJsonExportsField } from "@shared/domain/interfaces/PackageJsonExportsField";
import type { SrcDistMapper } from "@shared/domain/interfaces/SrcDistMapper";
import type { ExportsConfig } from "@shared/domain/valueObjects/ExportsConfig";
import { PackageJsonExpectation } from "@shared/domain/valueObjects/PackageJsonExpectation";

export class CjsPackageJsonExpectationFactory {
	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly exportsConfig: ExportsConfig,
		private readonly srcDistMapper: SrcDistMapper,
	) {}

	public async create(): Promise<PackageJsonExpectation> {
		const exportsMap = await this.generatePackageJsonExports();
		return new PackageJsonExpectation(this.filesRepository, {
			main: exportsMap["."].require.default,
			exports: exportsMap,
		});
	}

	private async generatePackageJsonExports(): Promise<PackageJsonExportsField> {
		const entries = this.exportsConfig
			.entries()
			.map(async ([entryAlias, srcPath]) => {
				const entry = await this.srcDistMapper.distFromSrc(srcPath);
				return [entryAlias, { require: { default: entry } }];
			});

		return Object.fromEntries(await Promise.all(entries));
	}
}
