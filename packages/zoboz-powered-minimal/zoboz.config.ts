import { BuildConfig, tsc } from "@zoboz/core";

export default new BuildConfig({
	mjs: new tsc.MjsConfig(),
	cjs: new tsc.CjsConfig(),
	dts: new tsc.DtsConfig(),
	exports: {
		".": "./src/index.ts",
	},
});
