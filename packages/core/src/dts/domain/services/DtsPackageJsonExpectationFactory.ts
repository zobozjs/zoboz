import type { FilesRepository } from "@shared/domain/interfaces/FilesRepository";
import type { PackageJsonExportsField } from "@shared/domain/interfaces/PackageJsonExportsField";
import type { ExportsConfig } from "@shared/domain/valueObjects/ExportsConfig";
import { PackageJsonExpectation } from "@shared/domain/valueObjects/PackageJsonExpectation";
import { RelativeSpecifier } from "@shared/domain/valueObjects/RelativeSpecifier";
import type { SrcDir } from "@shared/domain/valueObjects/SrcDir";
import type { DtsOutDir } from "../valueObjects/DtsOutDir";

export class DtsPackageJsonExpectationFactory {
	constructor(
		private readonly moduletype: "cjs" | "esm",
		private readonly filesRepository: FilesRepository,
		private readonly exportsConfig: ExportsConfig,
		private readonly srcDir: SrcDir,
		private readonly outDir: DtsOutDir,
	) {}

	public async create(): Promise<Promise<PackageJsonExpectation>> {
		const exportsMap = await this.generatePackageJsonExports();

		return new PackageJsonExpectation(
			this.filesRepository,
			this.moduletype === "cjs"
				? {
						exports: exportsMap,
						types: exportsMap["."].require.types,
					}
				: {
						exports: exportsMap,
					},
		);
	}

	private async distFromSrc(relativeSrcPath: string): Promise<string> {
		const uri = this.replaceExtension(
			relativeSrcPath.replace(this.srcDir.uri, this.outDir.uri),
			".d.ts",
		);

		return new RelativeSpecifier(uri).uri;
	}

	private async generatePackageJsonExports(): Promise<PackageJsonExportsField> {
		const entries = this.exportsConfig.entries().map(async ([k, v]) => [
			k,
			{
				[this.moduletype === "esm" ? "import" : "require"]: {
					types: await this.distFromSrc(v),
				},
			},
		]);

		return Object.fromEntries(await Promise.all(entries));
	}

	private replaceExtension(uri: string, ext: string) {
		return uri.replace(/\.[^/.]+$/, ext);
	}
}
