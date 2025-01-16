import * as path from "node:path";
import type { DtsConfig } from "../../main/domain/interfaces/DtsConfig.js";
import type { DistEmptier } from "../../main/domain/services/DistEmptier.js";
import type { ExportsConfig } from "../../main/domain/valueObjects/ExportsConfig.js";
import type { FileNode } from "../../shared/domain/entities/FileNode.js";
import type { BuildOrchestrator } from "../../shared/domain/interfaces/BuildOrchestrator.js";
import type { ExtensionChanger } from "../../shared/domain/interfaces/ExtensionChanger.js";
import type { FilesRepository } from "../../shared/domain/interfaces/FilesRepository.js";
import { BuildOrchestratorResult } from "../../shared/domain/valueObjects/BuildOrchestratorResult.js";
import { PackageJsonExpectation } from "../../shared/domain/valueObjects/PackageJsonExpectation.js";
import { logger } from "../../shared/supporting/logger.js";

export class DeclarationBuildOrchestrator implements BuildOrchestrator {
	private readonly outDirUri: string;

	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly distEmptier: DistEmptier,
		private readonly extensionChanger: ExtensionChanger,
		private readonly packageDir: FileNode,
		private readonly distDirUri: string,
		private readonly exportsConfig: ExportsConfig,
		private readonly dtsConfig: DtsConfig,
	) {
		this.outDirUri = path.join(this.distDirUri, "dts");
	}

	async build(): Promise<BuildOrchestratorResult> {
		const startTime = Date.now();
		const builder = this.dtsConfig.getBuilder();
		await this.distEmptier.remove(this.outDirUri);
		await builder.build(this.packageDir, this.outDirUri);

		const result = new BuildOrchestratorResult(
			await this.createPackageJsonExpectation(),
		);

		const endTime = Date.now();
		logger.debug(`Built Declarations: ${endTime - startTime}ms`);

		return result;
	}

	private async createPackageJsonExpectation(): Promise<
		Promise<PackageJsonExpectation>
	> {
		return new PackageJsonExpectation(this.filesRepository, {
			types: await this.generatePackageJsonMain(),
			exports: await this.generatePackageJsonExports(),
		});
	}

	private generatePackageJsonMain(): Promise<string> {
		return this.distFromSrc(this.exportsConfig.getRootExport());
	}

	private async distFromSrc(srcUri: string): Promise<string> {
		return srcUri
			.replace("./src", await this.packageDir.getRelativeUriOf(this.outDirUri))
			.replace(".ts", ".d.ts");
	}

	private async generatePackageJsonExports(): Promise<
		Record<string, Record<"types", string>>
	> {
		const entries = this.exportsConfig
			.entries()
			.map(async ([k, v]) => [k, { types: await this.distFromSrc(v) }]);

		return Object.fromEntries(await Promise.all(entries));
	}
}
