import type { Builder, EsmConfig } from "@zoboz/core/extend";
import { EsbuildModuleBuilder } from "../../infra/EsbuildModuleBuilder.js";
import type { EsbuildOptions } from "../interfaces/EsbuildOptions.js";

export type EsbuildEsmConfigOptions = {
	esbuildOptions?: EsbuildOptions;
};

export class EsbuildEsmConfig implements EsmConfig {
	constructor(private readonly options?: EsbuildEsmConfigOptions) {}

	getBuilder(): Builder {
		return new EsbuildModuleBuilder(this.options?.esbuildOptions);
	}
}
