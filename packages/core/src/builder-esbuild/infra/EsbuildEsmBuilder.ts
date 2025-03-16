import type {
	BuildParams,
	Builder,
} from "@shared/domain/interfaces/Builder.js";
import * as esbuild from "esbuild";
import type { BuildOptions } from "esbuild";
import { deepMerge } from "extend.js";
import * as process from "process";
import type { EsbuildOptions } from "../domain/interfaces/EsbuildOptions.js";

export class EsbuildEsmBuilder implements Builder {
	constructor(private readonly buildOptions?: EsbuildOptions) {}

	async build({
		filesRepository,
		srcDir,
		outDir,
		logger,
	}: BuildParams): Promise<void> {
		logger.pending(`Building ES Module by esbuild to ${outDir.uri}`);

		const finalBuildOptions = deepMerge<BuildOptions>(
			{
				absWorkingDir: process.cwd(),
				entryPoints: [
					`./${srcDir.uri}/**/*.ts`,
					`./${srcDir.uri}/**/*.tsx`,
					`./${srcDir.uri}/**/*.json`,
				],
				outbase: filesRepository.getAbsoluteUri(srcDir.uri),
				outdir: filesRepository.getAbsoluteUri(outDir.uri),
				format: "esm",
				platform: "node",
				logOverride: {
					"empty-glob": "silent",
				},
			},
			this.buildOptions || {},
		);

		await esbuild.build(finalBuildOptions);
	}
}
