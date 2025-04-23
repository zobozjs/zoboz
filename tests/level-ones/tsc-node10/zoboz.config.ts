import { BuildConfig, tsc } from "@zoboz/core";

export default new BuildConfig({
	esm: {
		js: tsc.esm.js(),
	},
	cjs: {
		js: tsc.cjs.js(),
	},
	srcDir: "./src",
	distDir: "./dist",
	exports: {
		".": "./src/index.ts",
	},
});
