import {
	EsbuildCjsConfig,
	type EsbuildCjsConfigOptions,
} from "./domain/valueObject/EsbuildCjsConfig.js";
import {
	EsbuildEsmConfig,
	type EsbuildEsmConfigOptions,
} from "./domain/valueObject/EsbuildEsmConfig.js";

export const esbuild = {
	esm: (options?: EsbuildEsmConfigOptions) => new EsbuildEsmConfig(options),
	cjs: (options?: EsbuildCjsConfigOptions) => new EsbuildCjsConfig(options),
};
