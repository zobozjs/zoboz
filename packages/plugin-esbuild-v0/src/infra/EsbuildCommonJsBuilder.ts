import { type Builder, type FileNode, logger } from "@zoboz/core";
import * as esbuild from "esbuild";
import type { EsbuildOptions } from "../domain/interfaces/EsbuildOptions.js";

export class EsbuildCommonJsBuilder implements Builder {
	constructor(private readonly buildOptions?: EsbuildOptions) {}

	async build(packageDir: FileNode, outDir: string): Promise<void> {
		const relativeOutDir = await packageDir.getRelativeUriOf(outDir);

		logger.pending(`Building CommonJS by esbuild to ${relativeOutDir}`);

		await esbuild.build({
			entryPoints: ["./src/**/*.ts"],
			outdir: relativeOutDir,
			format: "cjs",
			platform: "node",
			...(this.buildOptions ?? {}),
		});
	}
}
