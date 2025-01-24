import type { BuildConfig } from "@shared/domain/valueObjects/BuildConfig.js";
import { logger } from "@shared/supporting/logger.js";
import * as process from "process";
import { CjsBuildOrchestrator } from "../../cjs/app/CjsBuildOrchestrator.js";
import { filesRepository } from "../../container.js";
import { DtsBuildOrchestrator } from "../../dts/app/DtsBuildOrchestrator.js";
import { EsmBuildOrchestrator } from "../../esm/app/EsmBuildOrchestrator.js";
import { BuildsOrchestrator } from "../app/BuildsOrchestrator.js";
import { DistEmptier } from "../domain/services/DistEmptier.js";

export async function build(
	config: BuildConfig,
	shouldUpdatePackageJson: boolean,
): Promise<void> {
	const distEmptier = new DistEmptier(filesRepository);

	const orchestrators = [
		config.esm &&
			new EsmBuildOrchestrator(
				filesRepository,
				distEmptier,
				config.exports,
				config.esm,
				config.srcDir,
				config.distDir,
			),
		config.cjs &&
			new CjsBuildOrchestrator(
				filesRepository,
				distEmptier,
				config.exports,
				config.cjs,
				config.srcDir,
				config.distDir,
			),
		config.dts &&
			new DtsBuildOrchestrator(
				filesRepository,
				distEmptier,
				config.exports,
				config.dts,
				config.srcDir,
				config.distDir,
			),
	].filter(<A>(x: A | null): x is A => x !== null);

	if (orchestrators.length === 0) {
		logger.error("No cjs/esm/dts build config provided.");
		logger.hint(
			"BuildConfig in zoboz.config.ts has esm, cjs, and dts set to null.",
		);
		logger.hint(
			"Set at least one of them to a non-null value to have an effective build.",
		);
		process.exit(1);
	}

	new BuildsOrchestrator(orchestrators).build(shouldUpdatePackageJson);
}
