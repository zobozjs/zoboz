import * as path from "node:path";
import type { DtsConfig } from "../../../main/domain/interfaces/DtsConfig.js";
import type { Builder } from "../../../shared/domain/interfaces/Builder.js";
import { NodeProcessCommandRunner } from "../../infra/NodeProcessCommandRunner.js";
import { TscDeclarationBuilder } from "../../infra/TscDeclarationBuilder.js";

type TscDtsConfigOptions = {
	outdir?: string;
};

export class TscDtsConfig implements DtsConfig {
	getBuilder(options?: TscDtsConfigOptions): Builder {
		const outdir = options?.outdir ?? path.resolve(process.cwd(), "dist/dts");
		return new TscDeclarationBuilder(new NodeProcessCommandRunner(), outdir);
	}
}
