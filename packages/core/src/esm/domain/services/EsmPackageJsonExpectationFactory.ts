import type { FilesRepository } from "@shared/domain/interfaces/FilesRepository";
import type { PackageJsonExportsField } from "@shared/domain/interfaces/PackageJsonExportsField";
import type { ExportsConfig } from "@shared/domain/valueObjects/ExportsConfig";
import { PackageJsonExpectation } from "@shared/domain/valueObjects/PackageJsonExpectation";
import type { EsmSrcDistMapper } from "./EsmSrcDistMapper";

export class EsmPackageJsonExpectationFactory {
	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly exportsConfig: ExportsConfig,
		private readonly esmSrcDistMapper: EsmSrcDistMapper,
	) {}

	create(): PackageJsonExpectation {
		const exportsMap = this.generatePackageJsonExports();

		return new PackageJsonExpectation(this.filesRepository, {
			module: exportsMap["."].import.default,
			exports: exportsMap,
		});
	}

	private generatePackageJsonExports(): PackageJsonExportsField {
		const entries = this.exportsConfig
			.entries()
			.map(([entryAlias, srcPath]) => [
				entryAlias,
				{ import: { default: this.esmSrcDistMapper.distFromSrc(srcPath) } },
			]);

		return Object.fromEntries(entries);
	}
}
