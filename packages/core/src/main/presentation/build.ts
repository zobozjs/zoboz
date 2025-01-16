import * as path from "node:path";
import * as process from "node:process";
import { CommonJsBuildOrchestrator } from "../../commonjs/app/CommonJsBuildOrchestrator.js";
import {
	commonJsReferenceChanger,
	extensionChanger,
	filesRepository,
	moduleReferenceChanger,
} from "../../container.js";
import { DeclarationBuildOrchestrator } from "../../declaration/app/DeclarationBuildOrchestrator.js";
import { ModuleBuildOrchestrator } from "../../module/app/ModuleBuildOrchestrator.js";
import { FileNode } from "../../shared/domain/entities/FileNode.js";
import { logger } from "../../shared/supporting/logger.js";
import { BuildsOrchestrator } from "../app/BuildsOrchestrator.js";
import { DistEmptier } from "../domain/services/DistEmptier.js";
import type { BuildConfig } from "../domain/valueObjects/BuildConfig.js";

export async function build(config: BuildConfig): Promise<void> {
	const packageDirUri = await filesRepository.getPackageDir();
	const packageDir = FileNode.fromUri(packageDirUri, filesRepository);
	const distEmptier = new DistEmptier(filesRepository, packageDir);
	const distDirUri = path.resolve(packageDirUri, config.distDir);

	const orchestrators = [
		config.mjs &&
			new ModuleBuildOrchestrator(
				filesRepository,
				distEmptier,
				extensionChanger,
				moduleReferenceChanger,
				packageDir,
				distDirUri,
				config.exports,
				config.mjs,
			),
		config.cjs &&
			new CommonJsBuildOrchestrator(
				filesRepository,
				distEmptier,
				extensionChanger,
				commonJsReferenceChanger,
				packageDir,
				distDirUri,
				config.exports,
				config.cjs,
			),
		config.dts &&
			new DeclarationBuildOrchestrator(
				filesRepository,
				distEmptier,
				extensionChanger,
				packageDir,
				distDirUri,
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
