import { BuildConfig, build, tsc } from "../src/index.ts";

build(
	new BuildConfig({
		mjs: new tsc.MjsConfig(),
		cjs: new tsc.CjsConfig(),
		dts: new tsc.DtsConfig(),
		srcDir: "./src",
		distDir: "./dist",
		exports: {
			".": "./src/index.ts",
		},
	}),
);
