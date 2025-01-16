import { filesRepository, nodeProcessCommandRunner } from "../../container.js";
import type { CjsConfig } from "../../main/domain/interfaces/CjsConfig.js";
import type { Builder } from "../../shared/domain/interfaces/Builder.js";
import { TscCommonJsBuilder } from "../infra/TscCommonJsBuilder.js";

export class TscCjsConfig implements CjsConfig {
	getBuilder(): Builder {
		return new TscCommonJsBuilder(nodeProcessCommandRunner, filesRepository);
	}
}
