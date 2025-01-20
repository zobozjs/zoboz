import { BuildConfig, esbuild, tsc } from "@zoboz/core";

export default new BuildConfig({
	esm: esbuild.esm(),
	cjs: esbuild.cjs(),
	dts: tsc.dts(),
	srcDir: "./src",
	distDir: "./dist",
	exports: {
		".": "./src/index.ts",
	},
});
