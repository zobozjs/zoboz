import * as process from "node:process";
import { CommonJsBuildOrchestrator } from "../../commonjs/app/CommonJsBuildOrchestrator.js";
import { NodeCommonJsReferenceChanger } from "../../commonjs/infra/NodeCommonJsReferenceChanger.js";
import { DeclarationBuildOrchestrator } from "../../declaration/app/DeclarationBuildOrchestrator.js";
import { ModuleBuildOrchestrator } from "../../module/app/ModuleBuildOrchestrator.js";
import { NodeModuleReferenceChanger } from "../../module/infra/NodeModuleReferenceChanger.js";
import { FileNode } from "../../shared/domain/entities/FileNode.js";
import { ExtensionChanger } from "../../shared/domain/services/ExtensionChanger.js";
import { NodeFsFilesRepository } from "../../shared/infra/NodeFsFilesRepository.js";
import { logger } from "../../shared/supporting/logger.js";
import { BuildsOrchestrator } from "../app/BuildsOrchestrator.js";
import { DistEmptier } from "../domain/services/DistEmptier.js";
import type { BuildConfig } from "../domain/valueObjects/BuildConfig.js";

export async function build(config: BuildConfig): Promise<void> {
	const filesRepository = new NodeFsFilesRepository();
	const packageDirUri = await filesRepository.getPackageDir();
	const packageDir = FileNode.fromUri(packageDirUri, filesRepository);
	const distEmptier = new DistEmptier(filesRepository, packageDir);
	const extensionChanger = new ExtensionChanger(filesRepository);

	const orchestrators = [
		config.mjs &&
			new ModuleBuildOrchestrator(
				filesRepository,
				distEmptier,
				extensionChanger,
				new NodeModuleReferenceChanger(filesRepository),
				packageDir,
				config.exports,
				config.mjs,
			),
		config.cjs &&
			new CommonJsBuildOrchestrator(
				filesRepository,
				distEmptier,
				extensionChanger,
				new NodeCommonJsReferenceChanger(filesRepository),
				packageDir,
				config.exports,
				config.cjs,
			),
		config.dts &&
			new DeclarationBuildOrchestrator(
				filesRepository,
				distEmptier,
				extensionChanger,
				packageDir,
				config.exports,
				config.dts,
			),
	].filter((x) => x !== null);

	if (orchestrators.length === 0) {
		logger.error("No cjs/mjs/dts build config provided.");
		logger.hint(
			"BuildConfig in zoboz.config.ts has mjs, cjs, and dts set to null.",
		);
		logger.hint(
			"Set at least one of them to a non-null value to have an effective build.",
		);
		process.exit(1);
	}

	new BuildsOrchestrator(orchestrators).build();
}
