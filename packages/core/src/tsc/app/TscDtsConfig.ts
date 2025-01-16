import { filesRepository, nodeProcessCommandRunner } from "../../container.js";
import type { DtsConfig } from "../../main/domain/interfaces/DtsConfig.js";
import type { Builder } from "../../shared/domain/interfaces/Builder.js";
import { TscDeclarationBuilder } from "../infra/TscDeclarationBuilder.js";

export class TscDtsConfig implements DtsConfig {
	getBuilder(): Builder {
		return new TscDeclarationBuilder(nodeProcessCommandRunner, filesRepository);
	}
}
