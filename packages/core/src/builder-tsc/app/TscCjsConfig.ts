import type { Builder } from "@shared/domain/interfaces/Builder.js";
import type { CjsConfig } from "@shared/domain/interfaces/CjsConfig.js";
import { filesRepository, nodeProcessCommandRunner } from "container.js";
import { TscCjsBuilder } from "../infra/TscCjsBuilder.js";

export class TscCjsConfig implements CjsConfig {
	getBuilder(): Builder {
		return new TscCjsBuilder(nodeProcessCommandRunner, filesRepository);
	}
}
