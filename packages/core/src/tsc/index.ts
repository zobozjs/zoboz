import { TscCjsConfig } from "./app/TscCjsConfig.js";
import { TscDtsConfig } from "./app/TscDtsConfig.js";
import { TscEsmConfig } from "./app/TscEsmConfig.js";

export const tsc = {
	esm: () => new TscEsmConfig(),
	cjs: () => new TscCjsConfig(),
	dts: () => new TscDtsConfig(),
};
