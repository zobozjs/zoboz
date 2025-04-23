import { BuildConfig, esbuild } from "./src/index.js";

export default new BuildConfig({
	esm: {},
	cjs: {
		js: esbuild.cjs({
			esbuildOptions: {
				logOverride: {
					"empty-import-meta": "silent",
				},
			},
		}),
	},
	srcDir: "./src",
	distDir: "./dist",
	exports: {
		".": "./src/index.ts",
		"./extend": "./src/extend.ts",
	},
});
