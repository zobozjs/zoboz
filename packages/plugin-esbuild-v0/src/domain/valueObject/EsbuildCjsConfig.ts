import * as path from "node:path";
import type { Builder, CjsConfig } from "@zoboz/core";
import { EsbuildCommonJsBuilder } from "../../infra/EsbuildCommonJsBuilder.js";
import type { EsbuildOptions } from "../interfaces/EsbuildOptions.js";

type EsbuildCjsConfigOptions = {
	outdir?: string;
	esbuildOptions?: EsbuildOptions;
};

export class EsbuildCjsConfig implements CjsConfig {
	getBuilder(options?: EsbuildCjsConfigOptions): Builder {
		const outdir = options?.outdir ?? path.resolve(process.cwd(), "dist/cjs");
		return new EsbuildCommonJsBuilder(outdir, options?.esbuildOptions);
	}
}
