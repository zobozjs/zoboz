import type { Builder } from "../../../shared/domain/interfaces/Builder.js";
import type { EsmConfig } from "../../../shared/domain/interfaces/EsmConfig.js";
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
