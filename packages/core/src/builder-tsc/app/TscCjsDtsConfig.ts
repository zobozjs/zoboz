import type { Builder } from "@shared/domain/interfaces/Builder.js";
import type { CjsDtsConfig } from "@shared/domain/interfaces/CjsDtsConfig.js";
import { filesRepository, nodeProcessCommandRunner } from "container.js";
import { TscDtsBuilder } from "../infra/TscDtsBuilder.js";

export class TscCjsDtsConfig implements CjsDtsConfig {
	getBuilder(): Builder {
		return new TscDtsBuilder("cjs", nodeProcessCommandRunner, filesRepository);
	}
}
