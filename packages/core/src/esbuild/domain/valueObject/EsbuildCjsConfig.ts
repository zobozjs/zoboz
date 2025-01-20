import type { Builder } from "../../../shared/domain/interfaces/Builder.js";
import type { CjsConfig } from "../../../shared/domain/interfaces/CjsConfig.js";
import { EsbuildCommonJsBuilder } from "../../infra/EsbuildCommonJsBuilder.js";
import type { EsbuildOptions } from "../interfaces/EsbuildOptions.js";

export type EsbuildCjsConfigOptions = {
	esbuildOptions?: EsbuildOptions;
};

export class EsbuildCjsConfig implements CjsConfig {
	constructor(private readonly options?: EsbuildCjsConfigOptions) {}

	getBuilder(): Builder {
		return new EsbuildCommonJsBuilder(
			this.options ? this.options.esbuildOptions : undefined,
		);
	}
}
