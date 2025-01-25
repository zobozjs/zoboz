import type { Builder } from "./Builder.js";

export interface EsmConfig {
	getBuilder(): Builder;
}
