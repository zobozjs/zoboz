import type { CjsConfig } from "../../main/domain/interfaces/CjsConfig.js";
import type { DistEmptier } from "../../main/domain/services/DistEmptier.js";
import { TypeEnforcer } from "../../main/domain/services/TypeEnforcer.js";
import type { ExportsConfig } from "../../main/domain/valueObjects/ExportsConfig.js";
import type { FileNode } from "../../shared/domain/entities/FileNode.js";
import type { BuildOrchestrator } from "../../shared/domain/interfaces/BuildOrchestrator.js";
import type { ExtensionChanger } from "../../shared/domain/interfaces/ExtensionChanger.js";
import type { FilesRepository } from "../../shared/domain/interfaces/FilesRepository.js";
import { BuildOrchestratorResult } from "../../shared/domain/valueObjects/BuildOrchestratorResult.js";
import { logger } from "../../shared/supporting/logger.js";
import type { CommonJsReferenceChanger } from "../domain/interfaces/CommonJsReferenceChanger.js";
import { CommonJsPackageJsonExpectationFactory } from "../domain/services/CommonJsPackageJsonExpectationFactory.js";
import { CommonJsOutDir } from "../domain/valueObjects/CommonJsOutDir.js";

export class CommonJsBuildOrchestrator implements BuildOrchestrator {
	private readonly outDir: CommonJsOutDir;
	private readonly typeEnforcer: TypeEnforcer;
	private readonly packageJsonExpectationFactory: CommonJsPackageJsonExpectationFactory;

	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly distEmptier: DistEmptier,
		private readonly extensionChanger: ExtensionChanger,
		private readonly referenceChanger: CommonJsReferenceChanger,
		private readonly packageDir: FileNode,
		private readonly exportsConfig: ExportsConfig,
		private readonly cjsConfig: CjsConfig,
		distDirUri: string,
	) {
		this.outDir = new CommonJsOutDir(distDirUri);
		this.typeEnforcer = new TypeEnforcer(this.filesRepository);
		this.packageJsonExpectationFactory =
			new CommonJsPackageJsonExpectationFactory(
				this.filesRepository,
				this.packageDir,
				this.exportsConfig,
				this.outDir,
			);
	}

	async build(): Promise<BuildOrchestratorResult> {
		const startTime = Date.now();
		const builder = this.cjsConfig.getBuilder();
		await this.distEmptier.remove(this.outDir.uri);
		await builder.build(this.packageDir, this.outDir.uri);
		await this.referenceChanger.changeReferencesInDir(this.outDir.uri);
		await this.typeEnforcer.enforce("commonjs", this.outDir);

		const packageJsonExpectation =
			await this.packageJsonExpectationFactory.create();

		const result = new BuildOrchestratorResult(packageJsonExpectation);

		const endTime = Date.now();
		logger.debug(`Built CommonJS: ${endTime - startTime}ms`);

		return result;
	}
}
