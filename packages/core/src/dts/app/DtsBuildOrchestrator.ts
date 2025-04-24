import type { BuildOrchestrator } from "@shared/domain/interfaces/BuildOrchestrator.js";
import type { EsmDtsConfig } from "@shared/domain/interfaces/EsmDtsConfig.js";
import type { FilesRepository } from "@shared/domain/interfaces/FilesRepository.js";
import type { DistEmptier } from "@shared/domain/services/DistEmptier.js";
import type { ZobozBam } from "@shared/domain/services/ZobozBam.js";
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
		private readonly moduletype: "cjs" | "esm",
		private readonly zobozBam: ZobozBam,
		private readonly filesRepository: FilesRepository,
		private readonly distEmptier: DistEmptier,
		private readonly exportsConfig: ExportsConfig,
		private readonly dtsConfig: EsmDtsConfig,
		private readonly srcDir: SrcDir,
		distDir: DistDir,
	) {
		this.outDir = new DtsOutDir(moduletype, distDir);
		this.packageJsonExpectationFactory = new DtsPackageJsonExpectationFactory(
			this.moduletype,
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
			filesRepository: this.filesRepository,
			srcDir: this.srcDir,
			exportsConfig: this.exportsConfig,
			outDir: this.outDir,
			logger: logger,
		});

		const packageJsonExpectation =
			await this.packageJsonExpectationFactory.create();

		const result = new BuildOrchestratorResult(packageJsonExpectation);

		await this.zobozBam.reformatSpecifiers({
			absoluteSourceDir: this.filesRepository.getAbsoluteUri(this.srcDir.uri),
			absoluteOutputDir: this.filesRepository.getAbsoluteUri(this.outDir.uri),
			outputFormat: "dts",
		});

		const endTime = Date.now();
		logger.success(
			`Built ${this.moduletype.toUpperCase()} Declarations: ${endTime - startTime}ms`,
		);

		return result;
	}
}
