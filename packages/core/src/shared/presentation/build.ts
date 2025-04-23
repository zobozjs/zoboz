import type { BuildConfig } from "@shared/domain/valueObjects/BuildConfig.js";
import { logger } from "@shared/supporting/logger.js";
import { filesRepository, zobozBam } from "container.js";
import * as process from "process";
import { CjsBuildOrchestrator } from "../../cjs/app/CjsBuildOrchestrator.js";
import { DtsBuildOrchestrator } from "../../dts/app/DtsBuildOrchestrator.js";
import { EsmBuildOrchestrator } from "../../esm/app/EsmBuildOrchestrator.js";
import { BuildsOrchestrator } from "../app/BuildsOrchestrator.js";
import { DistEmptier } from "../domain/services/DistEmptier.js";
import type { BuildOrchestrator } from "@shared/domain/interfaces/BuildOrchestrator.js";

export async function build(
	config: BuildConfig,
	canUpdatePackageJson: boolean,
): Promise<void> {
	const distEmptier = new DistEmptier(filesRepository);

	const orchestrators: BuildOrchestrator[] = [];

	if (config.esm) {
		if (config.esm.dts) {
			orchestrators.push(
				new DtsBuildOrchestrator(
					"esm",
					zobozBam,
					filesRepository,
					distEmptier,
					config.exports,
					config.esm.dts,
					config.srcDir,
					config.distDir,
				),
			);
		}

		if (config.esm.js) {
			orchestrators.push(
				new EsmBuildOrchestrator(
					zobozBam,
					filesRepository,
					distEmptier,
					config.exports,
					config.esm.js,
					config.srcDir,
					config.distDir,
				),
			);
		}
	}

	if (config.cjs) {
		if (config.cjs.dts) {
			orchestrators.push(
				new DtsBuildOrchestrator(
					"cjs",
					zobozBam,
					filesRepository,
					distEmptier,
					config.exports,
					config.cjs.dts,
					config.srcDir,
					config.distDir,
				),
			);
		}

		if (config.cjs.js) {
			orchestrators.push(
				new CjsBuildOrchestrator(
					zobozBam,
					filesRepository,
					distEmptier,
					config.exports,
					config.cjs.js,
					config.srcDir,
					config.distDir,
				),
			);
		}
	}

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

	const buildsOrchestrator = new BuildsOrchestrator(zobozBam, orchestrators);

	try {
		await buildsOrchestrator.build(canUpdatePackageJson);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		logger.error("Build failed:", errorMessage);
	}
}
