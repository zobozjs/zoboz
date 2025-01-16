import type { CjsConfig } from "../../main/domain/interfaces/CjsConfig.js";
import type { DistEmptier } from "../../main/domain/services/DistEmptier.js";
import type { ExportsConfig } from "../../main/domain/valueObjects/ExportsConfig.js";
import type { FileNode } from "../../shared/domain/entities/FileNode.js";
import type { BuildOrchestrator } from "../../shared/domain/interfaces/BuildOrchestrator.js";
import type { ExtensionChanger } from "../../shared/domain/interfaces/ExtensionChanger.js";
import type { FilesRepository } from "../../shared/domain/interfaces/FilesRepository.js";
import { BuildOrchestratorResult } from "../../shared/domain/valueObjects/BuildOrchestratorResult.js";
import { PackageJsonExpectation } from "../../shared/domain/valueObjects/PackageJsonExpectation.js";
import { logger } from "../../shared/supporting/logger.js";
import type { CommonJsReferenceChanger } from "../domain/interfaces/CommonJsReferenceChanger.js";

export class CommonJsBuildOrchestrator implements BuildOrchestrator {
	constructor(
		private readonly filesRepository: FilesRepository,
		private readonly distEmptier: DistEmptier,
		private readonly extensionChanger: ExtensionChanger,
		private readonly referenceChanger: CommonJsReferenceChanger,
		private readonly packageDir: FileNode,
		private readonly exportsConfig: ExportsConfig,
		private readonly cjsConfig: CjsConfig,
	) {}

	async build(): Promise<BuildOrchestratorResult> {
		const startTime = Date.now();
		const builder = this.cjsConfig.getBuilder();
		await this.distEmptier.remove(builder.outdir);
		await builder.build(this.packageDir);
		await this.extensionChanger.changeInDir(builder.outdir, "js", "cjs");
		await this.referenceChanger.changeReferencesInDir(builder.outdir);

		const result = new BuildOrchestratorResult(
			await this.createPackageJsonExpectation(builder.outdir),
		);

		const endTime = Date.now();
		logger.debug(`Built CommonJS: ${endTime - startTime}ms`);

		return result;
	}

	private async createPackageJsonExpectation(
		outdir: string,
	): Promise<PackageJsonExpectation> {
		return new PackageJsonExpectation(this.filesRepository, {
			main: await this.generatePackageJsonMain(outdir),
			exports: await this.generatePackageJsonExports(outdir),
		});
	}

	private generatePackageJsonMain(outdir: string): Promise<string> {
		return this.distFromSrc(this.exportsConfig.getRootExport(), outdir);
	}

	private async distFromSrc(srcUri: string, outdir: string): Promise<string> {
		return srcUri
			.replace("./src", await this.packageDir.getRelativeUriOf(outdir))
			.replace(".ts", ".cjs");
	}

	private async generatePackageJsonExports(
		outdir: string,
	): Promise<Record<string, Record<"require", string>>> {
		const entries = this.exportsConfig
			.entries()
			.map(async ([k, v]) => [
				k,
				{ require: await this.distFromSrc(v, outdir) },
			]);

		return Object.fromEntries(await Promise.all(entries));
	}
}
