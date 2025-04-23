import type { Builder } from "./Builder.js";

export interface EsmJsConfig {
	getBuilder(): Builder;
}
