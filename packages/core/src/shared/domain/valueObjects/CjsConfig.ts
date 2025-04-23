import { TscCjsDtsConfig } from "builder-tsc/app/TscCjsDtsConfig";
import type { CjsDtsConfig } from "../interfaces/CjsDtsConfig";
import type { CjsJsConfig } from "../interfaces/CjsJsConfig";
import { EsbuildCjsConfig } from "builder-esbuild/domain/valueObject/EsbuildCjsConfig";

export class CjsConfig {
	private constructor(
		public readonly js: CjsJsConfig,
		public readonly dts: CjsDtsConfig,
	) {}

	public static create(params: {
		js?: CjsJsConfig;
		dts?: CjsDtsConfig;
	}): CjsConfig {
		return new CjsConfig(
			params.js ?? new EsbuildCjsConfig(),
			params.dts ?? new TscCjsDtsConfig(),
		);
	}
}
