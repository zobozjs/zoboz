import type { CjsConfig } from "@shared/domain/interfaces/CjsConfig.js";
import type { BuildConfigParams } from "../interfaces/BuildConfigParams.js";
import type { DtsConfig } from "../interfaces/DtsConfig.js";
import type { EsmConfig } from "../interfaces/EsmConfig.js";
import { DistDir } from "./DistDir.js";
import { ExportsConfig } from "./ExportsConfig.js";
import { SrcDir } from "./SrcDir.js";

export class BuildConfig {
	public readonly esm: EsmConfig | null;
	public readonly cjs: CjsConfig | null;
	public readonly dts: DtsConfig | null;
	public readonly srcDir: SrcDir;
	public readonly distDir: DistDir;
	public readonly exports: ExportsConfig;

	constructor(params: BuildConfigParams) {
		this.esm = params.esm;
		this.cjs = params.cjs;
		this.dts = params.dts;
		this.srcDir = new SrcDir(params.srcDir);
		this.distDir = new DistDir(params.distDir);
		this.exports = new ExportsConfig(this.srcDir, params.exports);
	}
}
