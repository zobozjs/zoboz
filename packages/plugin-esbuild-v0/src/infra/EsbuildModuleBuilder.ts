import {
	type Builder,
	type ExportsConfig,
	type OutDir,
	type SrcDir,
	logger,
} from "@zoboz/core/extend";
import * as esbuild from "esbuild";
import type { EsbuildOptions } from "../domain/interfaces/EsbuildOptions.js";

export class EsbuildModuleBuilder implements Builder {
	constructor(private readonly buildOptions?: EsbuildOptions) {}

	async build(
		srcDir: SrcDir,
		exportsConfig: ExportsConfig,
		outDir: OutDir,
	): Promise<void> {
		logger.pending(`Building ES Module by esbuild to ${outDir.uri}`);

		await esbuild.build({
			entryPoints: ["./src/**/*.ts"],
			outdir: outDir.absoluteUri,
			format: "esm",
			platform: "node",
			...(this.buildOptions ?? {}),
		});
	}
}
