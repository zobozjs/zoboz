import { TscCjsConfig } from "./domain/valueObject/TscCjsConfig.js";
import { TscDtsConfig } from "./domain/valueObject/TscDtsConfig.js";
import { TscMjsConfig } from "./domain/valueObject/TscMjsConfig.js";

export const tsc = {
	MjsConfig: TscMjsConfig,
	CjsConfig: TscCjsConfig,
	DtsConfig: TscDtsConfig,
};
