import type { Builder } from "@shared/domain/interfaces/Builder.js";
import type { CjsJsConfig } from "@shared/domain/interfaces/CjsJsConfig.js";
import { EsbuildCjsBuilder } from "../../infra/EsbuildCjsBuilder.js";
import type { EsbuildOptions } from "../interfaces/EsbuildOptions.js";

export type EsbuildCjsConfigOptions = {
	esbuildOptions?: EsbuildOptions;
};

export class EsbuildCjsConfig implements CjsJsConfig {
	constructor(private readonly options?: EsbuildCjsConfigOptions) {}

	getBuilder(): Builder {
		return new EsbuildCjsBuilder(
			this.options ? this.options.esbuildOptions : undefined,
		);
	}
}
