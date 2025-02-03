import type { BuildOrchestrator } from "@shared/domain/interfaces/BuildOrchestrator.js";
import type { CjsConfig } from "@shared/domain/interfaces/CjsConfig.js";
import type { FilesRepository } from "@shared/domain/interfaces/FilesRepository.js";
import type { DistEmptier } from "@shared/domain/services/DistEmptier.js";
import { TypeEnforcer } from "@shared/domain/services/TypeEnforcer.js";
import { BuildOrchestratorResult } from "@shared/domain/valueObjects/BuildOrchestratorResult.js";
import type { DistDir } from "@shared/domain/valueObjects/DistDir.js";
import type { ExportsConfig } from "@shared/domain/valueObjects/ExportsConfig.js";
import type { SrcDir } from "@shared/domain/valueObjects/SrcDir.js";
import { logger } from "@shared/supporting/logger.js";
import { nodeProcessCommandRunner } from "container.js";
import { CjsPackageJsonExpectationFactory } from "../domain/services/CjsPackageJsonExpectationFactory.js";
import { CjsSpecifierFormatter } from "../domain/services/CjsSpecifierFormatter.js";
import { CjsSrcDistMapper } from "../domain/services/CjsSrcDistMapper.js";
import { CjsOutDir } from "../domain/valueObjects/CjsOutDir.js";

export class CjsBuildOrchestrator implements BuildOrchestrator {
	private readonly outDir: CjsOutDir;
	private readonly typeEnforcer: TypeEnforcer;
	private readonly packageJsonExpectationFactory: CjsPackageJsonExpectationFactory;
	private readonly cjsSrcDistMapper: CjsSrcDistMapper;

	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly distEmptier: DistEmptier,
		private readonly exportsConfig: ExportsConfig,
		private readonly cjsConfig: CjsConfig,
		private readonly srcDir: SrcDir,
		distDir: DistDir,
	) {
		this.outDir = new CjsOutDir(this.filesRepository, distDir);
		this.typeEnforcer = new TypeEnforcer(this.filesRepository);
		this.cjsSrcDistMapper = new CjsSrcDistMapper(srcDir, this.outDir);
		this.packageJsonExpectationFactory = new CjsPackageJsonExpectationFactory(
			this.filesRepository,
			this.exportsConfig,
			this.cjsSrcDistMapper,
		);
	}

	async build(): Promise<BuildOrchestratorResult> {
		const startTime = Date.now();
		const builder = this.cjsConfig.getBuilder();
		await this.distEmptier.remove(this.outDir.uri);

		await builder.build({
			srcDir: this.srcDir,
			exportsConfig: this.exportsConfig,
			outDir: this.outDir,
			logger: logger,
		});

		const outDirFiles = await this.listAllFilesInOutDir();

		await this.formatSpecifiers(outDirFiles);

		await this.typeEnforcer.enforce("commonjs", this.outDir);

		const packageJsonExpectation =
			await this.packageJsonExpectationFactory.create();

		const result = new BuildOrchestratorResult(packageJsonExpectation);

		const endTime = Date.now();
		logger.debug(`Built CommonJS: ${endTime - startTime}ms`);

		return result;
	}

	private async formatSpecifiers(outDirFiles: string[]) {
		await nodeProcessCommandRunner.run(
			[
				// this will have compatibility issues with older versions of node, and also with windows
				"zoboz_rs",
				"format-specifiers",
				"--format cjs",
				"--absolute-src-dir",
				this.filesRepository.getAbsoluteUri(this.srcDir.uri),
				"--absolute-out-dir",
				this.filesRepository.getAbsoluteUri(this.outDir.uri),
			].join(" "),
		);

		// await new CjsSpecifierFormatter(
		// 	this.filesRepository,
		// 	outDirFiles,
		// 	this.outDir,
		// 	this.cjsSrcDistMapper,
		// ).format();
	}

	private async listAllFilesInOutDir() {
		return await this.filesRepository.listFilesRecursively(this.outDir.uri);
	}
}
