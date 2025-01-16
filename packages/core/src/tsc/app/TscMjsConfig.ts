import { filesRepository, nodeProcessCommandRunner } from "../../container.js";
import type { MjsConfig } from "../../main/domain/interfaces/MjsConfig.js";
import type { Builder } from "../../shared/domain/interfaces/Builder.js";
import { TscModuleBuilder } from "../infra/TscModuleBuilder.js";

export class TscMjsConfig implements MjsConfig {
	getBuilder(): Builder {
		return new TscModuleBuilder(nodeProcessCommandRunner, filesRepository);
	}
}
