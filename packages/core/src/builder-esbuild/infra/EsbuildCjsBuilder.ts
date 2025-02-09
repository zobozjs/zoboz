import type {
	BuildParams,
	Builder,
} from "@shared/domain/interfaces/Builder.js";
import * as esbuild from "esbuild";
import * as process from "process";
import type { EsbuildOptions } from "../domain/interfaces/EsbuildOptions.js";

export class EsbuildCjsBuilder implements Builder {
	constructor(private readonly buildOptions?: EsbuildOptions) {}

	async build({
		filesRepository,
		srcDir,
		outDir,
		logger,
	}: BuildParams): Promise<void> {
		logger.pending(`Building CommonJS by esbuild to ${outDir.uri}`);

		await esbuild.build({
			absWorkingDir: process.cwd(),
			entryPoints: [`./${srcDir.uri}/**/*.ts`, `./${srcDir.uri}/**/*.tsx`],
			outdir: filesRepository.getAbsoluteUri(outDir.uri),
			format: "cjs",
			platform: "node",
			...(this.buildOptions || {}),
		});
	}
}
