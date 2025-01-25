import type { BuildOrchestrator } from "@shared/domain/interfaces/BuildOrchestrator.js";
import type { DtsConfig } from "@shared/domain/interfaces/DtsConfig.js";
import type { FilesRepository } from "@shared/domain/interfaces/FilesRepository.js";
import type { DistEmptier } from "@shared/domain/services/DistEmptier.js";
import { BuildOrchestratorResult } from "@shared/domain/valueObjects/BuildOrchestratorResult.js";
import type { DistDir } from "@shared/domain/valueObjects/DistDir.js";
import type { ExportsConfig } from "@shared/domain/valueObjects/ExportsConfig.js";
import type { SrcDir } from "@shared/domain/valueObjects/SrcDir.js";
import { logger } from "@shared/supporting/logger.js";
import { DtsPackageJsonExpectationFactory } from "../domain/services/DtsPackageJsonExpectationFactory.js";
import { DtsOutDir } from "../domain/valueObjects/DtsOutDir.js";

export class DtsBuildOrchestrator implements BuildOrchestrator {
	private readonly outDir: DtsOutDir;
	private readonly packageJsonExpectationFactory: DtsPackageJsonExpectationFactory;

	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly distEmptier: DistEmptier,
		private readonly exportsConfig: ExportsConfig,
		private readonly dtsConfig: DtsConfig,
		private readonly srcDir: SrcDir,
		distDir: DistDir,
	) {
		this.outDir = new DtsOutDir(this.filesRepository, distDir);
		this.packageJsonExpectationFactory = new DtsPackageJsonExpectationFactory(
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
		await builder.build({
			srcDir: this.srcDir,
			exportsConfig: this.exportsConfig,
			outDir: this.outDir,
			logger: logger,
		});

		const packageJsonExpectation =
			await this.packageJsonExpectationFactory.create();

		const result = new BuildOrchestratorResult(packageJsonExpectation);

		const endTime = Date.now();
		logger.debug(`Built Declarations: ${endTime - startTime}ms`);

		return result;
	}
}
