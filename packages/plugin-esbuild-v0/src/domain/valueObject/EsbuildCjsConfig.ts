import type { Builder, CjsConfig } from "@zoboz/core";
import { EsbuildCommonJsBuilder } from "../../infra/EsbuildCommonJsBuilder.js";
import type { EsbuildOptions } from "../interfaces/EsbuildOptions.js";

export type EsbuildCjsConfigOptions = {
	esbuildOptions?: EsbuildOptions;
};

export class EsbuildCjsConfig implements CjsConfig {
	constructor(private readonly options?: EsbuildCjsConfigOptions) {}

	getBuilder(): Builder {
		return new EsbuildCommonJsBuilder(this.options?.esbuildOptions);
	}
}
