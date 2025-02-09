import { BuildConfig, esbuild, tsc } from "./src/index.js";

export default new BuildConfig({
	esm: esbuild.esm(),
	cjs: esbuild.cjs({
		esbuildOptions: {
			logOverride: {
				"empty-import-meta": "silent",
			},
		},
	}),
	dts: tsc.dts(),
	srcDir: "./src",
	distDir: "./dist",
	exports: {
		".": "./src/index.ts",
		"./extend": "./src/extend.ts",
	},
});
