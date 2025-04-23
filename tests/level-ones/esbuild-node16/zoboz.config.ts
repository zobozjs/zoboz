import { BuildConfig } from "@zoboz/core";

export default new BuildConfig({
	esm: {},
	cjs: {},
	srcDir: "./src",
	distDir: "./dist",
	exports: {
		".": "./src/index.ts",
	},
});
