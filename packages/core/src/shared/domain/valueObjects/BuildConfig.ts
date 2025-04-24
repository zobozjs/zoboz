import type { BuildConfigParams } from "../interfaces/BuildConfigParams.js";
import { CjsConfig } from "./CjsConfig.js";
import { DistDir } from "./DistDir.js";
import { EsmConfig } from "./EsmConfig.js";
import { ExportsConfig } from "./ExportsConfig.js";
import { SrcDir } from "./SrcDir.js";

export class BuildConfig {
	public readonly esm: EsmConfig | null;
	public readonly cjs: CjsConfig | null;
	public readonly srcDir: SrcDir;
	public readonly distDir: DistDir;
	public readonly exports: ExportsConfig;

	constructor(params: BuildConfigParams) {
		this.esm = params.esm ? EsmConfig.create(params.esm) : null;
		this.cjs = params.cjs ? CjsConfig.create(params.cjs) : null;
		this.srcDir = new SrcDir(params.srcDir);
		this.distDir = new DistDir(params.distDir);
		this.exports = new ExportsConfig(this.srcDir, params.exports);
	}
}
