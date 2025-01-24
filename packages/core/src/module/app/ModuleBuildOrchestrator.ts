import type { BuildOrchestrator } from "@shared/domain/interfaces/BuildOrchestrator.js";
import type { EsmConfig } from "@shared/domain/interfaces/EsmConfig.js";
import type { FilesRepository } from "@shared/domain/interfaces/FilesRepository.js";
import type { DistEmptier } from "@shared/domain/services/DistEmptier.js";
import { TypeEnforcer } from "@shared/domain/services/TypeEnforcer.js";
import { BuildOrchestratorResult } from "@shared/domain/valueObjects/BuildOrchestratorResult.js";
import type { DistDir } from "@shared/domain/valueObjects/DistDir.js";
import type { ExportsConfig } from "@shared/domain/valueObjects/ExportsConfig.js";
import type { SrcDir } from "@shared/domain/valueObjects/SrcDir.js";
import { logger } from "@shared/supporting/logger.js";
import { EsmPackageJsonExpectationFactory } from "../domain/services/EsmPackageJsonExpectationFactory.js";
import { EsmSrcDistMapper } from "../domain/services/EsmSrcDistMapper.js";
import { ModuleReferenceLinter } from "../domain/services/ModuleReferenceLinter.js";
import { ModuleOutDir } from "../domain/valueObjects/ModuleOutDir.js";

export class ModuleBuildOrchestrator implements BuildOrchestrator {
	private readonly outDir: ModuleOutDir;
	private readonly typeEnforcer: TypeEnforcer;
	private readonly packageJsonExpectationFactory: EsmPackageJsonExpectationFactory;
	private readonly esmSrcDistMapper: EsmSrcDistMapper;

	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly distEmptier: DistEmptier,
		private readonly exportsConfig: ExportsConfig,
		private readonly esmConfig: EsmConfig,
		private readonly srcDir: SrcDir,
		distDir: DistDir,
	) {
		this.outDir = new ModuleOutDir(this.filesRepository, distDir);
		this.typeEnforcer = new TypeEnforcer(this.filesRepository);
		this.esmSrcDistMapper = new EsmSrcDistMapper(srcDir, this.outDir);

		this.packageJsonExpectationFactory = new EsmPackageJsonExpectationFactory(
			this.filesRepository,
			this.exportsConfig,
			this.esmSrcDistMapper,
		);
	}

	async build(): Promise<BuildOrchestratorResult> {
		const startTime = Date.now();
		const builder = this.esmConfig.getBuilder();
		await this.distEmptier.remove(this.outDir.uri);

		await builder.build({
			srcDir: this.srcDir,
			exportsConfig: this.exportsConfig,
			outDir: this.outDir,
			logger: logger,
		});

		const outDirFiles = await this.listAllFilesInOutDir();

		await new ModuleReferenceLinter(
			this.filesRepository,
			outDirFiles,
			this.outDir,
			this.esmSrcDistMapper,
		).lint();

		await this.typeEnforcer.enforce("module", this.outDir);

		const packageJsonExpectation =
			await this.packageJsonExpectationFactory.create();

		const result = new BuildOrchestratorResult(packageJsonExpectation);

		const endTime = Date.now();
		logger.debug(`Built ESM Module: ${endTime - startTime}ms`);

		return result;
	}

	private async listAllFilesInOutDir() {
		return await this.filesRepository.listFilesRecursively(this.outDir.uri);
	}
}
