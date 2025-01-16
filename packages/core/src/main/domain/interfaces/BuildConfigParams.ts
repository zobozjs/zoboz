import type { CjsConfig } from "./CjsConfig.js";
import type { DtsConfig } from "./DtsConfig.js";
import type { MjsConfig } from "./MjsConfig.js";

export interface BuildConfigParams {
	mjs: MjsConfig | null;
	cjs: CjsConfig | null;
	dts: DtsConfig | null;
	srcDir: "./src";
	distDir: string;
	exports: Record<"." | `.${string}`, `${string}.ts` | `${string}.tsx`>;
}
