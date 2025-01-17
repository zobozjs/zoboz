import type { Builder } from "../../../shared/domain/interfaces/Builder.js";

export interface EsmConfig {
	getBuilder(): Builder;
}
