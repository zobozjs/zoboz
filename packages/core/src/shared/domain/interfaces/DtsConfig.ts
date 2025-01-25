import type { Builder } from "./Builder.js";

export interface DtsConfig {
	getBuilder(): Builder;
}
