import type { Builder } from "@shared/domain/interfaces/Builder.js";
import type { EsmConfig } from "@shared/domain/interfaces/EsmConfig.js";
import { EsbuildEsmBuilder } from "../../infra/EsbuildEsmBuilder.js";
import type { EsbuildOptions } from "../interfaces/EsbuildOptions.js";

export type EsbuildEsmConfigOptions = {
	esbuildOptions?: EsbuildOptions;
};

export class EsbuildEsmConfig implements EsmConfig {
	constructor(private readonly options?: EsbuildEsmConfigOptions) {}

	getBuilder(): Builder {
		return new EsbuildEsmBuilder(
			this.options ? this.options.esbuildOptions : undefined,
		);
	}
}
