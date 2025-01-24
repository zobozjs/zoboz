import type { Builder } from "@shared/domain/interfaces/Builder.js";
import type { DtsConfig } from "@shared/domain/interfaces/DtsConfig.js";
import { filesRepository, nodeProcessCommandRunner } from "../../container.js";
import { TscDtsBuilder } from "../infra/TscDtsBuilder.js";

export class TscDtsConfig implements DtsConfig {
	getBuilder(): Builder {
		return new TscDtsBuilder(nodeProcessCommandRunner, filesRepository);
	}
}
