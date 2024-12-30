import type { PackageJsonExpectation } from "./PackageJsonExpectation.js";

export class BuildOrchestratorResult {
	constructor(public readonly packageJsonExpectation: PackageJsonExpectation) {}
}
