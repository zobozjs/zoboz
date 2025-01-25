import type { Builder } from "@shared/domain/interfaces/Builder";
import type { EsmConfig } from "@shared/domain/interfaces/EsmConfig";
import { filesRepository, nodeProcessCommandRunner } from "container";
import { TscEsmBuilder } from "../infra/TscEsmBuilder";

export class TscEsmConfig implements EsmConfig {
	getBuilder(): Builder {
		return new TscEsmBuilder(nodeProcessCommandRunner, filesRepository);
	}
}
