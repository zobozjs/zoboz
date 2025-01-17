import * as path from "path";
import type { Builder, MjsConfig } from "@zoboz/core";
import { EsbuildModuleBuilder } from "../../infra/EsbuildModuleBuilder.js";
import type { EsbuildOptions } from "../interfaces/EsbuildOptions.js";

type EsbuildMjsConfigOptions = {
	outdir?: string;
	esbuildOptions?: EsbuildOptions;
};

export class EsbuildMjsConfig implements MjsConfig {
	getBuilder(options?: EsbuildMjsConfigOptions): Builder {
		const outdir = options?.outdir ?? path.resolve(process.cwd(), "dist/mjs");
		return new EsbuildModuleBuilder(outdir, options?.esbuildOptions);
	}
}
