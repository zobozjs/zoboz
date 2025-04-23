import { TscEsmDtsConfig } from "builder-tsc/app/TscEsmDtsConfig";
import type { EsmDtsConfig } from "../interfaces/EsmDtsConfig";
import type { EsmJsConfig } from "../interfaces/EsmJsConfig";
import { EsbuildEsmConfig } from "builder-esbuild/domain/valueObject/EsbuildEsmConfig";

export class EsmConfig {
	private constructor(
		public readonly js: EsmJsConfig,
		public readonly dts: EsmDtsConfig,
	) {}

	public static create(params: {
		js?: EsmJsConfig;
		dts?: EsmDtsConfig;
	}): EsmConfig {
		return new EsmConfig(
			params.js ?? new EsbuildEsmConfig(),
			params.dts ?? new TscEsmDtsConfig(),
		);
	}
}
