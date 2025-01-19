import type { Builder } from "./Builder";

export interface CjsConfig {
	getBuilder(): Builder;
}
