import type { CjsConfig } from "../../main/domain/interfaces/CjsConfig.js";
import type { DistEmptier } from "../../main/domain/services/DistEmptier.js";
import { TypeEnforcer } from "../../main/domain/services/TypeEnforcer.js";
import type { DistDir } from "../../main/domain/valueObjects/DistDir.js";
import type { ExportsConfig } from "../../main/domain/valueObjects/ExportsConfig.js";
import type { BuildOrchestrator } from "../../shared/domain/interfaces/BuildOrchestrator.js";
import type { FilesRepository } from "../../shared/domain/interfaces/FilesRepository.js";
import { BuildOrchestratorResult } from "../../shared/domain/valueObjects/BuildOrchestratorResult.js";
import type { SrcDir } from "../../shared/domain/valueObjects/SrcDir.js";
import { logger } from "../../shared/supporting/logger.js";
import { CommonJsPackageJsonExpectationFactory } from "../domain/services/CommonJsPackageJsonExpectationFactory.js";
import { CommonJsReferenceLinter } from "../domain/services/CommonJsReferenceLinter.js";
import { CommonJsOutDir } from "../domain/valueObjects/CommonJsOutDir.js";

export class CommonJsBuildOrchestrator implements BuildOrchestrator {
	private readonly outDir: CommonJsOutDir;
	private readonly typeEnforcer: TypeEnforcer;
	private readonly packageJsonExpectationFactory: CommonJsPackageJsonExpectationFactory;

	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly distEmptier: DistEmptier,
		private readonly exportsConfig: ExportsConfig,
		private readonly cjsConfig: CjsConfig,
		private readonly srcDir: SrcDir,
		distDir: DistDir,
	) {
		this.outDir = new CommonJsOutDir(this.filesRepository, distDir);
		this.typeEnforcer = new TypeEnforcer(this.filesRepository);
		this.packageJsonExpectationFactory =
			new CommonJsPackageJsonExpectationFactory(
				this.filesRepository,
				this.exportsConfig,
				srcDir,
				this.outDir,
			);
	}

	async build(): Promise<BuildOrchestratorResult> {
		const startTime = Date.now();
		const builder = this.cjsConfig.getBuilder();
		await this.distEmptier.remove(this.outDir.uri);
		await builder.build(this.srcDir, this.outDir);
		const outDirFiles = await this.listAllFilesInOutDir();
		await new CommonJsReferenceLinter(this.filesRepository, outDirFiles).lint();
		await this.typeEnforcer.enforce("commonjs", this.outDir);

		const packageJsonExpectation =
			await this.packageJsonExpectationFactory.create();

		const result = new BuildOrchestratorResult(packageJsonExpectation);

		const endTime = Date.now();
		logger.debug(`Built CommonJS: ${endTime - startTime}ms`);

		return result;
	}

	private async listAllFilesInOutDir() {
		return await this.filesRepository.listFilesRecursively(this.outDir.uri);
	}
}
