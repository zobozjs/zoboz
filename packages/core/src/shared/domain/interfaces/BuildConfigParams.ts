import type { CjsConfig } from "./CjsConfig.js";
import type { DtsConfig } from "./DtsConfig.js";
import type { EsmConfig } from "./EsmConfig.js";

export interface BuildConfigParams {
	esm: EsmConfig | null;
	cjs: CjsConfig | null;
	dts: DtsConfig | null;
	srcDir: string;
	distDir: string;
	exports: Record<"." | `.${string}`, `${string}.ts` | `${string}.tsx`>;
}
