import type { BuildOrchestratorResult } from "../valueObjects/BuildOrchestratorResult.js";

export interface BuildOrchestrator {
	build(): Promise<BuildOrchestratorResult>;
}
