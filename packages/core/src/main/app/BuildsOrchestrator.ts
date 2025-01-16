// biome-ignore lint/style/useNodejsImportProtocol: backward-compatibility
import * as process from "process";
import { PackageJsonVerificationError } from "../../shared/domain/errors/PackageJsonVerificationError.js";
import type { BuildOrchestrator } from "../../shared/domain/interfaces/BuildOrchestrator.js";
import type { BuildOrchestratorResult } from "../../shared/domain/valueObjects/BuildOrchestratorResult.js";
import { PackageJsonExpectation } from "../../shared/domain/valueObjects/PackageJsonExpectation.js";
import { logger } from "../../shared/supporting/logger.js";

export class BuildsOrchestrator {
	constructor(private readonly orchestrators: BuildOrchestrator[]) {
		if (orchestrators.length === 0) {
			throw new Error("No orchestrators provided");
		}
	}

	async build(shouldUpdatePackageJson: boolean) {
		try {
			const results = await this.buildAllOrchestrators();
			const packageJsonExpectation = this.mergePackageJsonExpectations(results);

			if (shouldUpdatePackageJson) {
				await packageJsonExpectation.updatePackageJson();
			} else {
				await packageJsonExpectation.verifyPackageJson();
			}

			logger.success("zoboz build complete");
		} catch (error) {
			if (error instanceof PackageJsonVerificationError) {
				logger.error(error.message);
			} else {
				logger.error("Build failed", error);
			}

			process.exit(1);
		}
	}

	private mergePackageJsonExpectations(results: BuildOrchestratorResult[]) {
		return PackageJsonExpectation.mergeAll(
			results.map((result) => result.packageJsonExpectation),
		);
	}

	private async buildAllOrchestrators() {
		const results: BuildOrchestratorResult[] = [];
		for (const orchestrator of this.orchestrators) {
			results.push(await orchestrator.build());
		}
		return results;
	}
}
