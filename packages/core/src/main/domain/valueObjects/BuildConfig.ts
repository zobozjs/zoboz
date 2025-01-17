import type { BuildConfigParams } from "../interfaces/BuildConfigParams.js";
import type { CjsConfig } from "../interfaces/CjsConfig.js";
import type { DtsConfig } from "../interfaces/DtsConfig.js";
import type { EsmConfig } from "../interfaces/EsmConfig.js";
import { ExportsConfig } from "./ExportsConfig.js";

export class BuildConfig {
	public readonly esm: EsmConfig | null;
	public readonly cjs: CjsConfig | null;
	public readonly dts: DtsConfig | null;
	public readonly srcDir: string;
	public readonly distDir: string;
	public readonly exports: ExportsConfig;

	constructor(params: BuildConfigParams) {
		this.esm = params.esm;
		this.cjs = params.cjs;
		this.dts = params.dts;
		this.srcDir = params.srcDir;
		this.distDir = params.distDir;
		this.exports = new ExportsConfig(params.exports);
	}
}
