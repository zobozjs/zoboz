export { BuildConfig } from "./main/domain/valueObjects/BuildConfig.js";
export { build } from "./main/presentation/build.js";
export { tsc } from "./tsc/index.js";

// for plugin authors
export type { EsmConfig } from "./main/domain/interfaces/EsmConfig.js";
export type { CjsConfig } from "./main/domain/interfaces/CjsConfig.js";
export type { DtsConfig } from "./main/domain/interfaces/DtsConfig.js";
export type { Builder } from "./shared/domain/interfaces/Builder.js";
export { FileNode } from "./shared/domain/entities/FileNode.js";
export { logger } from "./shared/supporting/logger.js";
