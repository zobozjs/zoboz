// for plugin authors
export type { EsmJsConfig } from "@shared/domain/interfaces/EsmJsConfig.js";
export type { EsmDtsConfig } from "@shared/domain/interfaces/EsmDtsConfig.js";
export type { CjsJsConfig } from "@shared/domain/interfaces/CjsJsConfig.js";
export type { CjsDtsConfig } from "@shared/domain/interfaces/CjsDtsConfig.js";
export type { OutDir } from "@shared/domain/valueObjects/OutDir.js";
export type { SrcDir } from "@shared/domain/valueObjects/SrcDir.js";
export type { ExportsConfig } from "@shared/domain/valueObjects/ExportsConfig.js";
export type {
	Builder,
	BuildParams,
} from "@shared/domain/interfaces/Builder.js";

export { deepMerge } from "@shared/supporting/deepMerge";
