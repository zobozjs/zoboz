import { BuildConfig, tsc } from "./src/index.js";

export default new BuildConfig({
	esm: tsc.esm(),
	cjs: tsc.cjs(),
	dts: tsc.dts(),
	srcDir: "./src",
	distDir: "./dist",
	exports: {
		".": "./src/index.ts",
		"./extend": "./src/extend.ts",
	},
});
