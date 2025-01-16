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
import { DeclarationReferenceChanger } from "../domain/services/DeclarationReferenceChanger.js";

export class DeclarationBuildOrchestrator implements BuildOrchestrator {
	private readonly referenceChanger: DeclarationReferenceChanger;

	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly distEmptier: DistEmptier,
		private readonly extensionChanger: ExtensionChanger,
		private readonly packageDir: FileNode,
		private readonly exportsConfig: ExportsConfig,
		private readonly dtsConfig: DtsConfig,
	) {
		this.referenceChanger = new DeclarationReferenceChanger(
			this.filesRepository,
		);
	}

	async build(): Promise<BuildOrchestratorResult> {
		const startTime = Date.now();
		const builder = this.dtsConfig.getBuilder();
		await this.distEmptier.remove(builder.outdir);
		await builder.build(this.packageDir);
		await this.extensionChanger.changeInDir(builder.outdir, "ts", "cts");
		await this.referenceChanger.changeReferencesInDir(builder.outdir);

		const result = new BuildOrchestratorResult(
			await this.createPackageJsonExpectation(builder.outdir),
		);

		const endTime = Date.now();
		logger.debug(`Built Declarations: ${endTime - startTime}ms`);

		return result;
	}

	private async createPackageJsonExpectation(
		outdir: string,
	): Promise<Promise<PackageJsonExpectation>> {
		return new PackageJsonExpectation(this.filesRepository, {
			types: await this.generatePackageJsonMain(outdir),
			exports: await this.generatePackageJsonExports(outdir),
		});
	}

	private generatePackageJsonMain(outdir: string): Promise<string> {
		return this.distFromSrc(this.exportsConfig.getRootExport(), outdir);
	}

	private async distFromSrc(srcUri: string, outdir: string): Promise<string> {
		return srcUri
			.replace("./src", await this.packageDir.getRelativeUriOf(outdir))
			.replace(".ts", ".d.cts");
	}

	private async generatePackageJsonExports(
		outdir: string,
	): Promise<Record<string, Record<"types", string>>> {
		const entries = this.exportsConfig
			.entries()
			.map(async ([k, v]) => [k, { types: await this.distFromSrc(v, outdir) }]);

		return Object.fromEntries(await Promise.all(entries));
	}
}
