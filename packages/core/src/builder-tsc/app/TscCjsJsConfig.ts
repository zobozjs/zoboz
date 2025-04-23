import type { Builder } from "@shared/domain/interfaces/Builder.js";
import type { CjsJsConfig } from "@shared/domain/interfaces/CjsJsConfig.js";
import { filesRepository, nodeProcessCommandRunner } from "container.js";
import { TscCjsBuilder } from "../infra/TscCjsBuilder.js";

export class TscCjsJsConfig implements CjsJsConfig {
	getBuilder(): Builder {
		return new TscCjsBuilder(nodeProcessCommandRunner, filesRepository);
	}
}
