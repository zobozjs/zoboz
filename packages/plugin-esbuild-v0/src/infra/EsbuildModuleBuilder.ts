import { type Builder, type FileNode, logger } from "@zoboz/core";
import * as esbuild from "esbuild";
import type { EsbuildOptions } from "../domain/interfaces/EsbuildOptions.js";

export class EsbuildModuleBuilder implements Builder {
	constructor(
		public readonly outdir: string,
		private readonly buildOptions?: EsbuildOptions,
	) {}

	async build(packageDir: FileNode): Promise<void> {
		const outDir = await packageDir.getRelativeUriOf(this.outdir);

		logger.pending(`Building ES Module by esbuild to ${outDir}`);

		await esbuild.build({
			entryPoints: ["./src/**/*.ts"],
			outdir: outDir,
			format: "esm",
			platform: "node",
			...(this.buildOptions ?? {}),
		});
	}
}
