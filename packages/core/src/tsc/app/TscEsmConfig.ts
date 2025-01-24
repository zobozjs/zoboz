import type { Builder } from "@shared/domain/interfaces/Builder.js";
import type { EsmConfig } from "@shared/domain/interfaces/EsmConfig.js";
import { filesRepository, nodeProcessCommandRunner } from "../../container.js";
import { TscEsmBuilder } from "../infra/TscEsmBuilder.js";

export class TscEsmConfig implements EsmConfig {
	getBuilder(): Builder {
		return new TscEsmBuilder(nodeProcessCommandRunner, filesRepository);
	}
}
