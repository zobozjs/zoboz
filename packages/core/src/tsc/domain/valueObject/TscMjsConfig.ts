import * as path from "node:path";
import type { MjsConfig } from "../../../main/domain/interfaces/MjsConfig.js";
import type { Builder } from "../../../shared/domain/interfaces/Builder.js";
import { NodeProcessCommandRunner } from "../../infra/NodeProcessCommandRunner.js";
import { TscModuleBuilder } from "../../infra/TscModuleBuilder.js";

type TscMjsConfigOptions = {
	outdir?: string;
};

export class TscMjsConfig implements MjsConfig {
	getBuilder(options?: TscMjsConfigOptions): Builder {
		const outdir = options?.outdir ?? path.resolve(process.cwd(), "dist/mjs");
		return new TscModuleBuilder(new NodeProcessCommandRunner(), outdir);
	}
}
