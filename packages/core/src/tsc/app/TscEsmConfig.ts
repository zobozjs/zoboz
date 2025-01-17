import { filesRepository, nodeProcessCommandRunner } from "../../container.js";
import type { EsmConfig } from "../../main/domain/interfaces/EsmConfig.js";
import type { Builder } from "../../shared/domain/interfaces/Builder.js";
import { TscModuleBuilder } from "../infra/TscModuleBuilder.js";

export class TscEsmConfig implements EsmConfig {
	getBuilder(): Builder {
		return new TscModuleBuilder(nodeProcessCommandRunner, filesRepository);
	}
}
