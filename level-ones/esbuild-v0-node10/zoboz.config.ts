import { BuildConfig, tsc } from "@zoboz/core";
import { esbuild } from "@zoboz/plugin-esbuild-v0";

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
