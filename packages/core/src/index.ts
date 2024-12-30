export { BuildConfig } from "./main/domain/valueObjects/BuildConfig.js";
export { build } from "./main/presentation/build.js";
export { tsc } from "./tsc/index.js";

// for plugin authors
export type { MjsConfig } from "./main/domain/interfaces/MjsConfig.js";
export type { CjsConfig } from "./main/domain/interfaces/CjsConfig.js";
export type { DtsConfig } from "./main/domain/interfaces/DtsConfig.js";
export type { Builder } from "./shared/domain/interfaces/Builder.js";
export { FileNode } from "./shared/domain/entities/FileNode.js";
export { logger } from "./shared/supporting/logger.js";
