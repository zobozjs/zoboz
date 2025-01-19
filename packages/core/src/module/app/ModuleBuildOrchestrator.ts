import type { EsmConfig } from "../../main/domain/interfaces/EsmConfig.js";
import type { DistEmptier } from "../../main/domain/services/DistEmptier.js";
import { TypeEnforcer } from "../../main/domain/services/TypeEnforcer.js";
import type { DistDir } from "../../main/domain/valueObjects/DistDir.js";
import type { ExportsConfig } from "../../main/domain/valueObjects/ExportsConfig.js";
import type { BuildOrchestrator } from "../../shared/domain/interfaces/BuildOrchestrator.js";
import type { FilesRepository } from "../../shared/domain/interfaces/FilesRepository.js";
import { BuildOrchestratorResult } from "../../shared/domain/valueObjects/BuildOrchestratorResult.js";
import type { SrcDir } from "../../shared/domain/valueObjects/SrcDir.js";
import { logger } from "../../shared/supporting/logger.js";
import { ModulePackageJsonExpectationFactory } from "../domain/services/ModulePackageJsonExpectationFactory.js";
import { ModuleReferenceLinter } from "../domain/services/ModuleReferenceChanger.js";
import { ModuleOutDir } from "../domain/valueObjects/ModuleOutDir.js";

export class ModuleBuildOrchestrator implements BuildOrchestrator {
	private readonly outDir: ModuleOutDir;
	private readonly typeEnforcer: TypeEnforcer;
	private readonly packageJsonExpectationFactory: ModulePackageJsonExpectationFactory;

	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly distEmptier: DistEmptier,
		private readonly exportsConfig: ExportsConfig,
		private readonly mjsConfig: EsmConfig,
		private readonly srcDir: SrcDir,
		distDir: DistDir,
	) {
		this.outDir = new ModuleOutDir(this.filesRepository, distDir);
		this.typeEnforcer = new TypeEnforcer(this.filesRepository);
		this.packageJsonExpectationFactory =
			new ModulePackageJsonExpectationFactory(
				this.filesRepository,
				this.exportsConfig,
				srcDir,
				this.outDir,
			);
	}

	async build(): Promise<BuildOrchestratorResult> {
		const startTime = Date.now();
		const builder = this.mjsConfig.getBuilder();
		await this.distEmptier.remove(this.outDir.uri);
		await builder.build(this.srcDir, this.outDir);
		const outDirFiles = await this.listAllFilesInOutDir();
		await new ModuleReferenceLinter(this.filesRepository, outDirFiles).lint();
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
