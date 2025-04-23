import { TscCjsDtsConfig } from "./app/TscCjsDtsConfig.js";
import { TscCjsJsConfig } from "./app/TscCjsJsConfig.js";
import { TscEsmDtsConfig } from "./app/TscEsmDtsConfig.js";
import { TscEsmJsConfig } from "./app/TscEsmJsConfig.js";

export const tsc = {
	esm: {
		js: () => new TscEsmJsConfig(),
		dts: () => new TscEsmDtsConfig(),
	},
	cjs: {
		js: () => new TscCjsJsConfig(),
		dts: () => new TscCjsDtsConfig(),
	},
};
