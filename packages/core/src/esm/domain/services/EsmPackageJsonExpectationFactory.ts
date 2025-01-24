import type { FilesRepository } from "@shared/domain/interfaces/FilesRepository";
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
		return new PackageJsonExpectation(this.filesRepository, {
			module: this.generatePackageJsonMain(),
			exports: this.generatePackageJsonExports(),
		});
	}

	private generatePackageJsonMain(): string {
		return this.esmSrcDistMapper.distFromSrc(
			this.exportsConfig.getRootExport(),
		);
	}

	private generatePackageJsonExports(): Record<
		string,
		Record<"import", string>
	> {
		const entries = this.exportsConfig
			.entries()
			.map(([entryAlias, srcPath]) => [
				entryAlias,
				{ import: this.esmSrcDistMapper.distFromSrc(srcPath) },
			]);

		return Object.fromEntries(entries);
	}
}
