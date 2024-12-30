import { BuildConfig, tsc } from "@zoboz/core";
import { esbuildConfigs } from "@zoboz/esbuild-v0";

export default new BuildConfig({
	mjs: new esbuildConfigs.Mjs(),
	cjs: new esbuildConfigs.Cjs(),
	dts: new tsc.DtsConfig(),
	exports: {
		".": "./src/index.ts",
	},
});
