import type { CjsJsConfig } from "./CjsJsConfig.js";
import type { EsmDtsConfig } from "./EsmDtsConfig.js";
import type { EsmJsConfig } from "./EsmJsConfig.js";

export interface BuildConfigParams {
	esm?: { js?: EsmJsConfig; dts?: EsmDtsConfig };
	cjs?: { js?: CjsJsConfig; dts?: EsmDtsConfig };
	srcDir: string;
	distDir: string;
	exports: Record<"." | `.${string}`, `${string}.ts` | `${string}.tsx`>;
}
