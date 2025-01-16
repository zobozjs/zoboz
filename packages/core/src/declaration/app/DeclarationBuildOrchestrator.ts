import * as path from "node:path";
import type { DtsConfig } from "../../main/domain/interfaces/DtsConfig.js";
import type { DistEmptier } from "../../main/domain/services/DistEmptier.js";
import type { ExportsConfig } from "../../main/domain/valueObjects/ExportsConfig.js";
import type { FileNode } from "../../shared/domain/entities/FileNode.js";
import type { BuildOrchestrator } from "../../shared/domain/interfaces/BuildOrchestrator.js";
import type { FilesRepository } from "../../shared/domain/interfaces/FilesRepository.js";
import { BuildOrchestratorResult } from "../../shared/domain/valueObjects/BuildOrchestratorResult.js";
import { logger } from "../../shared/supporting/logger.js";
import { DeclarationPackageJsonExpectationFactory } from "../domain/services/DeclarationPackageJsonExpectationFactory.js";
import { DeclarationOutDir } from "../domain/valueObjects/DeclarationOutDir.js";

export class DeclarationBuildOrchestrator implements BuildOrchestrator {
	private readonly outDir: DeclarationOutDir;
	private readonly packageJsonExpectationFactory: DeclarationPackageJsonExpectationFactory;

	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly distEmptier: DistEmptier,
		private readonly packageDir: FileNode,
		private readonly exportsConfig: ExportsConfig,
		private readonly dtsConfig: DtsConfig,
		distDirUri: string,
	) {
		this.outDir = new DeclarationOutDir(distDirUri);
		this.packageJsonExpectationFactory =
			new DeclarationPackageJsonExpectationFactory(
				this.filesRepository,
				this.packageDir,
				this.exportsConfig,
				this.outDir,
			);
	}

	async build(): Promise<BuildOrchestratorResult> {
		const startTime = Date.now();
		const builder = this.dtsConfig.getBuilder();
		await this.distEmptier.remove(this.outDir.uri);
		await builder.build(this.packageDir, this.outDir.uri);

		const packageJsonExpectation =
			await this.packageJsonExpectationFactory.create();

		const result = new BuildOrchestratorResult(packageJsonExpectation);

		const endTime = Date.now();
		logger.debug(`Built Declarations: ${endTime - startTime}ms`);

		return result;
	}
}
