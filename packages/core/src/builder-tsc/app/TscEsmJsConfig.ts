import type { Builder } from "@shared/domain/interfaces/Builder";
import type { EsmJsConfig } from "@shared/domain/interfaces/EsmJsConfig";
import { filesRepository, nodeProcessCommandRunner } from "container";
import { TscEsmJsBuilder } from "../infra/TscEsmJsBuilder";

export class TscEsmJsConfig implements EsmJsConfig {
	getBuilder(): Builder {
		return new TscEsmJsBuilder(nodeProcessCommandRunner, filesRepository);
	}
}
