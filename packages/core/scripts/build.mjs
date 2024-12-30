import { BuildConfig, build, tsc } from "../src/index.ts";

build(
	new BuildConfig({
		mjs: new tsc.MjsConfig(),
		cjs: new tsc.CjsConfig(),
		dts: new tsc.DtsConfig(),
		exports: {
			".": "./src/index.ts",
		},
	}),
);
