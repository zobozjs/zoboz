import type { DtsConfig } from "../../main/domain/interfaces/DtsConfig.js";
import type { DistEmptier } from "../../main/domain/services/DistEmptier.js";
import type { DistDir } from "../../main/domain/valueObjects/DistDir.js";
import type { ExportsConfig } from "../../main/domain/valueObjects/ExportsConfig.js";
import type { BuildOrchestrator } from "../../shared/domain/interfaces/BuildOrchestrator.js";
import type { FilesRepository } from "../../shared/domain/interfaces/FilesRepository.js";
import { BuildOrchestratorResult } from "../../shared/domain/valueObjects/BuildOrchestratorResult.js";
import type { SrcDir } from "../../shared/domain/valueObjects/SrcDir.js";
import { logger } from "../../shared/supporting/logger.js";
import { DeclarationPackageJsonExpectationFactory } from "../domain/services/DeclarationPackageJsonExpectationFactory.js";
import { DeclarationOutDir } from "../domain/valueObjects/DeclarationOutDir.js";

export class DeclarationBuildOrchestrator implements BuildOrchestrator {
	private readonly outDir: DeclarationOutDir;
	private readonly packageJsonExpectationFactory: DeclarationPackageJsonExpectationFactory;

	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly distEmptier: DistEmptier,
		private readonly exportsConfig: ExportsConfig,
		private readonly dtsConfig: DtsConfig,
		private readonly srcDir: SrcDir,
		distDir: DistDir,
	) {
		this.outDir = new DeclarationOutDir(this.filesRepository, distDir);
		this.packageJsonExpectationFactory =
			new DeclarationPackageJsonExpectationFactory(
				this.filesRepository,
				this.exportsConfig,
				srcDir,
				this.outDir,
			);
	}

	async build(): Promise<BuildOrchestratorResult> {
		const startTime = Date.now();
		const builder = this.dtsConfig.getBuilder();
		await this.distEmptier.remove(this.outDir.uri);
		await builder.build(this.srcDir, this.outDir);

		const packageJsonExpectation =
			await this.packageJsonExpectationFactory.create();

		const result = new BuildOrchestratorResult(packageJsonExpectation);

		const endTime = Date.now();
		logger.debug(`Built Declarations: ${endTime - startTime}ms`);

		return result;
	}
}
