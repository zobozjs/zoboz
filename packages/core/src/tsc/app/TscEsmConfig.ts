import { filesRepository, nodeProcessCommandRunner } from "../../container.js";
import type { Builder } from "../../shared/domain/interfaces/Builder.js";
import type { EsmConfig } from "../../shared/domain/interfaces/EsmConfig.js";
import { TscModuleBuilder } from "../infra/TscModuleBuilder.js";

export class TscEsmConfig implements EsmConfig {
	getBuilder(): Builder {
		return new TscModuleBuilder(nodeProcessCommandRunner, filesRepository);
	}
}
