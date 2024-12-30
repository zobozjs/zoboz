import { EsbuildCjsConfig } from "./domain/valueObject/EsbuildCjsConfig.js";
import { EsbuildMjsConfig } from "./domain/valueObject/EsbuildMjsConfig.js";

export const esbuildConfigs = {
	Mjs: EsbuildMjsConfig,
	Cjs: EsbuildCjsConfig,
};
