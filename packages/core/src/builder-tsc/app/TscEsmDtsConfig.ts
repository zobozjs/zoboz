import type { Builder } from "@shared/domain/interfaces/Builder.js";
import type { EsmDtsConfig } from "@shared/domain/interfaces/EsmDtsConfig.js";
import { filesRepository, nodeProcessCommandRunner } from "container.js";
import { TscDtsBuilder } from "../infra/TscDtsBuilder.js";

export class TscEsmDtsConfig implements EsmDtsConfig {
	getBuilder(): Builder {
		return new TscDtsBuilder("esm", nodeProcessCommandRunner, filesRepository);
	}
}
