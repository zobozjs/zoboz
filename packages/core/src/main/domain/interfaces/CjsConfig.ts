import type { Builder } from "../../../shared/domain/interfaces/Builder.js";

export interface CjsConfig {
	getBuilder(): Builder;
}
