import * as path from "node:path";
import type { CjsConfig } from "../../../main/domain/interfaces/CjsConfig.js";
import type { Builder } from "../../../shared/domain/interfaces/Builder.js";
import { NodeProcessCommandRunner } from "../../infra/NodeProcessCommandRunner.js";
import { TscCommonJsBuilder } from "../../infra/TscCommonJsBuilder.js";

type TscCjsConfigOptions = {
	outdir?: string;
};

export class TscCjsConfig implements CjsConfig {
	getBuilder(options?: TscCjsConfigOptions): Builder {
		const outdir = options?.outdir ?? path.resolve(process.cwd(), "dist/cjs");
		return new TscCommonJsBuilder(new NodeProcessCommandRunner(), outdir);
	}
}
