import type { BuildConfigParams } from "../interfaces/BuildConfigParams.js";
import type { CjsConfig } from "../interfaces/CjsConfig.js";
import type { DtsConfig } from "../interfaces/DtsConfig.js";
import type { MjsConfig } from "../interfaces/MjsConfig.js";
import { ExportsConfig } from "./ExportsConfig.js";

export class BuildConfig {
	public readonly mjs: MjsConfig | null;
	public readonly cjs: CjsConfig | null;
	public readonly dts: DtsConfig | null;
	public readonly exports: ExportsConfig;

	constructor(params: BuildConfigParams) {
		this.mjs = params.mjs;
		this.cjs = params.cjs;
		this.dts = params.dts;
		this.exports = new ExportsConfig(params.exports);
	}
}
