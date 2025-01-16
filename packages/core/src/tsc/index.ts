import { TscCjsConfig } from "./app/TscCjsConfig.js";
import { TscDtsConfig } from "./app/TscDtsConfig.js";
import { TscMjsConfig } from "./app/TscMjsConfig.js";

export const tsc = {
	MjsConfig: TscMjsConfig,
	CjsConfig: TscCjsConfig,
	DtsConfig: TscDtsConfig,
};
